// ============================================================
// Colombian formatting utilities
// COP currency, dates in Spanish, large numbers
// ============================================================

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

/**
 * Format a number as Colombian Pesos
 * 1500000 -> "$1.500.000"
 */
export function formatCOP(value: number): string {
  return (
    "$" +
    Math.round(value)
      .toLocaleString("es-CO")
  );
}

/**
 * Format a number as COP with suffix for millions/billions
 * 1_500_000 -> "$1,5M"
 * 1_500_000_000 -> "$1.500M"
 */
export function formatCOPShort(value: number): string {
  if (value >= 1_000_000_000) {
    const billions = value / 1_000_000_000;
    return `$${billions.toLocaleString("es-CO", { maximumFractionDigits: 1 })} mil M`;
  }
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `$${millions.toLocaleString("es-CO", { maximumFractionDigits: 1 })}M`;
  }
  if (value >= 1_000) {
    const thousands = value / 1_000;
    return `$${thousands.toLocaleString("es-CO", { maximumFractionDigits: 0 })} mil`;
  }
  return formatCOP(value);
}

/**
 * Format a date string as Colombian Spanish
 * "2026-03-04" -> "4 de marzo de 2026"
 */
export function formatDateCO(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  const day = date.getDate();
  const month = MESES[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}

/**
 * Format a date as short: "Mar 2026"
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  const month = MESES[date.getMonth()].substring(0, 3);
  return `${month}. ${date.getFullYear()}`;
}

/**
 * Calculate age from birthdate string
 */
export function calculateAge(birthdate: string): number {
  const birth = new Date(birthdate + "T00:00:00");
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * Calculate percentage change between two values
 * Returns formatted string: "+45.2%" or "-12.8%"
 */
export function percentChange(oldVal: number, newVal: number): string {
  if (oldVal === 0) return newVal > 0 ? "+100%" : "0%";
  const change = ((newVal - oldVal) / oldVal) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

/**
 * Format large numbers for display
 * 1500000 -> "1,5 millones"
 * 1500000000 -> "1,5 mil millones"
 */
export function formatLargeNumber(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `${(value / 1_000_000_000_000).toLocaleString("es-CO", { maximumFractionDigits: 1 })} billones`;
  }
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toLocaleString("es-CO", { maximumFractionDigits: 1 })} mil millones`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString("es-CO", { maximumFractionDigits: 1 })} millones`;
  }
  return value.toLocaleString("es-CO");
}

/**
 * Days remaining until a target date
 */
export function daysUntil(targetDate: string): number {
  const target = new Date(targetDate + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Severity label and color mapping
 */
export function getSeverityLabel(severidad: "alta" | "media" | "baja"): {
  label: string;
  color: string;
} {
  const map = {
    alta: { label: "Alta", color: "text-red-600 bg-red-50" },
    media: { label: "Media", color: "text-amber-600 bg-amber-50" },
    baja: { label: "Baja", color: "text-green-600 bg-green-50" },
  };
  return map[severidad];
}
