"use client";
import { useEffect } from "react";
import { trackRooferOffer } from "@/lib/roofer-offer-tracking";

export default function RooferOfferTracking() {
  useEffect(() => {
    trackRooferOffer("LandingView");
    const onClick = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[data-roofer-cta]") : null;
      if (anchor) trackRooferOffer("QuoteClick", { placement: anchor.dataset.rooferCta });
    };
    document.addEventListener("click", onClick);
    // Observe the form heading, not the entire tall form: 25% of a tall form
    // might never fit on a mobile screen.
    const target = document.querySelector("#quote h1");
    const observer = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) trackRooferOffer("FormView");
    }, { threshold: 0.5 }) : null;
    if (target) observer?.observe(target);
    return () => { document.removeEventListener("click", onClick); observer?.disconnect(); };
  }, []);
  return null;
}
