import AcquisitionAttribution from "@/components/AcquisitionAttribution";
import RedditPageVisit from "@/components/RedditPageVisit";
import { REDDIT_PIXEL_ID } from "@/lib/reddit-pixel";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from 'react';
import { WebsiteTraffic } from '@/components/WebsiteTraffic';
import "./globals.css";

const META_PIXEL_ID = "831179966599677";
const OPENAI_PIXEL_ID = "SKHn7sfbd6r9B9vB51uM1d";
const GTM_ID = "GTM-PGN427T9";
const GOOGLE_ADS_ID = "AW-18581087843";
const ENABLE_GTM = process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview";
// Reddit pixel: production deploy only (never localhost or Vercel preview/QA builds).
const ENABLE_REDDIT = ENABLE_GTM;

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
      <head>
        {ENABLE_GTM && (
          <>
            <script async src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`} />
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GOOGLE_ADS_ID}');`,
              }}
            />
          </>
        )}
        {/* Reddit Ads pixel (Kevin 11/23). Inline in <head> so window.rdt (queue stub) exists
            before hydration: <RedditPageVisit/> fires PageVisit on every route view and forms
            call trackRedditLead(result) with the Meta/OpenAI conversion id. Production deploy
            only; localhost and Vercel preview get a no-op rdt. */}
        <script
          id="reddit-pixel"
          dangerouslySetInnerHTML={{
            __html: ENABLE_REDDIT
              ? `!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);rdt('init','${REDDIT_PIXEL_ID}');`
              : `window.rdt=window.rdt||function(){};`,
          }}
        />
      </head>
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
        {/* OpenAI (ChatGPT ads) measurement pixel, production only like Meta. Forms call
            oaiq("measure","lead_created",...) with the same event id they give Meta. */}
        {process.env.NODE_ENV === "production" ? (
        <Script id="openai-pixel" strategy="afterInteractive">
          {`!function(w,d,t,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;
var s=d.createElement(t);s.async=true;s.src=u;var f=d.getElementsByTagName(t)[0];f.parentNode.insertBefore(s,f)}
(window,document,'script','https://bzrcdn.openai.com/sdk/oaiq.min.js');
oaiq('init',{pixelId:'${OPENAI_PIXEL_ID}'});`}
        </Script>
        ) : (
        <Script id="openai-pixel-noop" strategy="afterInteractive">
          {`window.oaiq = window.oaiq || function(){};`}
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
        <AcquisitionAttribution />
        <RedditPageVisit />
        {children}
        <Analytics />
        <Suspense fallback={null}><WebsiteTraffic /></Suspense>
      </body>
    </html>
  );
}
