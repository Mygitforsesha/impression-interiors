import React from "react";
import { Calculator, CheckCircle2, Home, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

export default function EstimationInteriorPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 md:grid-cols-2 md:p-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
            <Calculator className="h-3.5 w-3.5" /> Home Interior Estimation
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900 md:text-4xl">
            Plan your interior budget with confidence
          </h1>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Get a practical estimate based on space size, scope of work, and finish quality.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/free-quote" className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              Get Detailed Quote
            </Link>
            <Link to="/projects" className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50">
              View Projects
            </Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          <img src="/image1-unsplash.jpg" alt="Modern interior estimate reference" className="block h-full w-full object-cover" loading="lazy" />
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { icon: <Home className="h-5 w-5" />, title: "Scope Based", text: "Estimate by full home, selected rooms, or modular-only requirements." },
          { icon: <Wallet className="h-5 w-5" />, title: "Budget Friendly", text: "Choose between essential, premium, and luxury finish benchmarks." },
          { icon: <CheckCircle2 className="h-5 w-5" />, title: "Transparent", text: "Clear breakup and recommendation guidance from our design team." },
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

