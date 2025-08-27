import { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Disclosure({ title, defaultOpen=false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="mb-4">
      <button
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white border hover:bg-gray-50 transition-colors"
        aria-expanded={open}
        aria-controls={`panel-${id}`}
        onClick={() => setOpen(o => !o)}
      >
        <span className="font-semibold text-lg">{title}</span>
        <span
          className="text-xl leading-none select-none w-5 text-center"
          aria-hidden
        >
          {open ? "−" : "+"}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`panel-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: 0.25 } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
            className="mt-2 overflow-hidden"
          >
            <div className="will-change-transform">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
