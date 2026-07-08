import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendIntakeNotification } from "@/lib/notify";
import { companyDomainFromEmail } from "@/lib/domains";

/**
 * POST /api/intake
 *
 * Handles a quote-form submission. Each submission is keyed by the submitter's
 * email: we upsert a Contact on `primaryEmail` so repeat submissions update the
 * existing contact rather than creating duplicates.
 *
 * Mirroring the CRM's inbound flow (leads.ts#upsertLeadFromReply), we also
 * ensure an Account exists and link the Contact to it via AccountContact. The
 * form collects no company name/website, so the Account is derived from the
 * email's company domain when there is one; consumer/gmail-style emails get a
 * per-contact Account named after the person instead.
 *
 * The form also collects `businessType` and `zip`. The current Contact schema
 * has no columns for those, so they are accepted but not persisted yet.
 */

type IntakePayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  businessType?: unknown;
  zip?: unknown;
};

const asTrimmedString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;

// "Jane" -> { firstName: "Jane" }; "Jane Van Halen" -> { firstName: "Jane", lastName: "Van Halen" }
function splitName(name: string | undefined) {
  if (!name) return { firstName: undefined, lastName: undefined };
  const parts = name.split(/\s+/);
  const firstName = parts.shift();
  const lastName = parts.length > 0 ? parts.join(" ") : undefined;
  return { firstName, lastName };
}

export async function POST(request: NextRequest) {
  let body: IntakePayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = asTrimmedString(body.email)?.toLowerCase();
  if (!email) {
    return NextResponse.json(
      { error: "A valid `email` is required" },
      { status: 400 },
    );
  }

  const { firstName, lastName } = splitName(asTrimmedString(body.name));
  const phone = asTrimmedString(body.phone);

  // The company domain the email identifies (null for consumer/gmail-style
  // addresses). It doubles as the Account's `website` and its dedup handle.
  const companyDomain = companyDomainFromEmail(email);
  const personName = [firstName, lastName].filter(Boolean).join(" ");

  try {
    // Contact + Account + link resolve together so a submission never leaves a
    // Contact without its Account (mirrors the CRM's upsertLeadFromReply).
    const { contact, account } = await prisma.$transaction(async (tx) => {
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
          // Only overwrite fields the submission actually provided.
          ...(firstName !== undefined && { firstName }),
          ...(lastName !== undefined && { lastName }),
          ...(phone !== undefined && { primaryPhone: phone }),
        },
      });

      // Find the Account to attach to. `website` isn't unique in this schema, so
      // this is a find-then-create (like the CRM) rather than a Prisma upsert:
      //  - company email -> dedup businesses sharing the domain by `website`
      //  - consumer email -> reuse the Account already linked to this Contact so
      //    repeat submissions don't spawn duplicates.
      let account = companyDomain
        ? await tx.account.findFirst({ where: { website: companyDomain } })
        : (
            await tx.accountContact.findFirst({
              where: { contactId: contact.id },
              include: { account: true },
            })
          )?.account ?? null;

      if (!account) {
        account = await tx.account.create({
          data: {
            // Placeholder name (`name` is required): the company domain when we
            // have one, else the person's name, else the email as a last resort.
            name: companyDomain ?? (personName || email),
            website: companyDomain ?? undefined,
          },
        });
      }

      // Idempotent Contact<->Account link (composite unique on the join table).
      await tx.accountContact.upsert({
        where: {
          accountId_contactId: { accountId: account.id, contactId: contact.id },
        },
        create: { accountId: account.id, contactId: contact.id },
        update: {},
      });

      return { contact, account };
    });

    // Alert channel only — never blocks or fails the submission (it catches
    // internally). Awaited because serverless may kill fire-and-forget work
    // once the response is sent.
    await sendIntakeNotification({
      name: asTrimmedString(body.name),
      email,
      phone,
      businessType: asTrimmedString(body.businessType),
      zip: asTrimmedString(body.zip),
    });

    return NextResponse.json({ contact, account }, { status: 200 });
  } catch (error) {
    console.error("Failed to upsert contact for intake submission", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 },
    );
  }
}
