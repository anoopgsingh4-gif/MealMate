import { useEffect, useRef, useState } from "react";

/**
 * useSpeechInput
 * Pure logic (no JSX). Keeps .js extension valid for Vite.
 *
 * @param {(text:string)=>void} onTranscript
 * @returns {{listening: boolean, start: ()=>void, stop: ()=>void}}
 */
export function useSpeechInput(onTranscript) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return; // browser not supported; UI should handle this case

    const rec = new SR();
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.continuous = false;

    rec.onresult = (e) => {
      const txt = Array.from(e.results)
        .map((r) => r[0]?.transcript || "")
        .join(" ");
      if (txt && typeof onTranscript === "function") onTranscript(txt);
    };

    rec.onend = () => setListening(false);

    recRef.current = rec;

    // optional cleanup (not strictly needed for short-lived hook usage)
    return () => {
      try {
        rec.onresult = null;
        rec.onend = null;
        if (recRef.current) recRef.current.abort?.();
      } catch {}
    };
  }, [onTranscript]);

  const start = () => {
    const rec = recRef.current;
    if (!rec) {
      alert("Voice input not supported in this browser.");
      return;
    }
    setListening(true);
    try {
      rec.start();
    } catch {
      // Some implementations throw if already started
    }
  };

  const stop = () => {
    const rec = recRef.current;
    if (!rec) return;
    try {
      rec.stop();
    } catch {}
  };

  return { listening, start, stop };
}
