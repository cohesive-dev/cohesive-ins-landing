// Opaque customer codes generated in the CRM. Never infer a customer name from a URL.
export function referralCode(value: unknown): string {
  if (typeof value !== "string") return "";
  const code = value.trim().toLowerCase();
  return /^[a-f0-9]{20}$/.test(code) ? code : "";
}
