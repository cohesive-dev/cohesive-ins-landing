import type { PageContent } from "./data";

/** Applied after state profiles so shared operational questions survive their FAQ overrides. */
export function withConstructionHazardReview(page: PageContent, trade: string): PageContent {
  const question = trade === "pool"
    ? { q: "Does accepting gunite pool construction mean silica claims are covered?", a: "No. Describe gunite or shotcrete application, concrete or tile cutting, and who performs each task. Request the actual silica, silica-related dust and pollution exclusions in the proposed policies. Review employee injury separately from claims by customers or neighbors. A subcontractor’s policy or an accepted construction classification does not by itself establish coverage for your responsibility." }
    : trade === "remodeler"
      ? { q: "What should a remodeler disclose about an occupied-home project?", a: "Separate cosmetic work from demolition, load-bearing changes, additions and foundations. Identify the existing property, occupied areas, water shutoffs, temporary openings, concrete cutting and older materials that may be disturbed. State receipts, W2 payroll and subcontractor costs separately. Ask how the proposal treats damage to the part being worked on, resulting damage elsewhere and dust or pollution claims; a general remodeling label does not answer those questions." }
      : undefined;
  if (!question) return page;
  return { ...page, faqs: [...page.faqs.filter(f => f.q !== question.q), question] };
}
