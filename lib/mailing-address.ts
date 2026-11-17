// Keep the existing intake ZIP field for routing while retaining the full
// client-supplied mailing address in form details.
export function zipFromMailingAddress(address: string): string | undefined {
  return address.match(/\b(\d{5})(?:-\d{4})?\b/)?.[1];
}

export function hasMailableAddress(address: string): boolean {
  const value = address.trim();
  return Boolean(
    zipFromMailingAddress(value) &&
    /(?:\b\d+[A-Za-z]?\s+[A-Za-z]|\bP\.?\s*O\.?\s*Box\s+\d+)/i.test(value) &&
    (/\b[A-Z]{2}\s+\d{5}(?:-\d{4})?\b/i.test(value) || value.split(",").length >= 3) &&
    value.length >= 18
  );
}
