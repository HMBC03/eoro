import { getAllCandidatos, getPartidosReales, getDepartamentosReales } from "@/lib/data/candidatos";
import CandidatosClient from "./CandidatosClient";

export default async function CandidatosPage() {
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
