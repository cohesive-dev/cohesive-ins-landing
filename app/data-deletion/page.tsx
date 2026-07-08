import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Deletion Instructions | Cohesive Insurance Services",
  description: "How to request deletion of your personal data from Cohesive Insurance Services.",
};

export default function DataDeletionPage() {
  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <a href="/" className="text-sm font-semibold text-[#2040E7] hover:underline">
          &larr; Back to home
        </a>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#131517] mt-6 mb-8">
          Data Deletion Instructions
        </h1>

        <div className="text-[15px] leading-relaxed text-[#6B6D71] space-y-4">
          <p>
            If you would like Cohesive Insurance Services to delete the personal information we
            hold about you — including information submitted through our website, Facebook or
            Instagram lead forms, phone, text message, or email — you can request deletion at any
            time.
          </p>

          <h2 className="text-xl font-bold text-[#131517] pt-4">How to request deletion</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Call us at{" "}
              <a href="tel:+19295945450" className="text-[#007395] hover:underline">
                +1 (929) 594-5450
              </a>{" "}
              and state that you are making a{" "}
              <strong className="text-[#131517]">data deletion request</strong>. You may also reply
              to any email or text message you have received from us with the same request.
            </li>
            <li>
              Provide the name, email address, and phone number you used when contacting us, so we
              can locate your records.
            </li>
            <li>
              We will confirm receipt of your request and complete the deletion within 30 days,
              then send you a final confirmation.
            </li>
          </ol>

          <h2 className="text-xl font-bold text-[#131517] pt-4">What we may need to keep</h2>
          <p>
            If you have purchased an insurance policy through us, certain records must be retained
            to comply with state insurance regulations and record-keeping requirements. In that
            case we will delete everything we are not legally required to keep and let you know
            what was retained and why.
          </p>

          <p className="pt-4">
            For more on how we collect and use information, see our{" "}
            <a href="/privacy" className="text-[#007395] hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
