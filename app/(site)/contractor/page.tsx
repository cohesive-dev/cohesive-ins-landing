import type { Metadata } from "next";
import ContractorsLandingPage from "../contractors/page";

// GPT ads test alias. Keep the canonical contractor landing page as the single
// implementation so the two URLs cannot drift while the experiment runs.
export const metadata: Metadata = {
  alternates: { canonical: "/contractors" },
  robots: { index: false, follow: false },
};

export default function ContractorTestPage() {
  return <ContractorsLandingPage />;
}
