import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Cohesive Insurance Services",
  description:
    "How Cohesive Insurance Services collects, uses, and protects your information.",
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

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <a href="/" className="text-sm font-semibold text-[#2040E7] hover:underline">
          &larr; Back to home
        </a>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#131517] mt-6 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#6B6D71] mb-12">Last updated: {LAST_UPDATED}</p>

        <Section title="Who we are">
          <p>
            Cohesive Insurance Services (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is a
            commercial insurance brokerage. This policy describes how we collect, use, and share
            information when you visit our website, request a quote, or otherwise interact with us,
            including through forms on this site, Facebook and Instagram lead forms, phone calls,
            text messages, and email.
          </p>
        </Section>

        <Section title="Information we collect">
          <p>We collect information you provide directly to us, including:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Contact details such as your name, business name, email address, phone number, and
              business address or ZIP code.
            </li>
            <li>
              Business and insurance details you share when requesting a quote, such as your
              industry, number of employees, revenue, current coverage, and policy renewal dates.
            </li>
            <li>
              The contents of communications with us by phone, text message, email, web chat, or
              scheduling tools.
            </li>
          </ul>
          <p>
            We also automatically collect certain technical information when you visit our site,
            such as IP address, browser type, pages viewed, and referral source, through cookies
            and similar technologies (see &quot;Cookies and advertising&quot; below).
          </p>
        </Section>

        <Section title="How we use your information">
          <ul className="list-disc pl-5 space-y-1">
            <li>To prepare and deliver insurance quotes and place coverage on your behalf.</li>
            <li>To respond to your inquiries and communicate with you about your request.</li>
            <li>
              To contact you about quotes, renewals, and related services, including by email,
              phone, and text message where permitted.
            </li>
            <li>To operate, improve, and secure our website and services.</li>
            <li>To comply with legal, regulatory, and licensing obligations.</li>
          </ul>
        </Section>

        <Section title="How we share your information">
          <p>
            We do <strong className="text-[#131517]">not</strong> sell your personal information.
            We share it only as needed to serve you:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              With insurance carriers, wholesalers, and rating platforms to obtain quotes and place
              coverage you request.
            </li>
            <li>
              With service providers that help us run our business (for example: website hosting,
              scheduling, communications, and customer-relationship tools), who may use your
              information only to provide services to us.
            </li>
            <li>When required by law, regulation, subpoena, or to protect our legal rights.</li>
          </ul>
        </Section>

        <Section title="Text messaging (SMS)">
          <p>
            If you provide your phone number, you consent to receive calls and text messages from
            us about your quote request and related services. Message frequency varies; message and
            data rates may apply. Reply STOP at any time to opt out of texts, or HELP for help.
            Consent to receive texts is not a condition of purchasing any product or service. We do
            not share your mobile number with third parties for their own marketing purposes.
          </p>
        </Section>

        <Section title="Cookies and advertising">
          <p>
            Our website uses cookies and similar technologies, including the Meta (Facebook) Pixel,
            to measure site traffic, understand how visitors use our site, and improve the
            relevance of our advertising on platforms like Facebook and Instagram. These tools may
            collect information about your device and browsing activity. You can limit tracking
            through your browser settings, and you can manage ad preferences through your Facebook
            settings.
          </p>
        </Section>

        <Section title="Data retention and security">
          <p>
            We retain your information for as long as needed to provide services, satisfy insurance
            regulatory record-keeping requirements, and resolve disputes. We use commercially
            reasonable administrative, technical, and physical safeguards to protect your
            information, though no method of transmission or storage is completely secure.
          </p>
        </Section>

        <Section title="Your choices and rights">
          <ul className="list-disc pl-5 space-y-1">
            <li>You may opt out of marketing emails via the unsubscribe link in any email.</li>
            <li>You may opt out of text messages by replying STOP.</li>
            <li>
              You may request access to, correction of, or deletion of your personal information by
              contacting us. Depending on your state of residence, you may have additional rights
              under applicable privacy laws.
            </li>
          </ul>
        </Section>

        <Section title="Children's privacy">
          <p>
            Our services are intended for businesses and their representatives. We do not knowingly
            collect personal information from anyone under 18.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this policy from time to time. The &quot;Last updated&quot; date above
            reflects the most recent revision. Material changes will be posted on this page.
          </p>
        </Section>

        <Section title="Contact us">
          <p>
            Cohesive Insurance Services
            <br />
            Phone:{" "}
            <a href="tel:+18573924131" className="text-[#007395] hover:underline">
              +1 (857) 392-4131
            </a>
          </p>
        </Section>
      </div>
    </main>
  );
}
