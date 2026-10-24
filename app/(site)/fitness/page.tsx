import QuoteSplash, { type SplashConfig } from "@/components/QuoteSplash";

const config: SplashConfig = {
  "slug": "fitness",
  "eyebrow": "For fitness professionals & studios",
  "headline": "Fitness insurance, in minutes.",
  "pitch": "Buy online in about 10 minutes - COIs ready when your gym or client asks.",
  "coverage": [
    "General liability",
    "Professional liability",
    "Certificates of insurance"
  ],
  "cobs": [
    {
      "label": "Personal trainer",
      "id": "1000",
      "recentBind": { "label": "Personal Trainer GL", "price": "$16/mo" }
    },
    {
      "label": "Fitness studio",
      "id": "111700",
      "recentBind": { "label": "Gym / Fitness Studio", "price": "$86/mo" }
    }
  ],
  "chipsNote": "Yoga, pilates, and most instructors fall under Personal Trainer.",
  "savingsLine": "Fitness businesses typically save 10–25%."
};

export default function Page() {
  return <QuoteSplash config={config} />;
}
