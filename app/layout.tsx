import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const META_PIXEL_ID = "831179966599677";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  // Required so relative Open Graph image URLs (e.g. the church /religious card)
  // resolve to the live domain in the rendered <meta> tags instead of localhost.
  metadataBase: new URL("https://www.cohesiveinsure.com"),
  title: "Cohesive Insurance: Coverage for the Businesses That Keep America Running",
  description: "Data-driven commercial insurance for contractors, trucking, manufacturing, and hospitality. A-rated carriers, fast quotes, plain-English guidance.",
  // Default social/link-preview card. Per-vertical routes (e.g. /religious)
  // override this with their own openGraph block.
  openGraph: {
    type: "website",
    siteName: "Cohesive Insurance",
    title: "Cohesive Insurance: Coverage for the Businesses That Keep America Running",
    description: "Data-driven commercial insurance. A-rated carriers, fast quotes, plain-English guidance.",
    images: [{ url: "/og/default.png", width: 1200, height: 630, alt: "Cohesive Insurance" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cohesive Insurance",
    description: "Data-driven commercial insurance. A-rated carriers, fast quotes, plain-English guidance.",
    images: ["/og/default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-[var(--font-sans)]">
        {/* Meta Pixel Code */}
        {/* Pixel is PRODUCTION-ONLY: localhost / preview runs must never write to the real
            dataset (2026-08-16: a day of local Playwright walks put ~40 fake funnel events +
            7 fake Leads into pixel 831179966599677). Non-prod gets a no-op fbq so callers
            don't need guards. */}
        {process.env.NODE_ENV === "production" ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
        ) : (
        <Script id="meta-pixel-noop" strategy="afterInteractive">
          {`window.fbq = window.fbq || function(){ if (window.__FBQ_DEBUG) console.debug('[fbq noop]', arguments); };`}
        </Script>
        )}
        {process.env.NODE_ENV === "production" && (
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        )}
        {/* End Meta Pixel Code */}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
