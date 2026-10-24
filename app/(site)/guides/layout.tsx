import Link from "next/link";

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-white text-slate-900">
    <header className="border-b border-slate-200 print:hidden">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-[#2040E7]">Cohesive<span className="ml-2 text-sm font-medium text-slate-500">Insurance</span></Link>
        <nav aria-label="Main navigation" className="flex gap-5 text-sm font-semibold"><Link href="/guides">Startup guides</Link><Link href="/insurance">Insurance guides</Link></nav>
      </div>
    </header>
    {children}
    <footer className="border-t border-slate-200 print:hidden"><div className="mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-3 px-5 py-8 text-sm text-slate-600"><span>Cohesive Insurance Services</span><Link href="/guides">Startup guides</Link><Link href="/insurance">Insurance guides</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></footer>
  </div>;
}
