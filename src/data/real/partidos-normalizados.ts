// ============================================================
// Normalization: 180 agrupaciones → familia politica + color
// Generated from Excel "Listado definitivo candidatos Congreso 2026"
// ============================================================

export interface PartidoNormalizado {
  id: string;
  nombre: string;
  sigla: string;
  color_hex: string;
  familia: string;
}

/**
 * Canonical parties — each family gets a unique color.
 */
export const PARTIDOS_CANON: Record<string, PartidoNormalizado> = {
  liberal: {
    id: "liberal",
    nombre: "Partido Liberal Colombiano",
    sigla: "PL",
    color_hex: "#CC0000",
    familia: "liberal",
  },
  conservador: {
    id: "conservador",
    nombre: "Partido Conservador Colombiano",
    sigla: "PC",
    color_hex: "#0033A0",
    familia: "conservador",
  },
  centro_democratico: {
    id: "centro_democratico",
    nombre: "Centro Democratico",
    sigla: "CD",
    color_hex: "#003DA5",
    familia: "centro_democratico",
  },
  partido_u: {
    id: "partido_u",
    nombre: "Partido de la U",
    sigla: "U",
    color_hex: "#FF6600",
    familia: "partido_u",
  },
  cambio_radical: {
    id: "cambio_radical",
    nombre: "Cambio Radical",
    sigla: "CR",
    color_hex: "#00A550",
    familia: "cambio_radical",
  },
  alianza_verde: {
    id: "alianza_verde",
    nombre: "Alianza Verde",
    sigla: "AV",
    color_hex: "#00843D",
    familia: "alianza_verde",
  },
  pacto_historico: {
    id: "pacto_historico",
    nombre: "Pacto Historico",
    sigla: "PH",
    color_hex: "#FFD700",
    familia: "pacto_historico",
  },
  mira: {
    id: "mira",
    nombre: "MIRA",
    sigla: "MIRA",
    color_hex: "#003366",
    familia: "mira",
  },
  salvacion: {
    id: "salvacion",
    nombre: "Salvacion Nacional",
    sigla: "MSN",
    color_hex: "#8B4513",
    familia: "salvacion",
  },
  nuevo_liberalismo: {
    id: "nuevo_liberalismo",
    nombre: "Nuevo Liberalismo",
    sigla: "NL",
    color_hex: "#E63946",
    familia: "nuevo_liberalismo",
  },
  ahora: {
    id: "ahora",
    nombre: "Ahora Colombia",
    sigla: "AC",
    color_hex: "#7B2D8E",
    familia: "ahora",
  },
  frente_amplio: {
    id: "frente_amplio",
    nombre: "Frente Amplio Unitario",
    sigla: "FAU",
    color_hex: "#D4A017",
    familia: "frente_amplio",
  },
  fuerza_ciudadana: {
    id: "fuerza_ciudadana",
    nombre: "Coalicion Fuerza Ciudadana",
    sigla: "FC",
    color_hex: "#2196F3",
    familia: "fuerza_ciudadana",
  },
  oxigeno: {
    id: "oxigeno",
    nombre: "Oxigeno",
    sigla: "OXI",
    color_hex: "#00BCD4",
    familia: "oxigeno",
  },
  creemos: {
    id: "creemos",
    nombre: "Creemos",
    sigla: "CRE",
    color_hex: "#FF9800",
    familia: "creemos",
  },
  dignidad: {
    id: "dignidad",
    nombre: "Dignidad & Compromiso",
    sigla: "D&C",
    color_hex: "#795548",
    familia: "dignidad",
  },
  alma: {
    id: "alma",
    nombre: "ALMA",
    sigla: "ALMA",
    color_hex: "#9C27B0",
    familia: "alma",
  },
  asi: {
    id: "asi",
    nombre: "Alianza Social Independiente",
    sigla: "ASI",
    color_hex: "#4CAF50",
    familia: "asi",
  },
  ecologista: {
    id: "ecologista",
    nombre: "Partido Ecologista Colombiano",
    sigla: "PEC",
    color_hex: "#388E3C",
    familia: "ecologista",
  },
  colombia_justa: {
    id: "colombia_justa",
    nombre: "Colombia Justa Libres",
    sigla: "CJL",
    color_hex: "#1565C0",
    familia: "colombia_justa",
  },
  en_marcha: {
    id: "en_marcha",
    nombre: "En Marcha",
    sigla: "EM",
    color_hex: "#E91E63",
    familia: "en_marcha",
  },
  democrata: {
    id: "democrata",
    nombre: "Partido Democrata Colombiano",
    sigla: "PDC",
    color_hex: "#607D8B",
    familia: "democrata",
  },
  la_fuerza: {
    id: "la_fuerza",
    nombre: "La Fuerza",
    sigla: "LF",
    color_hex: "#F44336",
    familia: "la_fuerza",
  },
  colombia_renaciente: {
    id: "colombia_renaciente",
    nombre: "Colombia Renaciente",
    sigla: "CRN",
    color_hex: "#FF7043",
    familia: "colombia_renaciente",
  },
  liga: {
    id: "liga",
    nombre: "Liga Gobernantes Anticorrupcion",
    sigla: "LIGA",
    color_hex: "#CDDC39",
    familia: "liga",
  },
  trabajo: {
    id: "trabajo",
    nombre: "Partido del Trabajo",
    sigla: "PT",
    color_hex: "#B71C1C",
    familia: "trabajo",
  },
  esperanza: {
    id: "esperanza",
    nombre: "Esperanza Democratica",
    sigla: "ED",
    color_hex: "#26A69A",
    familia: "esperanza",
  },
  mais: {
    id: "mais",
    nombre: "MAIS",
    sigla: "MAIS",
    color_hex: "#8D6E63",
    familia: "mais",
  },
  aico: {
    id: "aico",
    nombre: "AICO",
    sigla: "AICO",
    color_hex: "#A1887F",
    familia: "aico",
  },
  indigena: {
    id: "indigena",
    nombre: "Movimiento Indigena",
    sigla: "IND",
    color_hex: "#6D4C41",
    familia: "indigena",
  },
  afro: {
    id: "afro",
    nombre: "Comunidades Afrodescendientes",
    sigla: "AFRO",
    color_hex: "#4E342E",
    familia: "afro",
  },
  coalicion_regional: {
    id: "coalicion_regional",
    nombre: "Coalicion Regional",
    sigla: "REG",
    color_hex: "#78909C",
    familia: "coalicion_regional",
  },
  otro: {
    id: "otro",
    nombre: "Otro Movimiento",
    sigla: "OTRO",
    color_hex: "#9E9E9E",
    familia: "otro",
  },
};

