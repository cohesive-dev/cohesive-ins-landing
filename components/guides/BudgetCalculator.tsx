"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { OPENING_COSTS, MONTHLY_COSTS, budgetCsv, calculateBudget } from "@/lib/guides/budget";

const dollars = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export default function BudgetCalculator() {
  const [opening, setOpening] = useState<string[]>(OPENING_COSTS.map(() => ""));
  const [monthly, setMonthly] = useState<string[]>(MONTHLY_COSTS.map(() => ""));
  const [months, setMonths] = useState("");
  const [contingency, setContingency] = useState("");
  const [cash, setCash] = useState("");
  const totals = calculateBudget(opening, monthly, months, contingency, cash);

  function download() {
    const blob = new Blob([budgetCsv(opening, monthly, months, contingency, cash)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "restaurant-opening-budget.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    try { track("GuideBudgetDownload", { guide: "restaurant-startup-costs" }); } catch { /* Downloads do not depend on analytics. */ }
  }

  const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-950 focus:outline-2 focus:outline-offset-2 focus:outline-blue-600";
  return (
    <section id="budget-worksheet" aria-labelledby="budget-heading" className="my-10 rounded-2xl border border-blue-200 bg-blue-50/50 p-5 sm:p-8 scroll-mt-6">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Free tool · no email required</p>
      <h2 id="budget-heading" className="mt-2 text-2xl font-bold text-slate-950">Your restaurant opening budget</h2>
      <p className="mt-3 text-sm leading-6 text-slate-700">Enter your estimates in US dollars. Blank fields count as zero. Figures stay in this page and are lost on refresh; download a CSV to keep them. Downloads are counted, but your budget amounts are not sent to analytics.</p>
      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        {([{ title: "One-time opening costs", labels: OPENING_COSTS, values: opening, set: setOpening, prefix: "opening" }, { title: "Monthly cash needs", labels: MONTHLY_COSTS, values: monthly, set: setMonthly, prefix: "monthly" }]).map((group) => (
          <fieldset key={group.prefix} className="min-w-0 space-y-4">
            <legend className="mb-4 font-bold text-slate-950">{group.title}</legend>
            {group.labels.map((label, i) => (
              <div key={label}>
                <label htmlFor={`${group.prefix}-${i}`} className="mb-1 block text-sm font-medium text-slate-700">{label} ($)</label>
                <input id={`${group.prefix}-${i}`} type="number" min="0" max="1000000000" step="0.01" inputMode="decimal" placeholder="0" value={group.values[i]} onChange={(event) => group.set(group.values.map((value, index) => index === i ? event.target.value : value))} className={inputClass} />
              </div>
            ))}
          </fieldset>
        ))}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div><label htmlFor="reserve-months" className="mb-1 block text-sm font-medium">Reserve months (0–60)</label><input id="reserve-months" type="number" min="0" max="60" step="0.5" placeholder="0" value={months} onChange={(e) => setMonths(e.target.value)} className={inputClass} /></div>
        <div><label htmlFor="contingency" className="mb-1 block text-sm font-medium">Contingency % (0–100)</label><input id="contingency" type="number" min="0" max="100" step="0.1" placeholder="0" value={contingency} onChange={(e) => setContingency(e.target.value)} className={inputClass} /></div>
        <div><label htmlFor="available-cash" className="mb-1 block text-sm font-medium">Committed cash ($)</label><input id="available-cash" type="number" min="0" max="1000000000" step="0.01" inputMode="decimal" placeholder="0" value={cash} onChange={(e) => setCash(e.target.value)} className={inputClass} /></div>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-600">Reserve = monthly costs × months, with no sales assumed. Contingency applies only to one-time costs. Values below zero count as zero; months are capped at 60 and contingency at 100%. Avoid counting annual premiums and monthly installments twice.</p>
      <dl aria-live="polite" aria-atomic="true" className="my-6 space-y-3 rounded-xl bg-white p-5 text-sm">
        {[["One-time costs", totals.oneTime], ["Contingency", totals.contingencyTotal], ["Operating reserve", totals.reserve], ["Estimated total cash needed", totals.total], ["Committed available cash", totals.availableCash], ["Funding gap", totals.gap]].map(([label, value]) => (
          <div key={String(label)} className="flex items-baseline justify-between gap-4"><dt className={label === "Funding gap" ? "font-bold" : ""}>{label}</dt><dd className="text-right font-bold tabular-nums">{dollars(Number(value))}</dd></div>
        ))}
      </dl>
      <p className="mb-4 text-xs text-slate-600">Totals display rounded dollars; the CSV preserves cents. These are scenario calculations, not a financing recommendation or an insurance quote.</p>
      <button type="button" onClick={download} className="rounded-lg bg-[#2040E7] px-5 py-3 font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Download my budget (CSV)</button>
    </section>
  );
}
