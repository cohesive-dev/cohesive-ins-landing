import type { VendorComparison as Comparison } from "@/lib/guides/vendors";

export default function VendorComparison({ comparison }: { comparison: Comparison }) {
  return <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200" tabIndex={0} role="region" aria-label={comparison.caption}>
    <table className="w-full min-w-[620px] table-fixed text-left text-sm leading-6">
      <caption className="bg-slate-50 p-4 text-left font-semibold">{comparison.caption}</caption>
      <thead className="border-y border-slate-200 bg-slate-50"><tr><th scope="col" className="w-1/4 p-4">Provider / route</th><th scope="col" className="w-1/3 p-4">When to consider it</th><th scope="col" className="p-4">Cost and what to check</th></tr></thead>
      <tbody>{comparison.rows.map((row) => <tr key={row.name} className="border-b border-slate-200 last:border-0"><th scope="row" className="p-4 align-top font-semibold"><a href={row.href} className="text-blue-700 underline underline-offset-4">{row.name} ↗</a></th><td className="p-4 align-top text-slate-700">{row.fit}</td><td className="p-4 align-top text-slate-700"><p className="font-medium text-slate-900">{row.cost}</p><p className="mt-3">{row.watch}</p></td></tr>)}</tbody>
    </table>
  </div>;
}
