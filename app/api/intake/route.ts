import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendIntakeNotification } from "@/lib/notify";

/**
 * POST /api/intake
 *
 * Handles a quote-form submission. Each submission is keyed by the submitter's
 * email: we upsert a Contact on `primaryEmail` so repeat submissions update the
 * existing contact rather than creating duplicates.
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

  try {
    const contact = await prisma.contact.upsert({
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

    return NextResponse.json({ contact }, { status: 200 });
  } catch (error) {
    console.error("Failed to upsert contact for intake submission", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 },
    );
  }
}
