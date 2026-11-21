import { NextResponse } from "next/server";
import { resolve4, resolve6, resolveCname } from "node:dns/promises";

export const runtime = "nodejs";

// Nam 11/21: the /refer website field must be a real link. DNS only (no fetch of the page), so it is
// fast and never touches the submitter's site. Unknown/timeout = ok:true (never block on our own trouble).
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("url") || "";
  let host: string;
  try { host = new URL(raw).hostname.toLowerCase(); } catch { return NextResponse.json({ ok: false, reason: "bad_url" }); }
  if (!/^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,24}$/.test(host)) return NextResponse.json({ ok: false, reason: "bad_host" });
  const timeout = new Promise<"timeout">((r) => setTimeout(() => r("timeout"), 3000));
  const lookup = Promise.any([resolve4(host), resolve6(host), resolveCname(host)]).then(() => "found" as const, (e: AggregateError) =>
    e.errors?.every((x: NodeJS.ErrnoException) => x?.code === "ENOTFOUND" || x?.code === "ENODATA") ? "missing" as const : "unknown" as const);
  const result = await Promise.race([lookup, timeout]);
  return NextResponse.json({ ok: result !== "missing", result });
}
