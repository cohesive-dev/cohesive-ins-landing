import QuoteSplash, { type SplashConfig } from "@/components/QuoteSplash";

const config: SplashConfig = {
  "slug": "landscaping",
  "eyebrow": "For landscaping & lawn care",
  "headline": "Landscaping insurance, in minutes.",
  "pitch": "Buy online in about 10 minutes - COIs ready when the GC or property manager asks.",
  "coverage": [
    "General liability",
    "Tools & equipment",
    "Certificates of insurance"
  ],
  "cobs": [
    {
      "label": "Landscaping & lawn care",
      "id": "5003"
    },
    {
      "label": "Grounds / snow removal",
      "id": "111739"
    }
  ],
  "chipsNote": "Lawn care, grounds maintenance, and snow removal all work.",
  "emailPlaceholder": "you@yourcompany.com"
};

export default function Page() {
  return <QuoteSplash config={config} />;
}
