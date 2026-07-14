import QuoteSplash, { type SplashConfig } from "@/components/QuoteSplash";

const config: SplashConfig = {
  "slug": "cleaning",
  "eyebrow": "For cleaning & janitorial businesses",
  "headline": "Cleaning business insurance, in minutes.",
  "pitch": "Buy online in about 10 minutes - COIs ready when your clients ask.",
  "coverage": [
    "General liability",
    "Tools & equipment",
    "Janitorial bonds",
    "Certificates of insurance"
  ],
  "cobs": [
    {
      "label": "House cleaning",
      "id": "100003"
    },
    {
      "label": "Janitorial",
      "id": "100002"
    },
    {
      "label": "Pressure washing",
      "id": "100004"
    }
  ],
  "chipsNote": "Residential and commercial cleaning both work - large building contracts may fit better with our team below.",
  "emailPlaceholder": "you@yourcompany.com"
};

export default function Page() {
  return <QuoteSplash config={config} />;
}
