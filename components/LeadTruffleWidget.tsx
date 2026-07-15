"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

// The chat bubble competes with the embedded Next quote flow on the vertical
// splash pages (it auto-opens on top of the form fields on mobile), so skip
// it there.
const SPLASH_ROUTES = [
  "/restaurants",
  "/cleaning",
  "/beauty",
  "/fitness",
  "/retail",
  "/landscaping",
  "/painting",
];

export default function LeadTruffleWidget() {
  const pathname = usePathname();
  if (pathname && SPLASH_ROUTES.some((r) => pathname.startsWith(r))) return null;

  return (
    <Script id="leadtruffle-widget" strategy="afterInteractive">
      {`(function () {
  var s = document.createElement('script');
  s.src = "https://embeds-v1.leadtruffle.com/tooldesk-widget.js";
  s.async = true;
  s.onload = function () {
    window.LTWidget.initialize({
      companyId: "54e15aec-f591-4859-9e29-a9b10f65981a"
    });
  };
  document.head.appendChild(s);
})();`}
    </Script>
  );
}
