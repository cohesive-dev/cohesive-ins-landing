import QuoteSplash, { type SplashConfig } from "@/components/QuoteSplash";

const config: SplashConfig = {
  "slug": "restaurants",
  "eyebrow": "For restaurants & food service",
  "headline": "Restaurant insurance, in minutes.",
  "pitch": "Buy online in about 10 minutes - COIs ready when your landlord asks.",
  "coverage": [
    "General liability",
    "Liquor liability",
    "Commercial property",
    "Certificates of insurance"
  ],
  "cobs": [
    {
      "label": "Restaurant",
      "id": "110207"
    },
    {
      "label": "Coffee shop",
      "id": "111666"
    },
    {
      "label": "Bakery",
      "id": "111664"
    },
    {
      "label": "Food truck",
      "id": "111665"
    },
    {
      "label": "Caterer",
      "id": "100037"
    }
  ],
  "chipsNote": "Delis, pizzerias, quick-service, dine-in, and most other food service all fall under Restaurant.",
  "savingsLine": "Restaurants typically save 10–25%. 94% of the businesses we quote beat their current rate."
};

export default function Page() {
  return <QuoteSplash config={config} />;
}
