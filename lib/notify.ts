import nodemailer from "nodemailer";

/**
 * Lead notification email to quotes@cohesiveinsure.com.
 *
 * The email is the alert channel, not the system of record (the Contact row
 * is) — so this must never throw into the intake route: a mail failure logs
 * and returns, and the form submission still succeeds.
 *
 * Requires QUOTES_SMTP_PASSWORD (Gmail app password for quotes@) in the
 * environment; without it, sending is skipped with an error log.
 */

const QUOTES_ADDRESS = "quotes@cohesiveinsure.com";

export type IntakeNotification = {
  name?: string;
  // Optional because an abandoned form may only have a phone number.
  email?: string;
  phone?: string;
  businessType?: string;
  zip?: string;
  // True for an abandoned (partial) form fill — changes subject/body and adds
  // a no-consent warning, since the visitor never clicked submit.
  partial?: boolean;
  // Where the lead came from; "next-handoff" = the /restaurants step-0 form
  // that hands the visitor to Next Insurance's self-serve flow.
  source?: string;
};

export async function sendIntakeNotification(
  fields: IntakeNotification,
): Promise<void> {
  const password = process.env.QUOTES_SMTP_PASSWORD;
  if (!password) {
    console.error(
      "QUOTES_SMTP_PASSWORD is not set — skipping intake notification email",
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: QUOTES_ADDRESS, pass: password },
  });

  // Vertical splash pages send "<slug>-splash-next-handoff" (visitor handed
  // to Next's self-serve flow) or "<slug>-splash-abandoned" (typed email but
  // never started). Slug = the page, e.g. restaurants, cleaning, beauty.
  const handoffMatch = fields.source?.match(/^(.+)-splash-(\w+)-handoff$/);
  const abandonMatch = fields.source?.match(/^(.+)-splash-abandoned$/);
  const isNextHandoff = Boolean(handoffMatch);
  const isSplashAbandon = Boolean(abandonMatch);
  const splashPage = `/${handoffMatch?.[1] ?? abandonMatch?.[1] ?? ""}`;
  const providerNames: Record<string, string> = {
    next: "Next Insurance",
    foxquilt: "Foxquilt",
  };
  const provider = providerNames[handoffMatch?.[2] ?? ""] ?? "the carrier";
  const source =
    fields.source ?? (fields.partial ? "website-form-partial" : "website-form");
  const lines = [
    isNextHandoff
      ? `Visitor started an instant quote on ${splashPage} and was handed to ` +
        `${provider}'s self-serve flow. Follow up if no bind shows in the ` +
        `${provider} dashboard.`
      : isSplashAbandon
        ? `Visitor typed their email on the ${splashPage} splash page but left ` +
          `WITHOUT starting the Next quote flow.`
        : fields.partial
        ? `Abandoned quote form (visitor filled fields but did NOT submit).`
        : `New quote request from the website form.`,
    ``,
    `Name: ${fields.name ?? "(not provided)"}`,
    `Email: ${fields.email ?? "(not provided)"}`,
    `Phone: ${fields.phone ?? "(not provided)"}`,
    `Business type: ${fields.businessType ?? "(not provided)"}`,
    `ZIP: ${fields.zip ?? "(not provided)"}`,
    ...(fields.partial
      ? [
          ``,
          `NOTE: no contact consent was given (form never submitted). One manual,`,
          `soft follow-up is fine; do not add to automated sequences.`,
        ]
      : []),
    ``,
    `--- raw payload (for future parsing/ingest) ---`,
    JSON.stringify({ source, ...fields }, null, 2),
  ];

  const subjectWho = fields.name || fields.email || fields.phone || "unknown";
  const subject = isNextHandoff
    ? fields.businessType
      ? `${provider} quote started (${splashPage}): ${subjectWho} - ${fields.businessType}`
      : `${provider} quote started (${splashPage}): ${subjectWho}`
    : isSplashAbandon
      ? `⚠️ PARTIAL (${splashPage} abandoned): ${subjectWho}`
      : fields.partial
      ? `⚠️ PARTIAL quote form (abandoned): ${subjectWho}`
      : fields.businessType
        ? `New quote request: ${subjectWho} - ${fields.businessType}`
        : `New quote request: ${subjectWho}`;

  try {
    await transporter.sendMail({
      from: `Cohesive Insurance Services <${QUOTES_ADDRESS}>`,
      to: QUOTES_ADDRESS,
      subject,
      text: lines.join("\n"),
    });
  } catch (error) {
    console.error("Failed to send intake notification email", error);
  }
}
