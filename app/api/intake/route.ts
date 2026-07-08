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

  // The Account's unique handle: the email's company domain, or the full email
  // as a fallback for consumer/gmail-style addresses (no company website is
  // collected on the form). Same derivation the CRM uses.
  const domain = resolveAccountWebsite(null, email);

  try {
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
          accountId_contactId: { accountId: account.id, contactId: contact.id },
        },
        create: { accountId: account.id, contactId: contact.id },
        update: {},
      });

      return { contact, account };
    });

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
