import QuoteSplash, { type SplashConfig } from "@/components/QuoteSplash";

const config: SplashConfig = {
  "slug": "retail",
  "eyebrow": "For shops & retail stores",
  "headline": "Retail store insurance, in minutes.",
  "pitch": "Buy online in about 10 minutes - COIs ready when your landlord asks.",
  "coverage": [
    "General liability",
    "Commercial property",
    "Certificates of insurance"
  ],
  "cobs": [
    {
      "label": "Retail store",
      "id": "110058"
    },
    {
      "label": "Convenience store",
      "id": "110680"
    },
    {
      "label": "E-commerce",
      "id": "110063"
    }
  ],
  "chipsNote": "Most shops fall under Retail Store - pick whichever is closest.",
  "savingsLine": "Retail shops typically save 10–25%."
};

export default function Page() {
  return <QuoteSplash config={config} />;
}
