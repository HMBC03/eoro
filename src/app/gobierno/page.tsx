import { createClient } from "@/lib/supabase/server";
import { isModuleVisible } from "@/lib/data/modulos";
import { ModuleDisabled } from "@/components/ui/ModuleDisabled";
import type { EntidadEstado, FuncionarioGobierno, ContratoConVotos, RamaGobierno } from "@/lib/types";
import GobiernoClient from "./GobiernoClient";

export interface GobiernoData {
  entidades: EntidadEstado[];
  funcionarios: FuncionarioGobierno[];
  contratos: ContratoConVotos[];
  presupuesto: RamaGobierno[];
}

export default async function GobiernoPage() {
  if (!await isModuleVisible("gobierno")) {
    return <ModuleDisabled label="Gobierno" />;
  }

  const supabase = await createClient();

  // 1. Fetch entidades del Estado (nueva tabla)
  const { data: entidadesData } = await supabase
    .schema("eoro")
    .from("entidad_estado")
    .select("*")
    .eq("activo", true)
    .order("orden");

  const entidades: EntidadEstado[] = (entidadesData ?? []) as EntidadEstado[];

  // 2. Fetch funcionarios actuales
  const { data: cargos } = await supabase
    .schema("eoro")
    .from("cargos_publicos")
    .select(`
      id, cargo, entidad, rama, fecha_inicio,
      personas!inner(id, nombre_completo, departamento_origen, foto_url),
      partidos(id, nombre, color_hex)
    `)
    .is("fecha_fin", null)
    .not("rama", "is", null)
    .order("rama")
    .order("cargo");

  const funcionarios: FuncionarioGobierno[] = ((cargos ?? []) as unknown as {
    id: string;
    cargo: string;
    entidad: string;
    rama: string;
    fecha_inicio: string | null;
    personas: { id: string; nombre_completo: string; departamento_origen: string; foto_url: string | null };
    partidos: { id: string; nombre: string; color_hex: string } | null;
  }[]).map((c) => ({
    id: c.id,
    cargo: c.cargo,
    entidad: c.entidad,
    rama: c.rama,
    fecha_inicio: c.fecha_inicio,
    persona: c.personas,
    partido: c.partidos,
  }));

  // 3. Fetch contratos (SECOP)
  const { data: contratosRaw } = await supabase
    .schema("eoro")
    .from("contratos")
    .select("*")
    .order("fecha_firma", { ascending: false })
    .limit(500);

  const contratos: ContratoConVotos[] = (contratosRaw ?? []).map((c: Record<string, unknown>) => ({
    ...c,
    votos_valida: 0,
    votos_cuestiona: 0,
  })) as ContratoConVotos[];

  // 4. Presupuesto: agrupar entidades por categoría (nuevo modelo)
  const presupuesto: RamaGobierno[] = [
    { id: "1", nombre: "Recaudo e Ingresos", presupuesto_total: 0, porcentaje_pgn: 0, entidades: [] },
    { id: "2", nombre: "Presupuesto y Ejecución", presupuesto_total: 0, porcentaje_pgn: 0, entidades: [] },
    { id: "3", nombre: "Contratación Pública", presupuesto_total: 0, porcentaje_pgn: 0, entidades: [] },
    { id: "4", nombre: "Órganos de Control", presupuesto_total: 0, porcentaje_pgn: 0, entidades: [] },
    { id: "5", nombre: "Gestión de Activos", presupuesto_total: 0, porcentaje_pgn: 0, entidades: [] },
    { id: "6", nombre: "Datos Abiertos", presupuesto_total: 0, porcentaje_pgn: 0, entidades: [] },
  ];

  // Agrupar entidades por categoría
  const categoryMap: Record<string, string> = {
    recaudo: "1",
    presupuesto: "2",
    contratacion: "3",
    control: "4",
    activos: "5",
    datos: "6",
  };

  for (const entidad of entidades) {
    const ramaId = categoryMap[entidad.categoria];
    if (ramaId) {
      const rama = presupuesto.find((r) => r.id === ramaId);
      if (rama) {
        rama.entidades.push({
          id: entidad.id,
          nombre: entidad.nombre,
          tipo: entidad.subcategoria || entidad.categoria,
          rama_id: ramaId,
          presupuesto_asignado: Number(entidad.presupuesto_asignado) || 0,
          ejecutado: Number(entidad.presupuesto_ejecutado) || 0,
          porcentaje_ejecucion: Number(entidad.porcentaje_ejecucion) || 0,
          num_contratos: entidad.num_contratos || 0,
          valor_contratos: Number(entidad.valor_contratos) || 0,
        });
      }
    }
  }

  return (
    <GobiernoClient
      entidades={entidades}
      funcionarios={funcionarios}
      contratos={contratos}
      presupuesto={presupuesto}
    />
  );
}