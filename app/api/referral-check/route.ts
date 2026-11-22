import { NextResponse } from "next/server";
import { findQuotesMessageText } from "@/lib/gmail";
import { lookupPartner } from "@/lib/referral-partner-notice";

export const runtime = "nodejs";

// Nam 11/21: does this /refer code belong to a partner (any partner since Kevin 11/22; was FB-ad only) (so a no-website referral must add an FEIN or a document)?
// Returns only a boolean - never the partner's identity. Lookup trouble = proof:false (the intake route re-checks).
export async function GET(request: Request) {
  const code = (new URL(request.url).searchParams.get("code") || "").trim().toLowerCase();
  if (!/^[a-f0-9]{20}$/.test(code)) return NextResponse.json({ proof: false });
  try {
    const partner = await lookupPartner(code, findQuotesMessageText);
    return NextResponse.json({ proof: Boolean(partner) }, { headers: { "Cache-Control": "private, max-age=300" } });
  } catch { return NextResponse.json({ proof: false }); }
}
