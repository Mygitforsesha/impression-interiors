import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import { addLead } from "../services/leads";

const WHATSAPP_URL = process.env.REACT_APP_WHATSAPP_URL || "https://wa.me/918885991157";
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

export default function ContactPage() {
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const lead = {
      id: Date.now(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      message: form.message.trim(),
      budget: "",
      propertyType: "General",
      createdAt: new Date().toISOString(),
    };

    try {
      const endpoint = process.env.REACT_APP_FORMSPREE_ENDPOINT;
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            name: lead.name,
            phone: lead.phone,
            message: lead.message,
            budget: lead.budget,
            propertyType: lead.propertyType,
            createdAt: lead.createdAt,
          }),
        });
        if (!res.ok) throw new Error("Email notification failed");
      }

      await addLead(lead);
      setForm({ name: "", phone: "", message: "" });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err?.message || "Submission failed. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-2xl font-semibold text-slate-900 md:text-4xl">Contact</h1>
      <p className="mt-2 text-sm text-slate-600 md:text-base">
        Share your requirements and we’ll get back to you.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          {status === "success" ? (
            <div className="rounded-2xl bg-emerald-50 p-6 text-emerald-900">
              <div className="text-sm font-semibold">Success</div>
              <div className="mt-1 text-sm">Thanks! We will contact you soon.</div>
              <button
                type="button"
                className="mt-4 min-h-[44px] rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                onClick={() => setStatus("idle")}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              {status === "error" ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                  {error}
                </div>
              ) : null}
              <label className="block text-sm font-medium text-slate-700">
                Name
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-1 w-full min-h-[44px] rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Phone
                <input
                  required
                  type="number"
                  value={form.phone}
                  maxLength={10}
                  minLength={10}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="mt-1 w-full min-h-[44px] rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Message
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                />
              </label>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full min-h-[44px] rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60 sm:w-auto"
              >
                {status === "submitting" ? "Submitting..." : "Submit"}
              </button>
            </form>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-semibold text-slate-900 md:text-base">Quick links</div>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <a
              className="group flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Open WhatsApp"
            >
              <div>
                <div className="font-medium">WhatsApp</div>
                <div className="mt-1 text-xs text-slate-500">Tap to chat on WhatsApp</div>
              </div>
              <MessageCircle className="h-5 w-5 text-emerald-600 transition group-hover:scale-110" />
            </a>
            <a
              className="group flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Open Instagram"
            >
              <div>
                <div className="font-medium">Instagram</div>
                <div className="mt-1 text-xs text-slate-500">Visit our Instagram profile</div>
              </div>
              <InstagramGlyph className="h-5 w-5 text-pink-600 transition group-hover:scale-110" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

