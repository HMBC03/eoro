import { getAllCandidatos, getPartidosReales, getDepartamentosReales } from "@/lib/data/candidatos";
import CandidatosClient from "./CandidatosClient";
import { isModuleVisible } from "@/lib/data/modulos";
import { ModuleDisabled } from "@/components/ui/ModuleDisabled";

export default async function CandidatosPage() {
  if (!await isModuleVisible("candidatos")) {
    return <ModuleDisabled label="Candidatos 2026" />;
  }

  const [allCandidatos, partidos, departamentos] = await Promise.all([
    getAllCandidatos(),
    Promise.resolve(getPartidosReales()),
    Promise.resolve(getDepartamentosReales()),
  ]);

  return (
    <CandidatosClient
      allCandidatos={allCandidatos}
      partidos={partidos.map((p) => ({ id: p.id, nombre: p.nombre }))}
      departamentos={departamentos}
    />
  );
}
