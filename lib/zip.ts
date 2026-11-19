// US ZIP from a free-text address. Takes the LAST 5-digit token, so "12345 Main St, Springfield, IL 62704"
// yields 62704, not the street number; ZIP+4 and a trailing ", USA" are fine.
export function extractZip(address?: string): string | undefined {
  if (!address) return undefined;
  const all = [...address.matchAll(/\b(\d{5})(?:-\d{4})?\b/g)];
  return all.length ? all[all.length - 1][1] : undefined;
}