/**
 * Maps each raw agrupacion name → canonical party key.
 * Uses substring matching for coalitions.
 */
export function normalizeAgrupacion(agrupacion: string): PartidoNormalizado {
  const upper = agrupacion.toUpperCase().trim();

  // --- Exact or primary matches (order matters for coalitions) ---

  // Pacto Historico family (including regional coalitions)
  if (upper.includes("PACTO HIST") || upper.includes("PACTO - VERDE") || upper === "PACTO FRENTE AMPLIO" || upper.includes("PACTO VERDE"))
    return PARTIDOS_CANON.pacto_historico;

  // Frente Amplio
  if (upper.includes("FRENTE AMPLIO") && !upper.includes("PACTO"))
    return PARTIDOS_CANON.frente_amplio;

  // Centro Democratico
  if (upper.includes("CENTRO DEMOCR"))
    return PARTIDOS_CANON.centro_democratico;

  // Liberal
  if (upper === "PARTIDO LIBERAL COLOMBIANO" || upper.includes("COALICIÓN LIBERAL"))
    return PARTIDOS_CANON.liberal;

  // Conservador
  if (upper === "PARTIDO CONSERVADOR COLOMBIANO" || upper.includes("PARTIDO CONSERVADOR -"))
    return PARTIDOS_CANON.conservador;

  // Partido de la U
  if (upper.includes("PARTIDO DE LA U") || upper.includes("UNIÓN POR LA GENTE"))
    return PARTIDOS_CANON.partido_u;

  // Cambio Radical
  if (upper === "PARTIDO CAMBIO RADICAL" || upper.includes("COALICIÓN CAMBIO RADICAL") || upper.startsWith("CR-"))
    return PARTIDOS_CANON.cambio_radical;

  // Alianza Verde
  if (upper.includes("ALIANZA VERDE") || upper.includes("VERDE EN MARCHA") || upper.includes("COALICIÓN VERDE") || upper.includes("COALICIÓN ALIANZA VERDE"))
    return PARTIDOS_CANON.alianza_verde;

  // MIRA
  if (upper.startsWith("MIRA") || upper === "PARTIDO POLÍTICO MIRA")
    return PARTIDOS_CANON.mira;

  // Salvacion Nacional
  if (upper.includes("SALVACIÓN NACIONAL") || upper.includes("SALVACION NACIONAL"))
    return PARTIDOS_CANON.salvacion;

  // Nuevo Liberalismo
  if (upper.includes("NUEVO LIBERALISMO"))
    return PARTIDOS_CANON.nuevo_liberalismo;

  // Ahora Colombia
  if (upper.includes("AHORA COLOMBIA"))
    return PARTIDOS_CANON.ahora;

  // Fuerza Ciudadana
  if (upper.includes("FUERZA CIUDADANA"))
    return PARTIDOS_CANON.fuerza_ciudadana;

  // Oxigeno
  if (upper.includes("OXÍGENO") || upper.includes("OXIGENO"))
    return PARTIDOS_CANON.oxigeno;

  // Alianza por Colombia / regional alliances
  if (upper === "ALIANZA POR COLOMBIA" || upper.startsWith("ALIANZA POR "))
    return PARTIDOS_CANON.coalicion_regional;

  // Creemos
  if (upper === "CREEMOS")
    return PARTIDOS_CANON.creemos;

  // Dignidad & Compromiso
  if (upper.includes("DIGNIDAD") && !upper.includes("MIRA"))
    return PARTIDOS_CANON.dignidad;

  // ALMA
  if (upper === "ALMA" || upper.startsWith("ALMA ") || (upper.includes("ALMA") && !upper.includes("CAMBIO") && !upper.includes("SALVAC") && !upper.includes("OXÍG")))
    return PARTIDOS_CANON.alma;

  // ASI
  if (upper.includes("ALIANZA SOCIAL INDEPENDIENTE") || upper === "PARTIDO ALIANZA SOCIAL INDEPENDIENTE \"ASI\"")
    return PARTIDOS_CANON.asi;

  // Ecologista
  if (upper.includes("ECOLOGISTA"))
    return PARTIDOS_CANON.ecologista;

  // Colombia Justa Libres
  if (upper.includes("COLOMBIA JUSTA") || upper.includes("CJL"))
    return PARTIDOS_CANON.colombia_justa;

  // En Marcha
  if (upper.includes("EN MARCHA") && !upper.includes("VERDE") && !upper.includes("COALICI") && !upper.includes("PARTIDO DE LA U"))
    return PARTIDOS_CANON.en_marcha;

  // Democrata
  if (upper.includes("DEMÓCRATA") || upper.includes("DEMOCRATA"))
    return PARTIDOS_CANON.democrata;

  // La Fuerza
  if (upper.includes("LA FUERZA") || upper === "NUESTRA FUERZA" || upper.startsWith("FUERZA "))
    return PARTIDOS_CANON.la_fuerza;

  // Colombia Renaciente
  if (upper.includes("RENACIENTE"))
    return PARTIDOS_CANON.colombia_renaciente;

  // Liga Gobernantes
  if (upper.includes("LIGA"))
    return PARTIDOS_CANON.liga;

  // Trabajo
  if (upper.includes("TRABAJO"))
    return PARTIDOS_CANON.trabajo;

  // Esperanza
  if (upper.includes("ESPERANZA"))
    return PARTIDOS_CANON.esperanza;

  // MAIS
  if (upper.includes("MAIS") || upper.includes("ALTERNATIVO INDÍGENA"))
    return PARTIDOS_CANON.mais;

  // AICO
  if (upper.includes("AICO") || upper.includes("AUTORIDADES INDÍGENAS DE COLOMBIA"))
    return PARTIDOS_CANON.aico;

  // Indigenous groups
  if (upper.includes("INDÍGENA") || upper.includes("INDIGENA") || upper.includes("CABILDO") || upper.includes("MINGA"))
    return PARTIDOS_CANON.indigena;

  // Afro communities
  if (upper.includes("AFRO") || upper.includes("COMUNIDAD NEGRA") || upper.includes("CONSEJO COMUNITARIO") || upper.includes("AFROCOLOMB") || upper.includes("COCOPEMA") || upper.includes("AFRODESCEND") || upper.includes("PALENQUE"))
    return PARTIDOS_CANON.afro;

  // Agrario
  if (upper.includes("AGRARIO"))
    return PARTIDOS_CANON.otro;

  // Known regional/minor
  if (
    upper.includes("BOGOTÁ ENTRE TODOS") ||
    upper.includes("PATRIOTAS") ||
    upper === "TODO ES POSIBLE" ||
    upper.includes("MOTOCICLISTAS") ||
    upper.includes("MOVIMIENTO SI") ||
    upper.includes("AVANZA") ||
    upper.includes("REVIVE") ||
    upper.includes("SABANEROS") ||
    upper.includes("SUMA") ||
    upper.includes("PUTUMAYO") ||
    upper.includes("COALICIÓN") ||
    upper.includes("CIUDADANOS RENOVEMOS") ||
    upper.includes("COLOMBIA SEGURA") ||
    upper.includes("POR RISARALDA") ||
    upper.includes("PR1MERO") ||
    upper.includes("ABC ") ||
    upper.includes("LISTA DE OVIEDO") ||
    upper.includes("VOZ DEL AMAZONAS")
  )
    return PARTIDOS_CANON.coalicion_regional;

  // Fallback
  return PARTIDOS_CANON.otro;
}

/**
 * Get all canonical parties (for filter dropdown)
 */
export function getAllPartidosNormalizados(): PartidoNormalizado[] {
  return Object.values(PARTIDOS_CANON).filter((p) => p.id !== "otro");
}
