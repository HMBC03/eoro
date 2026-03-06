// NITs of companies linked to family members of public officials
// Used by contract-score.ts to detect nepotism/conflict of interest

export const FAMILY_NITS = new Set<string>([
  // Ochoa Construcciones S.A.S. — Luis Fernando Ochoa Ramirez (cunado de senador Ramirez c14)
  "900456789-1",
  // Inversiones Ramirez & Ochoa Ltda. — familia Ramirez/Ochoa
  "901234567-8",
  // Lopez Ingenieria S.A.S. — Jairo Lopez Bernal (primo de senador Lopez c10)
  "900345678-2",
  // Caribe Consultores Ltda. — vinculado a red Lopez/Bolivar
  "900567890-3",
]);
