import type { Contrato } from "./types";

export interface ContratoScore {
  contrato_id: string;
  total: number; // 0-100 (higher = more risk)
  indicadores: {
    vencido_sin_entregar: number;           // 0-25
    adiciones_excesivas: number;            // 0-25
    contratacion_directa_alto_valor: number; // 0-20
    concentracion_contratista: number;      // 0-15
    vinculo_familiar_funcionario: number;   // 0-15
  };
  semaforo: "verde" | "amarillo" | "naranja" | "rojo";
}

export function calculateContratoScore(
  contrato: Contrato,
  allContratos: Contrato[],
  familyNits: Set<string> = new Set()
): ContratoScore {
  const indicadores = {
    vencido_sin_entregar: 0,
    adiciones_excesivas: 0,
    contratacion_directa_alto_valor: 0,
    concentracion_contratista: 0,
    vinculo_familiar_funcionario: 0,
  };

  // 1. Vencido sin entregar (0-25)
  if (contrato.estado === "activo") {
    const fechaFin = new Date(contrato.fecha_fin);
    const hoy = new Date();
    if (fechaFin < hoy) {
      const mesesAtraso = Math.floor((hoy.getTime() - fechaFin.getTime()) / (1000 * 60 * 60 * 24 * 30));
      indicadores.vencido_sin_entregar = Math.min(25, 10 + mesesAtraso * 5);
    }
  }

  // 2. Adiciones excesivas (0-25)
  if (contrato.valor_contrato > 0 && contrato.valor_adiciones > 0) {
    const pctAdiciones = (contrato.valor_adiciones / contrato.valor_contrato) * 100;
    if (pctAdiciones > 50) indicadores.adiciones_excesivas = 25;
    else if (pctAdiciones > 30) indicadores.adiciones_excesivas = 20;
    else if (pctAdiciones > 15) indicadores.adiciones_excesivas = 10;
    else indicadores.adiciones_excesivas = 5;
  }

  // 3. Contratacion directa alto valor (0-20)
  if (contrato.modalidad === "Contratacion directa") {
    indicadores.contratacion_directa_alto_valor = 5;
    if (contrato.valor_contrato > 5_000_000_000) indicadores.contratacion_directa_alto_valor = 20;
    else if (contrato.valor_contrato > 1_000_000_000) indicadores.contratacion_directa_alto_valor = 15;
    else if (contrato.valor_contrato > 500_000_000) indicadores.contratacion_directa_alto_valor = 10;
  }

  // 4. Concentracion contratista (0-15)
  const contratosNit = allContratos.filter(
    (c) => c.contratista_nit === contrato.contratista_nit
  ).length;
  if (contratosNit >= 5) indicadores.concentracion_contratista = 15;
  else if (contratosNit >= 3) indicadores.concentracion_contratista = 10;
  else if (contratosNit >= 2) indicadores.concentracion_contratista = 5;

  // 5. Vinculo familiar (0-15)
  if (familyNits.has(contrato.contratista_nit)) {
    indicadores.vinculo_familiar_funcionario = 15;
  }

  const total = Object.values(indicadores).reduce((sum, v) => sum + v, 0);
  const semaforo: ContratoScore["semaforo"] =
    total >= 60 ? "rojo" : total >= 40 ? "naranja" : total >= 20 ? "amarillo" : "verde";

  return {
    contrato_id: contrato.id,
    total,
    indicadores,
    semaforo,
  };
}

export function calculateAllScores(contratos: Contrato[]): Map<string, ContratoScore> {
  const scores = new Map<string, ContratoScore>();
  for (const c of contratos) {
    scores.set(c.id, calculateContratoScore(c, contratos));
  }
  return scores;
}
