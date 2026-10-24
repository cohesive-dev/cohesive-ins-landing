import RestaurantIntakeForm from "@/components/RestaurantIntakeForm";

// /restaurant — deep intake landing lane for restaurants, bars, cafes, and
// food businesses (A/B counterpart to the native Meta Instant Form). All form
// logic, qualification, and conversion tracking live in
// components/RestaurantIntakeForm, shared with the SEO pages under
// /insurance/[vertical]/[geo]. Defaults preserve this page's exact behavior
// (source "restaurant-landing", full-page hero + terminal screens).
export default function Page() {
  // layout="steps": one question per screen, Instant-Form order (Kevin 2026-08-16). The SEO
  // pages under /insurance/[vertical]/[geo] keep the long layout as the control.
  return <RestaurantIntakeForm layout="steps" />;
}
