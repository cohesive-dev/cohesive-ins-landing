// Keep the existing intake ZIP field for routing while retaining the full
// client-supplied mailing address in form details.
export function zipFromMailingAddress(address: string): string | undefined {
  return address.match(/\b(\d{5})(?:-\d{4})?\b/)?.[1];
}

// A numbered street ("350 5th Ave", "100 1st St") is a street, not a missing one.
export function hasMailableAddress(address: string): boolean {
  const value = address.trim();
  return Boolean(
    zipFromMailingAddress(value) &&
    /(?:\b\d+[A-Za-z]?\s+(?:[A-Za-z]|\d+(?:st|nd|rd|th)\b)|\bP\.?\s*O\.?\s*Box\s+\d+)/i.test(value) &&
    (/\b[A-Z]{2}\s+\d{5}(?:-\d{4})?\b/i.test(value) || value.split(",").length >= 3) &&
    value.length >= 18
  );
}

// Two-letter state from a mailing address ("123 Main St, Sulphur, LA 70663, USA" -> "LA"); undefined if none.
export function stateFromMailingAddress(address: string): string | undefined {
  return address.match(/\b([A-Za-z]{2})\s+\d{5}(?:-\d{4})?\b/)?.[1]?.toUpperCase();
}
