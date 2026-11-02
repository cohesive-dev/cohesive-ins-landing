import { JWT } from "google-auth-library";

/**
 * Gmail API transport for quotes@ notification mail. Replaces SMTP: Google
 * Workspace permanently disabled password/app-password auth for the domain
 * (2026-08-25), so QUOTES_SMTP_PASSWORD can never work again. Auth is the
 * gmail-claude service account with domain-wide delegation on
 * https://mail.google.com/; the JWT `subject` impersonates quotes@, so the
 * send is first-party from the mailbox itself.
 *
 * Requires GMAIL_SA_KEY_JSON (the full service-account key JSON string) in the
 * environment. Never throws: every failure path logs loudly and returns false.
 */

export const QUOTES_ADDRESS = "quotes@cohesiveinsure.com";

const GMAIL_SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";
const SEND_ATTEMPTS = 2;
const RETRY_DELAY_MS = 750;

// undefined = unresolved; null = resolved but unusable (missing/bad env).
let cachedClient: JWT | null | undefined;

function buildClient(): JWT | null {
  const raw = process.env.GMAIL_SA_KEY_JSON?.trim();
  if (!raw) {
    console.error("[gmail] GMAIL_SA_KEY_JSON is not set — quotes@ notification email cannot send");
    return null;
  }
  let key: { client_email?: unknown; private_key?: unknown };
  try {
    key = JSON.parse(raw);
  } catch (e) {
    console.error("[gmail] GMAIL_SA_KEY_JSON is not valid JSON — notification email disabled", e);
    return null;
  }
  if (typeof key.client_email !== "string" || typeof key.private_key !== "string") {
    console.error("[gmail] GMAIL_SA_KEY_JSON is missing client_email/private_key — notification email disabled");
    return null;
  }
  return new JWT({
    email: key.client_email,
    // Guard against the common env-paste mistake of literal backslash-n in the PEM.
    key: key.private_key.replace(/\\n/g, "\n"),
    scopes: ["https://mail.google.com/"],
    subject: QUOTES_ADDRESS,
  });
}

function gmailClient(): JWT | null {
  if (cachedClient === undefined) cachedClient = buildClient();
  return cachedClient;
}

/**
 * Send a fully composed RFC-822 message (nodemailer streamTransport output)
 * from quotes@ via the Gmail API. One retry; failures log and return false.
 */
export async function sendRawFromQuotes(mime: Buffer, context: string): Promise<boolean> {
  const client = gmailClient();
  if (!client) return false;

  const raw = mime.toString("base64url");
  for (let attempt = 1; attempt <= SEND_ATTEMPTS; attempt++) {
    try {
      await client.request({
        url: GMAIL_SEND_URL,
        method: "POST",
        data: { raw },
        timeout: 15_000,
      });
      return true;
    } catch (e) {
      const detail = (e as { response?: { data?: unknown } })?.response?.data ?? e;
      console.error(`[gmail] send failed (attempt ${attempt}/${SEND_ATTEMPTS}) ${context}`, detail);
      if (attempt < SEND_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }
  return false;
}
