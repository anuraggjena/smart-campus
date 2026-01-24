export const DOMAIN_VALUES = [
  "ACADEMICS",
  "EXAMS",
  "FEES",
  "HOSTEL",
  "GENERAL",
] as const;

export type Domain = typeof DOMAIN_VALUES[number];

export function isValidDomain(
  value: string
): value is Domain {
  return DOMAIN_VALUES.includes(value as Domain);
}
