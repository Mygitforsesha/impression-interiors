import React from "react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-2xl font-semibold text-slate-900 md:text-4xl">About</h1>
      <p className="mt-4 max-w-prose text-sm leading-6 text-slate-700 md:text-base">
        Impression Interiors creates warm, functional spaces with modern aesthetics. We focus on thoughtful layouts,
        premium finishes, and reliable execution—optimized for the way you live and work.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          <img
            src="/image5-unsplash.jpg"
            alt="Elegant dining and living interior"
            loading="lazy"
            className="block h-auto w-full"
          />
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          <img
            src="/image6-unsplash.jpg"
            alt="Minimal premium bedroom interior"
            loading="lazy"
            className="block h-auto w-full"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Design-first", desc: "Moodboards, space planning, and material selection." },
          { title: "Execution-ready", desc: "Clear timelines with quality workmanship." },
          { title: "Mobile-first portfolio", desc: "Optimized images for fast browsing." },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-sm font-semibold text-slate-900 md:text-base">{c.title}</div>
            <div className="mt-1 text-sm text-slate-600">{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

