import type { Metadata } from "next";

// The /bar page is a client component, so it can't export `metadata` itself.
// This route-segment layout supplies the bar-specific Open Graph / Twitter tags
// so FB ad link-previews show a bar card, not the site-wide contractor blurb it
// would otherwise inherit from the root layout.
//
// noindex, follow — exactly like /restaurant and /commercial-property-quote.
// This is a PAID destination, not an SEO asset: the SEO page for bars lives at
// /insurance/bar and keeps the long-form cost/coverage/FAQ content and the 26
// state links. Two routes, two jobs. Indexing this one would put a bare form in
// competition with the page written to rank.
export const metadata: Metadata = {
  title: "Bar & Nightclub Insurance | Cohesive Insurance",
  description:
    "Compare general liability and liquor liability options for bars, taverns, and nightclubs with a licensed agent.",
  alternates: { canonical: "/bar" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    url: "/bar",
    siteName: "Cohesive Insurance",
    title: "Insurance for bars and nightclubs",
    description:
      "Tell us about your venue and a licensed agent will review general liability and liquor liability options.",
    images: [
      {
        url: "/og/default.png",
        width: 1200,
        height: 630,
        alt: "Cohesive Insurance, insurance for bars and nightclubs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insurance for bars and nightclubs",
    description:
      "Review general liability and liquor liability options for your venue.",
    images: ["/og/default.png"],
  },
};

export default function BarLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
