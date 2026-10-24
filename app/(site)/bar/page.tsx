import RestaurantIntakeForm from "@/components/RestaurantIntakeForm";

// /bar — the PAID destination for bar and tavern Meta ads (Arm B of the
// native-vs-website A/B preregistered 2026-09-24).
//
// Why this route exists at all: the bar ad originally pointed at /insurance/bar,
// which is the SEO page — 899 visible words, 14 headings, a four-question FAQ and
// 26 outbound state links before the form. Every other paid destination we run is
// form-first (/contractor-test 9 words, /commercial-property-quote 91,
// /restaurant 116). Pointing paid traffic at the SEO page suppresses fill rate,
// and it would have made the A/B measure "native form vs SEO article" instead of
// "native form vs website form" — handing native an artificial win on a
// destination defect (Kevin, 2026-09-24).
//
// mode="bar" keeps the bar and >50%-alcohol answers as E&S leads rather than
// disqualifying them, which is the whole point of the bar lane. layout="steps"
// matches /restaurant: one question per screen, Instant-Form order.
export default function Page() {
  return (
    <RestaurantIntakeForm layout="steps" mode="bar" source="bar-landing" />
  );
}
