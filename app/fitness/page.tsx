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
      "id": "1000"
    },
    {
      "label": "Fitness studio",
      "id": "111700"
    }
  ],
  "chipsNote": "Yoga, pilates, and most instructors fall under Personal Trainer.",
  "savingsLine": "Fitness businesses typically save 10–25%."
};

export default function Page() {
  return <QuoteSplash config={config} />;
}
