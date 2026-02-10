export type Domain =
  | "FEES"
  | "EXAMS"
  | "HOSTEL"
  | "ACADEMICS"
  | "GENERAL";

export function toDomain(value: string): Domain {
  return value as Domain;
}
