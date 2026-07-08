import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendIntakeNotification } from "@/lib/notify";
import { resolveAccountWebsite } from "@/lib/domains";

/**
 * POST /api/intake
 *
 * Handles a quote-form submission. Each submission is keyed by the submitter's
 * email: we upsert a Contact on `primaryEmail` (plus its Account and the
 * account-contact link) so repeat submissions update rather than duplicate.
 * Phone-only submissions are accepted as leads but skip the DB (the schema is
 * email-keyed); they live in the quotes@ alert until the CRM ingests by phone.
 *
 * The form also collects `businessType` and `zip`. The current Contact schema
 * has no columns for those, so they are accepted but not persisted yet.
 *
 * Partial (abandoned) fills: the form autosaves once the visitor has entered a
 * usable contact handle, with `partial: true`. Those upsert the Contact only
 * (no Account until they actually submit) and send no email. When the visitor
 * leaves without submitting, the form sends a last beacon with `final: true`,
 * which triggers a single "PARTIAL lead" alert to quotes@. A completed
 * submission later upgrades the same Contact row via the normal upsert path.
 */

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
  const phone = asTrimmedString(body.phone);
  const reachable = Boolean(email || phone);

  // Minimum to accept a submission: some way to reach the person.
  if (!isPartial && !reachable) {
    return NextResponse.json(
      { error: "An `email` or `phone` is required" },
      { status: 400 },
    );
  }

  try {
    let contact = null;
    let account = null;

    if (email && !isPartial) {
      // Completed submission: full Contact + Account + link, same derivation
      // the CRM uses (email's company domain, or the full email for
      // consumer/gmail-style addresses).
      const domain = resolveAccountWebsite(null, email);
      const result = await prisma.$transaction(async (tx) => {
        const contact = await tx.contact.upsert({
          where: { primaryEmail: email },
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
        where: { primaryEmail: email },
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

    // Alert channel only — never blocks or fails the submission (it catches
    // internally). Awaited because serverless may kill fire-and-forget work
    // once the response is sent. Partial autosaves are silent; only the final
    // abandonment beacon (or a completed submission) emails quotes@ — and only
    // when there is actually a way to reach the person.
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

    return NextResponse.json({ contact, account }, { status: 200 });
  } catch (error) {
    console.error("Failed to upsert contact for intake submission", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 },
    );
  }
}
