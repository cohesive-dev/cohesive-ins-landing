import type { Metadata } from "next";
import RootDocument, { ROOT_METADATA } from "@/components/RootDocument";
import "../globals.css";

// Root layout for the Spanish pages (/es/...). Server-renders <html lang="es"> (2026-10-24); the pages keep their
// own Spanish titles, descriptions, canonicals and hreflang through their metadata exports.
export const metadata: Metadata = ROOT_METADATA;

export default function SpanishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootDocument lang="es">{children}</RootDocument>;
}
