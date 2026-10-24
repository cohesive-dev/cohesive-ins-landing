import Link from "next/link";
import type { ReactNode } from "react";
import { ORG_NAME } from "@/lib/entity";

// Frame for the Spanish (/es) pages. Since 2026-10-24 the /es routes have their own root layout (app/es/layout.tsx)
// that server-renders <html lang="es">, so the client-side lang switch is gone. The lang="es" wrapper stays for the
// shared components; search engines also get the hreflang alternates in each page's metadata and the sitemap.
export default function SpanishShell({ englishHref, children }: { englishHref?: string; children: ReactNode }) {
  return (
    <div lang="es" className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/es/seguro/contratistas" aria-label="Cohesive Insurance en español">
            <img src="/logo-long.png" alt="Cohesive" className="h-7 w-auto object-contain sm:h-8" />
          </Link>
          <nav aria-label="Idioma" className="flex items-center gap-2 text-sm">
            <span className="rounded-full bg-[#EEF1FF] px-3 py-1 font-semibold text-[#1A33B9]">Español</span>
            {englishHref && (
              <Link href={englishHref} hrefLang="en-US" lang="en" className="rounded-full px-3 py-1 font-semibold text-[#2040E7] underline">
                English
              </Link>
            )}
          </nav>
        </div>
      </header>
      {children}
      <footer className="border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-2 px-4 py-6 text-sm text-[#6B6D71] sm:px-6">
          <span>{ORG_NAME}, agencia de seguros con licencia</span>
          <Link href="/privacy" hrefLang="en" className="underline">Privacidad (en inglés)</Link>
          <Link href="/terms" hrefLang="en" className="underline">Términos (en inglés)</Link>
        </div>
      </footer>
    </div>
  );
}
