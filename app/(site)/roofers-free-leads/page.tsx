import type { Metadata } from "next";
import ContractorIntake from "@/components/ContractorIntake";
import RooferOfferTracking from "@/components/RooferOfferTracking";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Roofers: get up to 5 free leads | Cohesive Insurance",
  description: "Bind your business insurance with Cohesive and get a local email outreach campaign to property and facility managers at no extra cost.",
  robots: { index: false, follow: false },
};

export default function RooferFreeLeadsPage() {
  return <div className={styles.page}>
    <RooferOfferTracking />
    <nav className={styles.nav}><a href="/">COHESIVE <span>INSURANCE SERVICES</span></a><a data-roofer-cta="header" className={styles.smallCta} href="#quote">Get a quote ↗</a></nav>
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div><p className={styles.eyebrow}>FOR ROOFING BUSINESSES</p><h1>Roofers:<br />get up to<br /><em>5 free leads.</em></h1>
          <p className={styles.intro}>Bind your business insurance with us and we’ll run an email outreach campaign to property and facility managers in your service area, typically getting 3-5 leads for free.</p>
          <p className={styles.secondary}>We can also shop your insurance and see how much you could save.</p>
          <a data-roofer-cta="hero" className={styles.button} href="#quote">Get my insurance quote →</a><p className={styles.micro}>Local outreach included when you bind with us.</p>
        </div>
        <div className={styles.proof}>
          <p className={styles.eyebrow}>REAL REPLIES FROM OUTREACH</p>
          <div className={styles.reply}><small>Roof quote request</small><blockquote>That would be great Jack. &nbsp;Pls check out and quote the roof at <span aria-label="Street number and name redacted" style={{ display: "inline-block", width: "7em", height: ".85em", background: "#37404a", borderRadius: "3px" }} /> Avenue <mark>26 unit apartment building!</mark> Thank you!<br /><br />Alex</blockquote></div>
          <div className={styles.reply}><small>Repair / replacement request</small><blockquote>778 and <span style={{ color: "#065be5", textDecoration: "underline" }}>798 Rays Rd, Stone Mountain</span>. Single story white buildings; they most likely need <mark>full repair or replacement.</mark> Please inspect/estimate at your convenience. Thank you, Clayton Jones Property</blockquote></div>
          <p className={styles.proofNote}>Real replies, reformatted from the supplied screenshots.</p>
        </div>
      </div>
    </section>
    <section className={styles.section}><p className={styles.eyebrow}>HOW IT WORKS</p><h2>Your insurance. Your next roofing opportunity.</h2>
      <div className={styles.steps}>
        <article><span>01</span><h3>Start with an insurance quote.</h3><p>Tell us about your roofing business, payroll and subcontractors. We shop your business insurance and help you compare your options.</p></article>
        <article><span>02</span><h3>Bind your policy with us.</h3><p>Once your coverage is bound, we’ll confirm your service area and the roof repairs or replacements you want to take on.</p></article>
        <article><span>03</span><h3>We run the outreach.</h3><p>Our software finds property and facility manager contacts in your area and emails them on your behalf. Interested replies become opportunities for you to follow up, inspect and quote.</p></article>
      </div>
    </section>
    <section className={styles.band}><div><h2>You do the roofing.<br />We help start the conversations.</h2><p>No separate outreach fee for this campaign. You pay for your insurance policy; we handle the local email outreach included with the offer.</p></div><a data-roofer-cta="midpage" className={styles.button} href="#quote">Get a quote →</a></section>
    <section className={styles.section}><p className={styles.eyebrow}>A FEW QUICK ANSWERS</p><div className={styles.faq}>
      <details open><summary>What counts as a lead?</summary><p>An interested reply about potential roofing work, such as a request for an inspection or estimate. You handle the conversation and quote the job.</p></details>
      <details><summary>Do I need to bind insurance first?</summary><p>Yes. You can request an insurance quote first with no commitment. The free outreach campaign is included when you bind your business insurance with us.</p></details>
      <details><summary>Who will you contact?</summary><p>Property and facility managers in your service area. We’ll confirm the area you cover and the roofing work you want before outreach begins.</p></details>
      <details><summary>Are these booked or guaranteed jobs?</summary><p>No. They are interested replies, not signed roofing contracts. Lead volume depends on responses to the campaign.</p></details>
    </div></section>
    <section id="quote" className={styles.quote}><ContractorIntake offer="roofer-free-leads" /></section>
    <footer className={styles.footer}>Cohesive Insurance Services · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></footer>
  </div>;
}
