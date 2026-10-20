import { NextResponse } from "next/server";
import { handleRoofingLeadSubmission } from "@/lib/roofing-leads";

// The /roofing-leads signup (Kevin 2026-10-20: same workflow as /catering-leads). Never touches /api/intake or the CRM.
export async function POST(req: Request) {
  let raw: unknown = {};
  try { raw = await req.json(); } catch { /* sendBeacon / bad JSON -> validation answers it */ }
  const result = await handleRoofingLeadSubmission(raw, process.env, (url, init) => fetch(url, init));
  return NextResponse.json(result.body, { status: result.status });
}
