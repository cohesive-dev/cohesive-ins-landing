import RestaurantIntakeForm from "@/components/RestaurantIntakeForm";

// /restaurant — deep intake landing lane for restaurants, bars, cafes, and
// food businesses (A/B counterpart to the native Meta Instant Form). All form
// logic, qualification, and conversion tracking live in
// components/RestaurantIntakeForm, shared with the SEO pages under
// /insurance/[vertical]/[geo]. Defaults preserve this page's exact behavior
// (source "restaurant-landing", full-page hero + terminal screens).
export default function Page() {
  return <RestaurantIntakeForm />;
}
