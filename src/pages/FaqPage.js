import React from "react";

export default function FaqPage() {
  const faqs = [
    {
      q: "How do you calculate interior cost?",
      a: "We estimate based on carpet area, selected rooms, material grade, and design complexity.",
    },
    {
      q: "Do you provide modular kitchen and wardrobe separately?",
      a: "Yes. You can request kitchen-only, wardrobe-only, or full-home execution.",
    },
    {
      q: "How long does a project usually take?",
      a: "Timelines vary by scope; most residential projects complete in 6-12 weeks after final design sign-off.",
    },
    {
      q: "Can I choose my own materials?",
      a: "Absolutely. We guide you with options and then tailor the final budget around your choices.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-2xl font-semibold text-slate-900 md:text-4xl">FAQs</h1>
      <p className="mt-2 text-sm text-slate-600 md:text-base">
        Common questions about design, estimation, and execution.
      </p>

      <div className="mt-8 space-y-4">
        {faqs.map((item) => (
          <details key={item.q} className="group rounded-2xl border border-slate-200 bg-white p-5">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 md:text-base">
              {item.q}
            </summary>
            <p className="mt-2 text-sm text-slate-600">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

