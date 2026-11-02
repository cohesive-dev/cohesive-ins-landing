"use client";
import { useState } from "react";
import Link from "next/link";

export default function GuideFinder({ industries, states, guides }: { industries: string[]; states: { slug: string; name: string }[]; guides: { slug: string; title: string; industry: string; stateSlug: string }[] }) {
  const [industry, setIndustry] = useState(industries[0]);
  const [state, setState] = useState("");
  const visible = guides.filter((g) => g.industry === industry && (!state || g.stateSlug === state));
  return <section id="find-your-state" className="mx-auto max-w-6xl px-5 py-12" aria-labelledby="state-finder-heading">
    <h2 id="state-finder-heading" className="text-2xl font-bold">Find your business and state</h2><p className="mt-2 leading-7 text-slate-600">Restaurant and service-business startup resources for all 50 states.</p>
    <div className="mt-6 grid max-w-2xl gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Business type<select className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3" value={industry} onChange={(e) => setIndustry(e.target.value)}>{industries.map((name) => <option key={name}>{name}</option>)}</select></label><label className="text-sm font-semibold">State<select className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3" value={state} onChange={(e) => setState(e.target.value)}><option value="">All states</option>{states.map((s) => <option value={s.slug} key={s.slug}>{s.name}</option>)}</select></label></div>
    <p aria-live="polite" className="mt-5 text-sm text-slate-500">{visible.length} {visible.length === 1 ? "guide" : "guides"}</p>
    <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{visible.map((g) => <li key={g.slug}><Link className="block rounded-xl border border-slate-200 p-4 text-sm font-semibold leading-6 text-blue-700 hover:border-blue-500" href={`/guides/${g.slug}`}>{g.title} →</Link></li>)}</ul>
  </section>;
}
