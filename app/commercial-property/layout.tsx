import type { Metadata } from "next";

// The /commercial-property page is a client component, so it can't export
// `metadata` itself. This route-segment layout supplies the LRO-specific Open
// Graph / Twitter tags so FB ad link-previews and organic shares show a
// commercial-property card — not the site-wide contractor blurb it would
// otherwise inherit from the root layout.
export const metadata: Metadata = {
  title: "Commercial Property Insurance for Building Owners | Cohesive Insurance",
  description:
    "Property coverage for the commercial building you own — retail, office, mixed-use, warehouse. Fast quotes from A-rated carriers.",
  alternates: { canonical: "/commercial-property" },
  openGraph: {
    type: "website",
    url: "/commercial-property",
    siteName: "Cohesive Insurance",
    title: "Commercial property insurance for building owners",
    description:
      "Property coverage for the commercial building you own — retail, office, mixed-use, warehouse. Fast quotes from A-rated carriers.",
  },
  twitter: {
    card: "summary",
    title: "Commercial property insurance for building owners",
    description:
      "Property coverage for the commercial building you own. Fast quotes from A-rated carriers.",
  },
};

export default function CommercialPropertyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
