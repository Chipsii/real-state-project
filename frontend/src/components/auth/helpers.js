export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function passwordChecks(pw) {
  const v = pw ?? "";
  const minLen = v.length >= 8;
  const hasUpper = /[A-Z]/.test(v);
  const hasLower = /[a-z]/.test(v);
  const hasNum = /\d/.test(v);
  const hasSym = /[^A-Za-z0-9]/.test(v);
  return { minLen, hasUpper, hasLower, hasNum, hasSym };
}

export function passwordOk(pw) {
  const c = passwordChecks(pw);
  const categories = [c.hasUpper, c.hasLower, c.hasNum, c.hasSym].filter(Boolean).length;
  return c.minLen && categories >= 3;
}

export function maskEmail(email) {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const safeName =
    name.length <= 2 ? name[0] + "*" : name.slice(0, 2) + "*".repeat(Math.min(6, name.length - 2));
  return `${safeName}@${domain}`;
}
