import React from "react";
import { Archive, Layers, Shirt } from "lucide-react";
import { Link } from "react-router-dom";

export default function EstimationWardrobePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 md:grid-cols-2 md:p-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
            <Archive className="h-3.5 w-3.5" /> Wardrobe Estimation
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900 md:text-4xl">Wardrobe planning with practical costing</h1>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Estimate wardrobe budget by door type, internals, dimensions, and accessories.
          </p>
          <div className="mt-6">
            <Link to="/free-quote" className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              Get Wardrobe Quote
            </Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          <img src="/image8-unsplash.jpg" alt="Wardrobe estimation" className="block h-full w-full object-cover" loading="lazy" />
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { icon: <Layers className="h-5 w-5" />, title: "Internal modules", text: "Drawers, hanging sections, lofts, and open shelves influence costing." },
          { icon: <Shirt className="h-5 w-5" />, title: "Daily utility", text: "Design wardrobe internals based on your usage habits and storage goals." },
          { icon: <Archive className="h-5 w-5" />, title: "Door systems", text: "Swing or sliding shutters with chosen finish, handles, and channels." },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-2 inline-flex rounded-lg bg-slate-100 p-2 text-slate-800">{item.icon}</div>
            <h3 className="text-sm font-semibold text-slate-900 md:text-base">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

