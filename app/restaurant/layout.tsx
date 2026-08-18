import type { Metadata } from "next";

// The /restaurant page is a client component, so it can't export `metadata`
// itself. This route-segment layout supplies the restaurant-specific Open
// Graph / Twitter tags so FB ad link-previews and organic shares of the
// restaurant landing page show a restaurant card — not the site-wide
// contractor blurb it would otherwise inherit from the root layout.
export const metadata: Metadata = {
  title: "Restaurant & Bar Insurance | Cohesive Insurance",
  description:
    "General liability and property coverage for restaurants, cafes, and food businesses. Fast quotes, A-rated carriers, and plain-English guidance.",
  alternates: { canonical: "/restaurant" },
  openGraph: {
    type: "website",
    url: "/restaurant",
    siteName: "Cohesive Insurance",
    title: "Insurance for your restaurant",
    description:
      "General liability and property coverage for restaurants and food businesses. Fast quotes, A-rated carriers.",
    images: [
      {
        url: "/og/default.png",
        width: 1200,
        height: 630,
        alt: "Cohesive Insurance, insurance for restaurants",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insurance for your restaurant",
    description:
      "General liability and property coverage for restaurants and food businesses.",
    images: ["/og/default.png"],
  },
};

export default function RestaurantLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
