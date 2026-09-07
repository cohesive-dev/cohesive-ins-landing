"use client";

import { track } from "@vercel/analytics";

export function GuideQuoteLink({ slug, placement = "sidebar" }: { slug: string; placement?: string }) {
  return <a href="#quote" onClick={() => { try { track("GuideQuoteClick", { guide: slug, placement }); } catch { /* Navigation always works. */ } }} className="inline-block rounded-lg bg-[#2040E7] px-5 py-3 font-semibold text-white hover:bg-blue-800">Get coverage options with Cohesive</a>;
}

export function PrintGuide() {
  return <button type="button" onClick={() => window.print()} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Print this guide</button>;
}
