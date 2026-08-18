"use client";

import CommercialPropertyForm from "@/components/CommercialPropertyForm";

/**
 * /commercial-property-quote — the STEP-form challenger in the CP capture A/B
 * (Kevin 2026-08-17: "the restaurant-like progress state, one at a time").
 *
 * Same component as the /commercial-property control, one question per screen
 * with a progress bar — the layout that beat the long form on /restaurants.
 * Business questions first, contact last, so an abandon still tells us what
 * they own. Per-screen CPStep_* pixel events give the drop-off curve.
 */
export default function Page() {
  return <CommercialPropertyForm layout="steps" />;
}
