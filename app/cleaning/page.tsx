import QuoteSplash, { type SplashConfig } from "@/components/QuoteSplash";

const config: SplashConfig = {
  "slug": "cleaning",
  "provider": "foxquilt",
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
      "id": "Maid Services"
    },
    {
      "label": "Janitorial",
      "id": "Janitorial Services"
    },
    {
      "label": "Carpet cleaning",
      "id": "Carpet Cleaning Service"
    }
  ],
  "chipsNote": "Residential and commercial cleaning both work - large building contracts may fit better with our team below.",
  "emailPlaceholder": "you@yourcompany.com"
};

export default function Page() {
  return <QuoteSplash config={config} />;
}
