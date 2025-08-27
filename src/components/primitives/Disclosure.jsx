import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Disclosure({ title, defaultOpen=false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4">
      <button
        className="w-full flex items-center justify-between px-2 py-2 rounded-lg bg-white border hover:bg-gray-50"
        aria-expanded={open}
        onClick={()=>setOpen(o=>!o)}
      >
        <span className="font-semibold text-lg">{title}</span>
        <span className="text-xl leading-none select-none">{open ? "-" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{height:0,opacity:0}}
            animate={{height:"auto",opacity:1}}
            exit={{height:0,opacity:0}}
            className="mt-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
