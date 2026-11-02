/** Input-shape check shared by the browser and intake API. Not reachability proof. */
export function acceptedPhoneShape(value: string | undefined): boolean {
  const raw = (value || '').trim();
  if (!/^\+?[\d\s().-]+$/.test(raw)) return false;
  const digits = raw.replace(/\D/g, '');
  if (/^(\d)\1+$/.test(digits)) return false;
  return /^1?[2-9]\d{2}[2-9]\d{6}$/.test(digits)
    || (raw.startsWith('+') && !digits.startsWith('1') && /^[2-9]\d{7,14}$/.test(digits));
}
