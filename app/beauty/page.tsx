import QuoteSplash, { type SplashConfig } from "@/components/QuoteSplash";

const config: SplashConfig = {
  "slug": "beauty",
  "eyebrow": "For salons & beauty professionals",
  "headline": "Salon & beauty insurance, in minutes.",
  "pitch": "Buy online in about 10 minutes - COIs ready when your landlord asks.",
  "coverage": [
    "General liability",
    "Professional liability",
    "Commercial property",
    "Certificates of insurance"
  ],
  "cobs": [
    {
      "label": "Nail technician",
      "id": "100027",
      "recentBind": { "label": "Nail Technician GL", "price": "$11/mo" }
    },
    {
      "label": "Hair stylist",
      "id": "100025",
      "recentBind": { "label": "Hair Stylist GL", "price": "$12/mo" }
    },
    {
      "label": "Barber",
      "id": "100024",
      "recentBind": { "label": "Barber GL", "price": "$12/mo" }
    },
    {
      "label": "Esthetician",
      "id": "100021"
    }
  ],
  "chipsNote": "Booth renters and salon owners both work - pick whichever is closest.",
  "savingsLine": "Salons typically save 10–25%."
};

export default function Page() {
  return <QuoteSplash config={config} />;
}
