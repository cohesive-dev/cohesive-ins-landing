"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

export default function StartupChecklist({ title, slug, tasks, sources }: { title: string; slug: string; tasks: string[]; sources: { label: string; href: string }[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  function download() {
    const content = `${title}\nhttps://www.cohesiveinsure.com/guides/${slug}\n\n${tasks.map((task, i) => `[${checked.has(i) ? "x" : " "}] ${task}\n    Owner: __________  Due: __________  Notes: __________`).join("\n\n")}\n\nSources and related resources\n${sources.map((s) => `${s.label}: ${s.href.startsWith("/") ? "https://www.cohesiveinsure.com" : ""}${s.href}`).join("\n")}\n\nPlanning checklist; confirm requirements with the responsible authority.\n`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `${slug}-checklist.txt`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    try { track("StartupChecklistDownload", { guide: slug }); } catch { /* Download always works. */ }
  }
  return <section id="startup-checklist" aria-labelledby="startup-checklist-heading" className="my-10 rounded-2xl border border-blue-200 bg-blue-50/40 p-5 sm:p-7">
    <h2 id="startup-checklist-heading" className="text-2xl font-bold">Your startup action list</h2>
    <p className="mt-3 text-sm leading-6 text-slate-600">Mark completed tasks, then download a copy with room for owners, dates, and notes. Progress stays on this page until you leave or refresh. No email required.</p>
    <p aria-live="polite" className="mt-4 text-sm font-semibold text-blue-700">{checked.size} of {tasks.length} completed</p>
    <ul className="my-5 space-y-3">{tasks.map((task, i) => <li key={task}><label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" checked={checked.has(i)} onChange={(e) => setChecked((previous) => { const next = new Set(previous); if(e.target.checked) next.add(i); else next.delete(i); return next; })} className="mt-1 h-4 w-4 shrink-0 accent-blue-700"/><span className={checked.has(i) ? "text-slate-500 line-through" : ""}>{task}</span></label></li>)}</ul>
    <button type="button" onClick={download} className="rounded-lg bg-[#2040E7] px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 print:hidden">Download my checklist</button>
  </section>;
}
