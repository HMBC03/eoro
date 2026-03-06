import { getDepartmentStatsArray, getAllCandidatosReales } from "@/lib/data/mapa";
import MapaClient from "./MapaClient";

export default async function MapaPage() {
  const statsArray = getDepartmentStatsArray();
  const allCandidatos = getAllCandidatosReales();

  return (
    <MapaClient
      statsArray={statsArray}
      allCandidatos={allCandidatos}
    />
  );
}
