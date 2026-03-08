import { createClient } from "@/lib/supabase/server";
import BuscarClient from "./BuscarClient";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

interface PersonaResult {
  id: string;
  nombre_completo: string;
  tipo: string;
  departamento_origen: string;
}

interface PartidoResult {
  id: string;
  nombre: string;
  sigla: string;
}

interface EntidadResult {
  id: string;
  nombre: string;
  tipo: string;
}

interface ContratoResult {
  id: string;
  objeto: string;
  contratista_nombre: string;
  entidad: string;
  valor_total: number;
}

export interface SearchResults {
  personas: PersonaResult[];
  partidos: PartidoResult[];
  entidades: EntidadResult[];
  contratos: ContratoResult[];
}

export default async function BuscarPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  let results: SearchResults = {
    personas: [],
    partidos: [],
    entidades: [],
    contratos: [],
  };

  if (query) {
    const supabase = await createClient();
    const pattern = `%${query}%`;

    const [personas, partidos, entidades, contratos] = await Promise.all([
      supabase
        .schema("eoro")
        .from("personas")
        .select("id, nombre_completo, tipo, departamento_origen")
        .ilike("nombre_completo", pattern)
        .limit(20),
      supabase
        .schema("eoro")
        .from("partidos")
        .select("id, nombre, sigla")
        .or(`nombre.ilike.${pattern},sigla.ilike.${pattern}`)
        .limit(10),
      supabase
        .schema("eoro")
        .from("entidades_presupuestales")
        .select("id, nombre, tipo")
        .ilike("nombre", pattern)
        .limit(10),
      supabase
        .schema("eoro")
        .from("contratos")
        .select("id, objeto, contratista_nombre, entidad, valor_total")
        .or(`objeto.ilike.${pattern},contratista_nombre.ilike.${pattern},entidad.ilike.${pattern}`)
        .limit(15),
    ]);

    results = {
      personas: (personas.data ?? []) as PersonaResult[],
      partidos: (partidos.data ?? []) as PartidoResult[],
      entidades: (entidades.data ?? []) as EntidadResult[],
      contratos: (contratos.data ?? []) as ContratoResult[],
    };
  }

  return <BuscarClient initialQuery={query} results={results} />;
}
