import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <div className="text-2xl font-semibold text-slate-900 md:text-4xl">404</div>
        <div className="mt-2 text-sm text-slate-600 md:text-base">Page not found.</div>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

