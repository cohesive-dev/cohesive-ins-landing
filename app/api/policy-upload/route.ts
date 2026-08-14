import { createHash } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { sendPolicyUploadNotification } from "@/lib/notify";

// /api/policy-upload — the /rate-check page's multipart endpoint: contact
// fields + the visitor's current policy (dec-page photos or PDF), emailed to
// quotes@ as attachments.
//
// Like the restaurant lane, this deliberately BYPASSES the CRM inbound-lead
// webhook: that fan-out fires an automated first-touch SMS, and rate-check
// leads are high-premium prospects that get the human call lane instead.
// quotes@ (with the policy attached) is the single handoff.

// nodemailer needs the Node runtime (not edge).
export const runtime = "nodejs";

const CAPI_PIXEL_ID = process.env.META_PIXEL_ID ?? "831179966599677";
const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
const MAX_FILES = 5;
const MAX_TOTAL_BYTES = 4_000_000; // stay under the platform body cap
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
]);

async function sendCapiLead(
  request: NextRequest,
  eventId: string,
  email?: string,
  phone?: string,
): Promise<"sent" | "skipped" | "failed"> {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return "skipped";
  const userData: Record<string, unknown> = {};
  if (email) userData.em = [sha256(email.trim().toLowerCase())];
  if (phone) userData.ph = [sha256(phone.replace(/\D/g, ""))];
  const fbp = request.cookies.get("_fbp")?.value;
  const fbc = request.cookies.get("_fbc")?.value;
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip) userData.client_ip_address = ip;
  const ua = request.headers.get("user-agent");
  if (ua) userData.client_user_agent = ua;
  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${CAPI_PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            {
              event_name: "Lead",
              event_time: Math.floor(Date.now() / 1000),
              event_id: eventId,
              action_source: "website",
              event_source_url:
                request.headers.get("referer") ??
                "https://cohesiveinsure.com/rate-check",
              user_data: userData,
            },
          ],
        }),
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!res.ok) {
      console.error("CAPI Lead rejected", res.status);
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error("CAPI Lead request failed", error);
    return "failed";
  }
}

export async function POST(request: NextRequest) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const str = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" && v.trim() ? v.trim() : undefined;
  };
  const name = str("name");
  const rawEmail = str("email")?.toLowerCase();
  const email = rawEmail && EMAIL_RE.test(rawEmail) ? rawEmail : undefined;
  const phone = str("phone");
  const eventId = str("eventId");

  if (!email && !phone) {
    return NextResponse.json(
      { error: "An `email` or `phone` is required" },
      { status: 400 },
    );
  }

  const files = form
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, MAX_FILES);
  if (files.length === 0) {
    return NextResponse.json(
      { error: "At least one policy file is required" },
      { status: 400 },
    );
  }
  const total = files.reduce((s, f) => s + f.size, 0);
  if (total > MAX_TOTAL_BYTES) {
    return NextResponse.json(
      { error: "Files too large — please upload photos of the pages" },
      { status: 413 },
    );
  }
  for (const f of files) {
    // Some phones send an empty type for camera captures; allow those and let
    // the extension carry the story. Reject only explicitly foreign types.
    if (f.type && !ALLOWED_TYPES.has(f.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${f.type}` },
        { status: 415 },
      );
    }
  }

  const attachments = await Promise.all(
    files.map(async (f, i) => ({
      filename: f.name || `policy-${i + 1}.jpg`,
      content: Buffer.from(await f.arrayBuffer()),
      contentType: f.type || undefined,
    })),
  );

  const mailed = await sendPolicyUploadNotification(
    { name, email, phone },
    attachments,
  );
  if (!mailed) {
    // The attachment email IS the handoff — if it didn't send, the lead's
    // policy is nowhere. Fail loudly so the client can show a retry.
    return NextResponse.json(
      { error: "Could not deliver the upload — please try again" },
      { status: 502 },
    );
  }

  const capi = eventId
    ? await sendCapiLead(request, eventId, email, phone)
    : "skipped";

  return NextResponse.json({ ok: true, capi }, { status: 200 });
}
