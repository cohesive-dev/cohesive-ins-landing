import type { Metadata } from "next";
import Link from "next/link";
import RoofingLeadsSignup from "@/components/RoofingLeadsSignup";
import styles from "../roofers-free-leads/page.module.css";

export const metadata: Metadata = {
  title: "Roofing leads from property managers near you | Cohesive Insurance",
  description: "We email property managers, HOAs and building owners in your service area and send you the ones who want a roof quote.",
  robots: { index: false, follow: false },
};

// Two ad arms, one product (Kevin 2026-10-20): a monthly outreach campaign, not billed per lead.
// ?offer=per-lead -> "works out to about $30 a lead"; ?offer=monthly -> "3 leads a month for $100".
// Kevin 2026-10-20: $300/mo; up to $200/mo is credited when the roofer's business insurance is with us, so the net is
// at most $100/mo for 3-5+ leads a month. The $100 / ~$30 figures always ride with that condition.
const CREDIT = "It's $300 a month, and $200 a month is credited when your business insurance is with us, so you pay $100 a month.";
const OFFERS = {
  "per-lead": { price: "About $30 a lead", line: `It's a monthly campaign, not billed per lead: usually 3-5 leads a month. ${CREDIT}` },
  monthly: { price: "3-5 leads a month for $100", line: CREDIT },
} as const;
type OfferKey = keyof typeof OFFERS;

export default async function RoofingLeadsPage({ searchParams }: { searchParams: Promise<{ offer?: string }> }) {
  const sp = await searchParams;
  const key: OfferKey = sp?.offer === "monthly" ? "monthly" : "per-lead";
  const offer = OFFERS[key];
  return <div className={styles.page}>
    <nav className={styles.nav}><Link href="/">COHESIVE <span>INSURANCE SERVICES</span></Link><a className={styles.smallCta} href="#signup">Get started ↗</a></nav>
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div><p className={styles.eyebrow}>FOR ROOFING BUSINESSES</p><h1>Roofing leads from<br /><em>property managers</em><br />near you.</h1>
          <p className={styles.intro}>We email property managers, HOAs and building owners in your service area and send you the ones who want a roof quote.</p>
          <p className={styles.secondary}><strong>{offer.price}.</strong> {offer.line}</p>
          <a className={styles.button} href="#signup">Get roofing leads →</a><p className={styles.micro}>Interested replies, not signed jobs. You follow up and quote.</p>
        </div>
        <div className={styles.proof}>
          <p className={styles.eyebrow}>REAL REPLIES FROM OUTREACH</p>
          <div className={styles.reply}><small>Roof quote request</small><blockquote>That would be great Jack. &nbsp;Pls check out and quote the roof at <span aria-label="Street number and name redacted" style={{ display: "inline-block", width: "7em", height: ".85em", background: "#37404a", borderRadius: "3px" }} /> Avenue <mark>26 unit apartment building!</mark> Thank you!<br /><br />Alex</blockquote></div>
          <div className={styles.reply}><small>Repair / replacement request</small><blockquote>778 and <span style={{ color: "#065be5", textDecoration: "underline" }}>798 Rays Rd, Stone Mountain</span>. Single story white buildings; they most likely need <mark>full repair or replacement.</mark> Please inspect/estimate at your convenience. Thank you, Clayton Jones Property</blockquote></div>
          <p className={styles.proofNote}>Real replies, reformatted from the supplied screenshots.</p>
        </div>
      </div>
    </section>
    <section className={styles.section}><p className={styles.eyebrow}>HOW IT WORKS</p><h2>You do the roofing. We start the conversations.</h2>
      <div className={styles.steps}>
        <article><span>01</span><h3>Tell us your area.</h3><p>Your service area and the work you want: residential, commercial or both.</p></article>
        <article><span>02</span><h3>We run the outreach.</h3><p>We find property managers, HOAs and building owners near you and email them for you.</p></article>
        <article><span>03</span><h3>You get the interested ones.</h3><p>When someone replies that they want a roof looked at or quoted, we send them to you to follow up.</p></article>
      </div>
    </section>
    <section className={styles.section}><p className={styles.eyebrow}>A FEW QUICK ANSWERS</p><div className={styles.faq}>
      <details open><summary>What counts as a lead?</summary><p>A property manager, HOA or building owner near you who replied that they want a roof inspection, repair estimate or quote. You handle the conversation and quote the job.</p></details>
      <details><summary>How is it priced?</summary><p>It&apos;s a monthly outreach campaign, not billed per lead. It&apos;s $300 a month. When your business insurance is with us, $200 a month is credited, so you pay $100 a month for usually 3-5 leads a month (about $30 a lead).</p></details>
      <details><summary>Do I need my insurance with you?</summary><p>No, but the $200 monthly credit applies only when your business insurance is placed with us. Without it, the campaign is $300 a month. We can shop your insurance and show you what you&apos;d pay.</p></details>
      <details><summary>Are these booked or guaranteed jobs?</summary><p>No. They are interested replies, not signed roofing contracts.</p></details>
      <details><summary>Who will you contact?</summary><p>Property managers, HOAs and building owners in your service area. We confirm your area and the roofing work you want before outreach begins.</p></details>
    </div></section>
    <section id="signup" className={styles.quote}><RoofingLeadsSignup offer={key} /></section>
    <footer className={styles.footer}>Cohesive Insurance Services · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></footer>
  </div>;
}
