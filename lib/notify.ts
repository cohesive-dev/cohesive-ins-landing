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
  email: string;
  phone?: string;
  businessType?: string;
  zip?: string;
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

  const lines = [
    `New quote request from the website form.`,
    ``,
    `Name: ${fields.name ?? "(not provided)"}`,
    `Email: ${fields.email}`,
    `Phone: ${fields.phone ?? "(not provided)"}`,
    `Business type: ${fields.businessType ?? "(not provided)"}`,
    `ZIP: ${fields.zip ?? "(not provided)"}`,
    ``,
    `--- raw payload (for future parsing/ingest) ---`,
    JSON.stringify({ source: "website-form", ...fields }, null, 2),
  ];

  const subjectWho = fields.name || fields.email;
  const subject = fields.businessType
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
