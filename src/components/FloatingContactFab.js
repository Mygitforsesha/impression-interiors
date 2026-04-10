import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Phone, Plus } from "lucide-react";

const WHATSAPP_URL = process.env.REACT_APP_WHATSAPP_URL || "https://wa.me/918885991157";
const PHONE_URL = process.env.REACT_APP_PHONE_URL || "tel:+918885991157";
const INSTAGRAM_URL = process.env.REACT_APP_INSTAGRAM_URL || "https://www.instagram.com/impression_byhm/";

function InstagramGlyph({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FabAction({ href, label, className, icon }) {
  return (
    <motion.a
      href={href}
      target={href.startsWith("tel:") ? undefined : "_blank"}
      rel={href.startsWith("tel:") ? undefined : "noreferrer"}
      className={`group relative flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition ${className}`}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      {icon}
      <span className="pointer-events-none absolute right-14 hidden whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 md:block">
        {label}
      </span>
    </motion.a>
  );
}

export default function FloatingContactFab() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="mb-3 flex flex-col items-end gap-3"
          >
            <FabAction
              href={WHATSAPP_URL}
              label="WhatsApp"
              className="bg-emerald-500 text-white hover:bg-emerald-600"
              icon={<MessageCircle className="h-5 w-5" />}
            />
            <FabAction
              href={PHONE_URL}
              label="Call"
              className="bg-slate-800 text-white hover:bg-slate-900"
              icon={<Phone className="h-5 w-5" />}
            />
            <FabAction
              href={INSTAGRAM_URL}
              label="Instagram"
              className="bg-gradient-to-br from-pink-500 via-rose-500 to-purple-500 text-white"
              icon={<InstagramGlyph className="h-5 w-5" />}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition hover:bg-slate-800"
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: open ? 45 : 0 }}
        aria-label={open ? "Close contact actions" : "Open contact actions"}
      >
        <Plus className="h-6 w-6" />
      </motion.button>
    </div>
  );
}

