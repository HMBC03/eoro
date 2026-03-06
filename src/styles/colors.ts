// ============================================================
// Color palette — Colombian flag + civic trust + data viz
// Used in Tailwind config and D3 visualizations
// ============================================================

export const colors = {
  // Colombian flag
  colombia: {
    yellow: "#FCD116",
    blue: "#003893",
    red: "#CE1126",
  },

  // Civic trust palette
  civic: {
    trust: "#1B4332",
    trustLight: "#2D6A4F",
    alert: "#D62828",
    neutral: "#F8F9FA",
    dark: "#212529",
    muted: "#6C757D",
  },

  // Data visualization
  viz: {
    safe: "#2D6A4F",
    warning: "#E9C46A",
    danger: "#E76F51",
    info: "#264653",
    highlight: "#2A9D8F",
  },

  // Graph node types
  nodos: {
    candidato: "#003893", // blue (overridden by party color)
    familiar: "#E76F51",
    cargo: "#89B0D0",
    contratista: "#2D6A4F",
    partido: "#6C757D",
  },

  // Alert severity
  severidad: {
    alta: "#DC2626",
    media: "#D97706",
    baja: "#059669",
  },

  // Political parties (approximated real colors)
  partidos: {
    pacto_historico: "#FFD700",
    centro_democratico: "#003DA5",
    partido_liberal: "#CC0000",
    partido_conservador: "#0033A0",
    cambio_radical: "#00A550",
    alianza_verde: "#00843D",
    partido_u: "#FF6600",
    colombia_humana: "#E4002B",
    polo_democratico: "#FFCC00",
    mira: "#003366",
  },
} as const;
