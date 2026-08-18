import type { Metadata } from "next";

// The /religious page is a client component, so it can't export `metadata`
// itself. This route-segment layout supplies the church-specific Open Graph /
// Twitter tags so FB ad link-previews and organic shares of the church landing
// page show a house-of-worship card — not the site-wide contractor blurb it
// would otherwise inherit from the root layout.
export const metadata: Metadata = {
  title: "Church & House of Worship Insurance | Cohesive Insurance",
  description:
    "General liability and property coverage for houses of worship. Fast quotes, A-rated carriers, and plain-English guidance.",
  alternates: { canonical: "/religious" },
  openGraph: {
    type: "website",
    url: "/religious",
    siteName: "Cohesive Insurance",
    title: "Insurance for houses of worship",
    description:
      "General liability and property coverage for houses of worship. Fast quotes, A-rated carriers.",
    images: [
      {
        url: "/og/religious.png",
        width: 1200,
        height: 630,
        alt: "Cohesive Insurance, insurance for houses of worship",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insurance for houses of worship",
    description:
      "General liability and property coverage for houses of worship.",
    images: ["/og/religious.png"],
  },
};

export default function ReligiousLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
