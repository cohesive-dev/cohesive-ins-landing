import QuoteSplash, { type SplashConfig } from "@/components/QuoteSplash";

const config: SplashConfig = {
  "slug": "restaurants",
  "captureEmail": true,
  "eyebrow": "For restaurants & food service",
  "headline": "Restaurant insurance, in minutes.",
  "pitch": "Buy online in about 10 minutes - COIs ready when your landlord asks.",
  "coverage": [
    "General liability",
    "Liquor liability",
    "Commercial property",
    "Certificates of insurance"
  ],
  "cobs": [{"label": "Restaurant", "id": "110207", "savings": "Restaurants typically save 10–25%. 94% of the businesses we quote beat their current rate.", "recentBind": {"label": "Restaurant BOP", "price": "$1,153/yr"}}, {"label": "Coffee shop", "id": "111666", "savings": "Coffee shops typically save 15–25%."}, {"label": "Bakery", "id": "111664", "savings": "Bakeries typically save 8–15%.", "recentBind": {"label": "Bakery GL", "price": "$849/yr"}}, {"label": "Food truck", "id": "111665", "savings": "Food trucks typically save 5–14%."}, {"label": "Caterer", "id": "100037", "savings": "Caterers typically save 10–21%.", "recentBind": {"label": "Caterer GL", "price": "$597/yr"}}],
  "chipsNote": "Delis, pizzerias, quick-service, dine-in, and most other food service all fall under Restaurant.",
  "savingsLine": "Restaurants typically save 10–25%. 94% of the businesses we quote beat their current rate."
};

export default function Page() {
  return <QuoteSplash config={config} />;
}
