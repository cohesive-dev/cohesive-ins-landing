import { NextResponse } from "next/server";
import { handlePartnerSignup } from "@/lib/referral-partners";
import { sendReferralPartnerMail } from "@/lib/notify";

// Referral partner signup (Nam 2026-11-19). Never touches /api/intake or the CRM: a partner is not an insurance lead.
export async function POST(req: Request) {
  let raw: unknown = {};
  try { raw = await req.json(); } catch { /* validation answers it */ }
  const result = await handlePartnerSignup(raw, process.env, sendReferralPartnerMail);
  return NextResponse.json(result.body, { status: result.status });
}
