import { useEffect, useRef, useState } from "react";

export function useSpeechInput(onTranscript) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);
  useEffect(()=>{
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR(); rec.lang = "en-IN"; rec.interimResults = false; rec.continuous = false;
    rec.onresult = (e)=>{ const txt = Array.from(e.results).map
