"use client";

import CommercialPropertyForm from "@/components/CommercialPropertyForm";

/**
 * /commercial-property — the LONG-form control in the CP capture A/B.
 *
 * Every question on one page. The step-form challenger lives at
 * /commercial-property-quote and renders the SAME component with
 * layout="steps", so the two cells can never drift apart on copy,
 * qualification rules or the value events they fire.
 */
export default function Page() {
  return <CommercialPropertyForm layout="long" />;
}
