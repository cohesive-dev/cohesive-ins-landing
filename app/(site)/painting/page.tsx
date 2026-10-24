import QuoteSplash, { type SplashConfig } from "@/components/QuoteSplash";

const config: SplashConfig = {
  "slug": "painting",
  "provider": "foxquilt",
  "eyebrow": "For painting contractors",
  "headline": "Painting business insurance, in minutes.",
  "pitch": "Buy online in minutes - COIs ready when the GC or property manager asks.",
  "coverage": [
    "General liability",
    "Tools & equipment",
    "Certificates of insurance"
  ],
  "cobs": [
    {
      "label": "House painting",
      "id": "House Painting"
    },
    {
      "label": "Commercial painting",
      "id": "Residential & Commercial Paintings"
    }
  ],
  "chipsNote": "Interior and exterior painters both work - large commercial or high-rise exterior jobs fit better with our team below.",
  "savingsLine": "Painters typically save 10–25%."
};

export default function Page() {
  return <QuoteSplash config={config} />;
}
