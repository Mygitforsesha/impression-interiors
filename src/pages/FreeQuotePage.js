import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addLead } from "../services/leads";

const LS_KEY = "ii_free_quote";

function StepShell({ title, subtitle, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
      <div className="text-sm font-semibold text-slate-900 md:text-base">{title}</div>
      {subtitle ? <div className="mt-1 text-sm text-slate-600">{subtitle}</div> : null}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function BigOption({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[44px] w-full rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition ${
        active ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

export default function FreeQuotePage() {
  const steps = useMemo(() => ["Property", "Budget", "Requirements", "Contact"], []);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [data, setData] = useState({
    propertyType: "",
    bhk: "",
    budget: "",
    requirements: [],
    name: "",
    phone: "",
    city: "",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setData((d) => ({ ...d, ...JSON.parse(raw) }));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [data]);

  const progressPct = Math.round(((step + 1) / steps.length) * 100);

  const canNext =
    (step === 0 && data.propertyType && data.bhk) ||
    (step === 1 && data.budget) ||
    (step === 2 && data.requirements.length > 0) ||
    (step === 3 && data.name && data.phone && data.city);

  const next = () => {
    if (!canNext) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!canNext) return;
    setSubmitting(true);
    setSubmitError("");

    const lead = {
      id: Date.now(),
      name: data.name.trim(),
      phone: data.phone.trim(),
      message: `${data.city ? `City: ${data.city}\n` : ""}BHK: ${data.bhk}\nRequirements: ${data.requirements.join(", ")}`,
      budget: data.budget,
      propertyType: data.propertyType,
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
            budget: lead.budget,
            propertyType: lead.propertyType,
            message: lead.message,
            createdAt: lead.createdAt,
          }),
        });
        if (!res.ok) throw new Error("Email notification failed");
      }

      await addLead(lead);
      setSubmitted(true);
      setData({
        propertyType: "",
        bhk: "",
        budget: "",
        requirements: [],
        name: "",
        phone: "",
        city: "",
      });
      setStep(0);
      try {
        localStorage.removeItem(LS_KEY);
      } catch {
        // ignore
      }
    } catch (err) {
      setSubmitError(err?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-2xl font-semibold text-slate-900 md:text-4xl">Free Quote</h1>
      <p className="mt-2 text-sm text-slate-600 md:text-base">
        A quick guided form. One question per step.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div>
            Step {step + 1}/{steps.length}: {steps[step]}
          </div>
          <div>{progressPct}%</div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full bg-slate-900 transition-all" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8"
            >
              <div className="text-sm font-semibold text-emerald-900">Submitted</div>
              <div className="mt-1 text-sm text-emerald-800">We will contact you soon.</div>
              <button
                type="button"
                className="mt-5 min-h-[44px] rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                onClick={() => setSubmitted(false)}
              >
                Edit response
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              {step === 0 && (
                <StepShell title="Step 1: Property details" subtitle="Select property type and BHK.">
                  <div className="grid gap-3">
                    <BigOption
                      active={data.propertyType === "Apartment"}
                      onClick={() => setData((d) => ({ ...d, propertyType: "Apartment" }))}
                    >
                      Apartment
                    </BigOption>
                    <BigOption
                      active={data.propertyType === "Villa"}
                      onClick={() => setData((d) => ({ ...d, propertyType: "Villa" }))}
                    >
                      Villa
                    </BigOption>
                    <BigOption
                      active={data.propertyType === "Office"}
                      onClick={() => setData((d) => ({ ...d, propertyType: "Office" }))}
                    >
                      Office
                    </BigOption>
                  </div>

                  <div className="mt-5">
                    <div className="text-sm font-medium text-slate-700">BHK</div>
                    <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {["1BHK", "2BHK", "3BHK", "4BHK+"].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setData((d) => ({ ...d, bhk: b }))}
                          className={`min-h-[44px] rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                            data.bhk === b ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </StepShell>
              )}

              {step === 1 && (
                <StepShell title="Step 2: Budget" subtitle="Pick a budget range.">
                  <div className="grid gap-3">
                    {["<5L", "5–10L", "10–20L", "20L+"].map((b) => (
                      <BigOption
                        key={b}
                        active={data.budget === b}
                        onClick={() => setData((d) => ({ ...d, budget: b }))}
                      >
                        {b}
                      </BigOption>
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 2 && (
                <StepShell title="Step 3: Requirements" subtitle="Select areas you want to design.">
                  <div className="grid gap-3">
                    {[
                      { id: "Full home", label: "Full home" },
                      { id: "Kitchen", label: "Kitchen" },
                      { id: "Wardrobe", label: "Wardrobe" },
                      { id: "Living room", label: "Living room" },
                    ].map((r) => {
                      const on = data.requirements.includes(r.id);
                      return (
                        <BigOption
                          key={r.id}
                          active={on}
                          onClick={() =>
                            setData((d) => ({
                              ...d,
                              requirements: on
                                ? d.requirements.filter((x) => x !== r.id)
                                : [...d.requirements, r.id],
                            }))
                          }
                        >
                          {r.label}
                        </BigOption>
                      );
                    })}
                  </div>
                </StepShell>
              )}

              {step === 3 && (
                <StepShell title="Step 4: Contact details" subtitle="So we can reach you quickly.">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-700">
                      Name
                      <input
                        value={data.name}
                        onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
                        className="mt-1 w-full min-h-[44px] rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        required
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Phone
                      <input
                        value={data.phone}
                        onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
                        className="mt-1 w-full min-h-[44px] rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        required
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      City
                      <input
                        value={data.city}
                        onChange={(e) => setData((d) => ({ ...d, city: e.target.value }))}
                        className="mt-1 w-full min-h-[44px] rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                        required
                      />
                    </label>
                  </div>
                </StepShell>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {submitError ? (
                  <div className="w-full rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                    {submitError}
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 0 || submitting}
                  className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
                >
                  Back
                </button>

                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={next}
                    disabled={!canNext || submitting}
                    className="min-h-[44px] w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 sm:w-auto"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submit}
                    disabled={!canNext || submitting}
                    className="min-h-[44px] w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 sm:w-auto"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

