// Nam 11/21: a /refer lead from a FACEBOOK-sourced partner whose business says it has no website must prove the
// business exists: an FEIN, or a photo/PDF of a business document (license, EIN letter, invoice, insurance dec page).
// The FEIN is checked for shape + a valid IRS campus prefix; an upload is read by an LLM on Amazon Bedrock
// (env BEDROCK_LLM_API = bearer API key). Images go to BEDROCK_PROOF_MODEL (default GPT-5.6 Luna); PDFs go to
// BEDROCK_PROOF_PDF_MODEL (default Claude Sonnet 5.5) because Luna rejects documents. No SDK: one Converse fetch.

export type ProofFile = { name: string; type: string; data: string }; // data = base64, no data: prefix
export type ProofVerdict = "pass" | "fail" | "unclear";
export type ProofReview = { verdict: ProofVerdict; reason: string; model?: string };

export const PROOF_MAX_BYTES = 2_500_000;
export const PROOF_TYPES: Record<string, "jpeg" | "png" | "webp" | "gif" | "pdf"> = {
  "image/jpeg": "jpeg", "image/jpg": "jpeg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "application/pdf": "pdf",
};
export const DEFAULT_IMAGE_MODEL = "us.openai.gpt-5.6-luna";
export const DEFAULT_PDF_MODEL = "us.anthropic.claude-sonnet-5-5";

// Valid IRS EIN prefixes (campus codes). Anything else (00, 07-09, 17-19, 28-29, 49, 69-70, 78-79, 89, 96-97) was never issued.
const FEIN_PREFIXES = new Set<number>([
  ...range(1, 6), ...range(10, 16), ...range(20, 27), ...range(30, 39), ...range(40, 48), ...range(50, 68),
  ...range(71, 77), ...range(80, 88), ...range(90, 95), 98, 99,
]);
function range(a: number, b: number) { return Array.from({ length: b - a + 1 }, (_, i) => a + i); }

/** "12-3456789" / "123456789" -> canonical "12-3456789", or null when it cannot be a real EIN. */
export function checkFein(raw: string): string | null {
  const digits = (raw || "").replace(/[\s-]/g, "");
  if (!/^\d{9}$/.test(digits)) return null;
  if (/^(\d)\1{8}$/.test(digits) || digits === "123456789" || digits === "987654321") return null;
  if (!FEIN_PREFIXES.has(Number(digits.slice(0, 2)))) return null;
  return `${digits.slice(0, 2)}-${digits.slice(2)}`;
}

/** Validates the client payload shape; returns null when unusable. */
export function parseProof(raw: unknown): ProofFile | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const type = typeof r.type === "string" ? r.type.toLowerCase().trim() : "";
  const data = typeof r.data === "string" ? r.data.replace(/^data:[^,]*,/, "").replace(/\s+/g, "") : "";
  const name = typeof r.name === "string" ? r.name.replace(/[^\w.\- ]+/g, "_").slice(0, 100) : "proof";
  if (!type || !data || !/^[A-Za-z0-9+/]+=*$/.test(data)) return null;
  if (Math.floor((data.length * 3) / 4) > PROOF_MAX_BYTES) return null;
  return { name: name || "proof", type, data };
}

export function proofPrompt(biz: { company?: string; dba?: string; address?: string; name?: string }): string {
  return [
    "You are verifying that a small business is real for an insurance agency. The user uploaded the attached document as proof.",
    `Business name given: ${biz.company || "(none)"}`,
    `DBA given: ${biz.dba || "(none)"}`,
    `Mailing address given: ${biz.address || "(none)"}`,
    `Person submitting: ${biz.name || "(none)"}`,
    "",
    "Answer PASS if the document is a genuine-looking business document (business license, EIN/IRS letter, state registration,",
    "contractor license, insurance declarations page, invoice/estimate on letterhead, bank or tax document, vehicle/business sign photo)",
    "AND it names this business or DBA (minor spelling/suffix differences like LLC/Inc are fine) or this person as owner.",
    "Answer FAIL if it is clearly not a business document (selfie, meme, blank, screenshot of unrelated text) or names a different business.",
    "Answer UNCLEAR if you cannot read it or cannot tell.",
    'Reply with JSON only: {"verdict":"PASS|FAIL|UNCLEAR","reason":"<= 25 words"}',
  ].join("\n");
}

export function parseVerdict(text: string): ProofReview {
  const m = text.match(/\{[\s\S]*\}/);
  try {
    const j = JSON.parse(m ? m[0] : text) as { verdict?: string; reason?: string };
    const v = String(j.verdict || "").toLowerCase();
    const reason = String(j.reason || "").replace(/[\r\n]+/g, " ").slice(0, 300);
    if (v === "pass" || v === "fail" || v === "unclear") return { verdict: v, reason };
  } catch { /* fall through */ }
  const bare = text.trim().toUpperCase();
  if (/^PASS\b/.test(bare)) return { verdict: "pass", reason: "" };
  if (/^FAIL\b/.test(bare)) return { verdict: "fail", reason: "" };
  return { verdict: "unclear", reason: "unparseable model reply" };
}

type Env = Record<string, string | undefined>;
type FetchFn = (url: string, init: RequestInit) => Promise<Response>;

/** Never throws. Missing key / unsupported type / timeout / API error -> "unclear" (team reviews by hand). */
export async function reviewProof(file: ProofFile, biz: Parameters<typeof proofPrompt>[0], env: Env, fetchFn: FetchFn = fetch, timeoutMs = 20_000): Promise<ProofReview> {
  const key = (env.BEDROCK_LLM_API || "").trim();
  if (!key) return { verdict: "unclear", reason: "BEDROCK_LLM_API not configured" };
  const format = PROOF_TYPES[file.type];
  if (!format) return { verdict: "unclear", reason: `file type ${file.type} not machine-readable` };
  const region = (env.BEDROCK_REGION || "us-east-1").trim();
  const model = format === "pdf" ? (env.BEDROCK_PROOF_PDF_MODEL || DEFAULT_PDF_MODEL).trim() : (env.BEDROCK_PROOF_MODEL || DEFAULT_IMAGE_MODEL).trim();
  const block = format === "pdf"
    ? { document: { format: "pdf", name: "proof", source: { bytes: file.data } } }
    : { image: { format, source: { bytes: file.data } } };
  // maxTokens 2000: Sonnet spends tokens on reasoning first; 300 left no room for the JSON answer.
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetchFn(`https://bedrock-runtime.${region}.amazonaws.com/model/${encodeURIComponent(model)}/converse`, {
      method: "POST", signal: ctrl.signal,
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: [block, { text: proofPrompt(biz) }] }], inferenceConfig: { maxTokens: 2000 } }),
    });
    if (!res.ok) return { verdict: "unclear", reason: `bedrock HTTP ${res.status}`, model };
    const j = await res.json() as { output?: { message?: { content?: Array<{ text?: string }> } } };
    const text = (j.output?.message?.content ?? []).map((c) => c.text || "").join("").trim();
    return { ...parseVerdict(text), model };
  } catch (e) {
    return { verdict: "unclear", reason: (e as Error)?.name === "AbortError" ? "bedrock timeout" : "bedrock call failed", model };
  } finally { clearTimeout(timer); }
}
