import { createClient } from "@/lib/supabase/server";
import { isModuleVisible } from "@/lib/data/modulos";
import { ModuleDisabled } from "@/components/ui/ModuleDisabled";
import GobiernoClient from "./GobiernoClient";

export interface FuncionarioGobierno {
  id: string;
  cargo: string;
  entidad: string;
  rama: string;
  fecha_inicio: string | null;
  persona: {
    id: string;
    nombre_completo: string;
    departamento_origen: string;
    foto_url: string | null;
  };
  partido: {
    id: string;
    nombre: string;
    color_hex: string;
  } | null;
}

export default async function GobiernoPage() {
  if (!await isModuleVisible("gobierno")) {
    return <ModuleDisabled label="Gobierno" />;
  }

  const supabase = await createClient();

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

  return <GobiernoClient funcionarios={funcionarios} />;
}
