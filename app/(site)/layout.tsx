import type { Metadata } from "next";
import RootDocument, { ROOT_METADATA } from "@/components/RootDocument";
import "../globals.css";

// Root layout for every English route (route group "(site)"; the URL paths are unchanged). The Spanish pages have
// their own root layout at app/es/layout.tsx so their server HTML says <html lang="es">.
export const metadata: Metadata = ROOT_METADATA;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
