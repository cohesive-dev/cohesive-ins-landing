import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Cohesive Insurance Services",
  description: "Terms governing use of the Cohesive Insurance Services website and services.",
};

const LAST_UPDATED = "July 7, 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-[#131517] mb-3">{title}</h2>
      <div className="text-[15px] leading-relaxed text-[#6B6D71] space-y-3">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <a href="/" className="text-sm font-semibold text-[#2040E7] hover:underline">
          &larr; Back to home
        </a>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#131517] mt-6 mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-[#6B6D71] mb-12">Last updated: {LAST_UPDATED}</p>

        <Section title="Acceptance of these terms">
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your use of the website and services
            of Cohesive Insurance Services (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By
            using our website, submitting a quote request, or communicating with us, you agree to
            these Terms. If you do not agree, please do not use our website or services.
          </p>
        </Section>

        <Section title="Our services">
          <p>
            We are an independent commercial insurance brokerage. We help businesses obtain quotes
            for and place insurance coverage with third-party insurance carriers. We are not an
            insurance carrier and do not underwrite insurance.
          </p>
        </Section>

        <Section title="Quotes are not offers of coverage">
          <p>
            Any premium estimates or quotes provided through this website, by email, by phone, or
            by text message are for informational purposes only and are subject to carrier
            underwriting, eligibility review, and final approval. Coverage is not bound until you
            receive written confirmation of binding from us or the carrier. Submitting a quote
            request does not create coverage or an obligation to purchase.
          </p>
        </Section>

        <Section title="Accuracy of information you provide">
          <p>
            Quotes and coverage decisions depend on the information you provide. You agree to
            provide information that is accurate and complete to the best of your knowledge.
            Inaccurate or incomplete information may result in incorrect quotes, coverage denial,
            policy rescission, or denied claims.
          </p>
        </Section>

        <Section title="Communications consent">
          <p>
            By providing your contact information, you agree that we may contact you about your
            quote request and related services by email, phone, and text message. You can opt out
            of marketing emails via the unsubscribe link in any email and opt out of text messages
            by replying STOP. See our{" "}
            <a href="/privacy" className="text-[#007395] hover:underline">
              Privacy Policy
            </a>{" "}
            for details on how we handle your information.
          </p>
        </Section>

        <Section title="Intellectual property">
          <p>
            All content on this website, including text, graphics, logos, and software, is owned by
            or licensed to us and is protected by applicable intellectual-property laws. You may
            not reproduce, distribute, or create derivative works from this content without our
            prior written consent.
          </p>
        </Section>

        <Section title="Disclaimers">
          <p>
            Our website and its content are provided &quot;as is&quot; without warranties of any
            kind, express or implied. Content on this site is general information and is not legal,
            financial, or professional advice. Policy terms, conditions, and exclusions are
            governed solely by the insurance policy documents issued by the carrier.
          </p>
        </Section>

        <Section title="Limitation of liability">
          <p>
            To the maximum extent permitted by law, Cohesive Insurance Services will not be liable
            for any indirect, incidental, special, consequential, or punitive damages arising out
            of or relating to your use of this website. Nothing in these Terms limits liability
            that cannot be limited under applicable law.
          </p>
        </Section>

        <Section title="Changes to these terms">
          <p>
            We may update these Terms from time to time. The &quot;Last updated&quot; date above
            reflects the most recent revision. Continued use of the website after changes are
            posted constitutes acceptance of the revised Terms.
          </p>
        </Section>

        <Section title="Governing law">
          <p>
            These Terms are governed by the laws of the State of New York, without regard to its
            conflict-of-law principles.
          </p>
        </Section>

        <Section title="Contact us">
          <p>
            Cohesive Insurance Services
            <br />
            Phone:{" "}
            <a href="tel:+19295945450" className="text-[#007395] hover:underline">
              +1 (929) 594-5450
            </a>
          </p>
        </Section>
      </div>
    </main>
  );
}
