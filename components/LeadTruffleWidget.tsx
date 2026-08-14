"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

// Kevin 2026-08-13: LeadTruffle shows ONLY on the homepage and the /insurance
// pSEO pages. Every other page (vertical splash pages, /religious,
// /commercial-property, /contractors, /rate-check, ...) hides it - the bubble
// competes with the pages' own quote forms, especially on mobile.
const ALLOWED = (pathname: string) =>
  pathname === "/" || pathname.startsWith("/insurance");

export default function LeadTruffleWidget() {
  const pathname = usePathname();
  if (!pathname || !ALLOWED(pathname)) return null;

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
