import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendIntakeNotification } from "@/lib/notify";
import { resolveAccountWebsite } from "@/lib/domains";

type IntakePayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  businessType?: unknown;
  zip?: unknown;
  partial?: unknown;
  final?: unknown;
};

const asTrimmedString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;

function splitName(name: string | undefined) {
  if (!name) return { firstName: undefined, lastName: undefined };
  const parts = name.split(/\s+/);
  const firstName = parts.shift();
  const lastName = parts.length > 0 ? parts.join(" ") : undefined;
  return { firstName, lastName };
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

// Store phones in E.164 so the (email, phone) upsert key can't fragment on
// formatting and downstream tools (OpenPhone, Smartlead, CRM) match exactly.
// US-biased: bare 10 digits get +1. Invalid or partial values are omitted so a
// non-E.164 phone can never reach the database.
function toE164(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10 && !raw.startsWith("+")) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1") && !raw.startsWith("+"))
    return `+${digits}`;
  if (raw.startsWith("+") && digits.length >= 8 && digits.length <= 15)
    return `+${digits}`;
  return undefined;
}

export async function POST(request: NextRequest) {
  let body: IntakePayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // A final beacon always represents an abandoned form, even if the client
  // somehow omitted `partial`.
  const isFinal = body.final === true;
  const isPartial = body.partial === true || isFinal;

  const rawEmail = asTrimmedString(body.email)?.toLowerCase();
  // Partial saves may carry a half-typed email; only use it once it parses.
  const email = rawEmail && EMAIL_RE.test(rawEmail) ? rawEmail : undefined;

  const { firstName, lastName } = splitName(asTrimmedString(body.name));
  const phone = toE164(asTrimmedString(body.phone));
  const reachable = Boolean(email || phone);

  // Minimum to accept a submission: some way to reach the person. Phone-only
  // submissions are valid leads — they just skip the email-keyed Contact
  // upsert below and live in the quotes@ alert until the CRM ingests by phone.
  if (!isPartial && !reachable) {
    return NextResponse.json(
      { error: "An `email` or `phone` is required" },
      { status: 400 },
    );
  }

  // ZERO-MISS RULE: the quotes@ email is the system of record — send it BEFORE
  // any database work so a DB failure can never lose a lead. (2026-07-09
  // incident: Account-upsert failures 500'd and silently dropped real
  // submissions while the pixel kept counting them.)
  if ((!isPartial || isFinal) && reachable) {
    await sendIntakeNotification({
      name: asTrimmedString(body.name),
      email,
      phone,
      businessType: asTrimmedString(body.businessType),
      zip: asTrimmedString(body.zip),
      partial: isPartial,
    });
  }

  let contact = null;
  let account = null;
  let dbSaved = true;
  try {
    if (email && !isPartial) {
      const domain = resolveAccountWebsite(null, email);
      const result = await prisma.$transaction(async (tx) => {
        const contact = await tx.contact.upsert({
          where: {
            contact_primary_email_phone_idx: {
              primaryEmail: email,
              primaryPhone: phone ?? "",
            },
          },
          create: {
            primaryEmail: email,
            emails: [email],
            firstName,
            lastName,
            primaryPhone: phone,
            phoneNumbers: phone ? [phone] : [],
          },
          update: {
            ...(firstName !== undefined && { firstName }),
            ...(lastName !== undefined && { lastName }),
            ...(phone !== undefined && { primaryPhone: phone }),
          },
        });

        const account = await tx.account.upsert({
          where: { domain },
          create: { name: domain, domain },
          update: {},
        });

        await tx.accountContact.upsert({
          where: {
            accountId_contactId: {
              accountId: account.id,
              contactId: contact.id,
            },
          },
          create: { accountId: account.id, contactId: contact.id },
          update: {},
        });

        return { contact, account };
      });
      contact = result.contact;
      account = result.account;
    } else if (email) {
      // Partial autosave: Contact only — no Account until they actually submit.
      contact = await prisma.contact.upsert({
        where: {
          contact_primary_email_phone_idx: {
            primaryEmail: email,
            primaryPhone: phone ?? "",
          },
        },
        create: {
          primaryEmail: email,
          emails: [email],
          firstName,
          lastName,
          primaryPhone: phone,
          phoneNumbers: phone ? [phone] : [],
        },
        update: {
          ...(firstName !== undefined && { firstName }),
          ...(lastName !== undefined && { lastName }),
          ...(phone !== undefined && { primaryPhone: phone }),
        },
      });
    }

  } catch (error) {
    // The lead is already safe in quotes@ — log loudly, respond 200 so the
    // client-side flow (and partial autosaves) never treat this as fatal.
    dbSaved = false;
    console.error("Intake DB write failed (lead preserved via email)", error);
  }

  return NextResponse.json({ contact, account, dbSaved }, { status: 200 });
}
