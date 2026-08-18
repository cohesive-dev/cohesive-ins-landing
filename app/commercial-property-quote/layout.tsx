import type { Metadata } from "next";

// Mirrors app/commercial-property/layout.tsx on purpose. Without this the step
// cell inherits the ROOT metadata, so the two A/B cells would serve different
// page titles and link-preview cards — a difference that has nothing to do with
// the thing we're testing (long form vs one-question-per-screen) but would show
// up in the results. Only the canonical/og url differs, since they are separate
// routes.
export const metadata: Metadata = {
  title: "Commercial Property Insurance for Building Owners | Cohesive Insurance",
  description:
    "Property coverage for the commercial building you own, retail, office, mixed-use, warehouse, religious institution. Fast quotes from A-rated carriers.",
  alternates: { canonical: "/commercial-property-quote" },
  openGraph: {
    type: "website",
    url: "/commercial-property-quote",
    siteName: "Cohesive Insurance",
    title: "Commercial property insurance for building owners",
    description:
      "Property coverage for the commercial building you own, retail, office, mixed-use, warehouse, religious institution. Fast quotes from A-rated carriers.",
  },
  twitter: {
    card: "summary",
    title: "Commercial property insurance for building owners",
    description:
      "Property coverage for the commercial building you own. Fast quotes from A-rated carriers.",
  },
};

export default function CommercialPropertyQuoteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
