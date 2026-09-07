import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

import { QUOTES_ADDRESS, sendRawFromQuotes } from "@/lib/gmail";

/**
 * Lead notification email to quotes@cohesiveinsure.com.
 *
 * The email is the alert channel, not the system of record (the Contact row
 * is). Return delivery status without throwing so the intake route can accept
 * CRM-only delivery or reject a request when neither destination succeeds.
 *
 * Transport is the Gmail API (see lib/gmail.ts) — SMTP app-password auth is
 * permanently dead for the domain. nodemailer stays for what it is good at:
 * composing the RFC-822 message (attachments included) with no SMTP
 * connection, via its stream transport.
 */

// Compose the message offline, then hand the raw bytes to the Gmail API.
async function composeAndSend(options: Mail.Options, context: string): Promise<boolean> {
  try {
    const composer = nodemailer.createTransport({
      streamTransport: true,
      buffer: true,
      newline: "\r\n",
    });
    const info = await composer.sendMail(options);
    return await sendRawFromQuotes(info.message as Buffer, context);
  } catch (error) {
    console.error(`[notify] failed to compose ${context}`, error);
    return false;
  }
}

export type IntakeNotification = {
  name?: string;
  // Optional because an abandoned form may only have a phone number.
  email?: string;
  phone?: string;
  businessType?: string;
  company?: string;
  zip?: string;
  // True for an abandoned (partial) form fill — changes subject/body and adds
  // a no-consent warning, since the visitor never clicked submit.
  partial?: boolean;
  // Where the lead came from; "next-handoff" = the /restaurants step-0 form
  // that hands the visitor to Next Insurance's self-serve flow.
  source?: string;
  // Extra structured answers from a deep intake form (e.g. the /church landing
  // page's conditional questionnaire). Rendered as a readable block in the
  // quotes@ email so the agent gets a quote-ready lead. Order-preserving.
  details?: Array<{ label: string; value: string }>;
};

export async function sendIntakeNotification(
  fields: IntakeNotification,
): Promise<boolean> {
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
    `Business name: ${fields.company ?? "(not provided)"}`,
    `Business type: ${fields.businessType ?? "(not provided)"}`,
    `ZIP: ${fields.zip ?? "(not provided)"}`,
    ...(fields.details && fields.details.length > 0
      ? [
          ``,
          `--- quote details ---`,
          ...fields.details.map((d) => `${d.label}: ${d.value}`),
        ]
      : []),
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

  return composeAndSend(
    {
      from: `Cohesive Insurance Services <${QUOTES_ADDRESS}>`,
      to: QUOTES_ADDRESS,
      subject,
      text: lines.join("\n"),
    },
    `intake notification (${source})`,
  );
}

// ---- /rate-check policy upload ---------------------------------------------

export type PolicyUploadAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

/**
 * quotes@ handoff for the /rate-check policy-upload lane. Unlike
 * sendIntakeNotification this RETURNS success/failure: the attachment email is
 * the only place the uploaded policy lands, so the route must surface a
 * delivery failure to the visitor instead of swallowing it.
 */
export async function sendPolicyUploadNotification(
  fields: { name?: string; email?: string; phone?: string },
  attachments: PolicyUploadAttachment[],
): Promise<boolean> {
  const who = fields.name || fields.email || fields.phone || "unknown";
  const lines = [
    `Policy upload from /rate-check (contractor rate-check lane).`,
    ``,
    `Name: ${fields.name ?? "(not provided)"}`,
    `Email: ${fields.email ?? "(not provided)"}`,
    `Phone: ${fields.phone ?? "(not provided)"}`,
    `Files: ${attachments.map((a) => a.filename).join(", ")}`,
    ``,
    `Quote from the attached incumbent policy (dec page has carrier, limits,`,
    `premium, expiration). HIGH-PREMIUM lane: human call relay, no auto-SMS.`,
  ];
  return composeAndSend(
    {
      from: `Cohesive Insurance Services <${QUOTES_ADDRESS}>`,
      to: QUOTES_ADDRESS,
      subject: `📎 POLICY UPLOAD (rate-check): ${who}`,
      text: lines.join("\n"),
      attachments,
    },
    "policy upload",
  );
}

// ---- /network subcontractor-network signup ---------------------------------

export type NetworkSignupFields = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  trade?: string;
  zip?: string;
  crewSize?: string;
  carrier?: string;
  expiration?: string;
  premium?: string;
  /** "yes" = COI/policy attached, "no" = uninsured/lapsed, "unsure" = can't find it. */
  insured?: string;
};

/**
 * quotes@ handoff for the /network lane (Local Subcontractor Network signup).
 *
 * Two very different outcomes share this one mailer, so the subject line
 * carries the branch: an applicant WITH a COI hands us the incumbent policy
 * (carrier + limits + premium + expiration = the quote-from-incumbent method,
 * and a dated renewal for the calendar), while an applicant WITHOUT one is a
 * straight uninsured referral into the quoting lane.
 *
 * Returns success/failure like sendPolicyUploadNotification: when a COI is
 * attached this email is the only place that document lands, so the route has
 * to be able to tell the applicant to retry.
 */
export async function sendNetworkSignupNotification(
  fields: NetworkSignupFields,
  attachments: PolicyUploadAttachment[],
): Promise<boolean> {
  const who = fields.company || fields.name || fields.email || fields.phone || "unknown";
  const hasCoi = attachments.length > 0;
  const tag = hasCoi ? "COI ATTACHED" : "NO COI — INSURANCE REFERRAL";
  const lines = [
    `Subcontractor Network signup (/network).`,
    ``,
    `Contact: ${fields.name ?? "(not provided)"}`,
    `Business: ${fields.company ?? "(not provided)"}`,
    `Trade: ${fields.trade ?? "(not provided)"}`,
    `Email: ${fields.email ?? "(not provided)"}`,
    `Phone: ${fields.phone ?? "(not provided)"}`,
    `ZIP: ${fields.zip ?? "(not provided)"}`,
    `Crew size: ${fields.crewSize ?? "(not provided)"}`,
    ``,
    `Insured: ${fields.insured ?? "(not stated)"}`,
    `Carrier (self-reported): ${fields.carrier ?? "(not provided)"}`,
    `Expiration (self-reported): ${fields.expiration ?? "(not provided)"}`,
    `Premium (self-reported): ${fields.premium ?? "(not provided)"}`,
    `Files: ${hasCoi ? attachments.map((a) => a.filename).join(", ") : "(none)"}`,
    ``,
    hasCoi
      ? `NEXT: verify the attached COI/dec page, then quote against it (carrier,` +
        `\nlimits, premium, expiration all come off the doc). Log the expiration to` +
        `\nthe renewal calendar even if they are not shopping today.`
      : `NEXT: uninsured / lapsed applicant. They cannot be listed until they` +
        `\ncarry GL, so the insurance conversation IS the onboarding step.` +
        `\nQuote fresh - there is no incumbent policy to beat.`,
  ];
  return composeAndSend(
    {
      from: `Cohesive Insurance Services <${QUOTES_ADDRESS}>`,
      to: QUOTES_ADDRESS,
      subject: `🔧 NETWORK SIGNUP (${tag}): ${who}`,
      text: lines.join("\n"),
      attachments,
    },
    "network signup",
  );
}
