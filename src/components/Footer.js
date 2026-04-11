import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

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

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-4 md:px-6">

        {/* Brand */}
        <div className="transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Impression Interiors logo" className="h-10 w-10 rounded-xl border border-slate-200 object-cover" />
            <div>
              <div className="text-sm font-semibold text-slate-900">Impression Interiors</div>
              <div className="text-xs text-slate-500">Premium Interior Design</div>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            We craft elegant, practical interiors that feel timeless and personal.
          </p>
        </div>

        {/* Links */}
        <div>
          <div className="text-sm font-semibold text-slate-900">Quick links</div>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <Link className="block transition-all duration-200 hover:text-slate-900 hover:translate-x-1" to="/">Home</Link>
            <Link className="block transition-all duration-200 hover:text-slate-900 hover:translate-x-1" to="/projects">Projects</Link>
            <Link className="block transition-all duration-200 hover:text-slate-900 hover:translate-x-1" to="/about">About Us</Link>
            <Link className="block transition-all duration-200 hover:text-slate-900 hover:translate-x-1" to="/faqs">FAQs</Link>
          </div>
        </div>

        {/* Estimation */}
        <div>
          <div className="text-sm font-semibold text-slate-900">Estimations</div>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <Link className="block transition-all duration-200 hover:text-slate-900 hover:translate-x-1" to="/estimation/interior">Home Interior Estimation</Link>
            <Link className="block transition-all duration-200 hover:text-slate-900 hover:translate-x-1" to="/estimation/kitchen">Kitchen Estimation</Link>
            <Link className="block transition-all duration-200 hover:text-slate-900 hover:translate-x-1" to="/estimation/wardrobe">Wardrobe Estimation</Link>
            <Link className="block transition-all duration-200 hover:text-slate-900 hover:translate-x-1" to="/free-quote">Free Quote</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <div className="text-sm font-semibold text-slate-900">Connect</div>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <a href={PHONE_URL} className="flex items-center gap-2 transition-all duration-200 hover:text-slate-900 hover:translate-x-1 active:scale-[0.97]"><Phone className="h-4 w-4" /> Call us</a>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition-all duration-200 hover:text-slate-900 hover:translate-x-1 active:scale-[0.97]"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 transition-all duration-200 hover:text-slate-900 hover:translate-x-1 active:scale-[0.97]"><InstagramGlyph className="h-4 w-4" /> Instagram</a>
            <a href="mailto:hello@impressioninteriors.com" className="flex items-center gap-2 transition-all duration-200 hover:text-slate-900 hover:translate-x-1 active:scale-[0.97]"><Mail className="h-4 w-4" /> Impressionbyhm@gmail.com</a>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Hyderabad, India</div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 py-4">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-xs text-slate-500 md:flex-row md:px-6">
          <div>© {new Date().getFullYear()} Impression Interiors. All rights reserved.</div>
          <div>Designed for a premium interior experience.</div>
        </div>
      </div>
    </footer>
  );
}