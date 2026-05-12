import { getDepartmentStatsArray } from "@/lib/data/mapa";
import MapaClient from "./MapaClient";
import { isModuleVisible } from "@/lib/data/modulos";
import { ModuleDisabled } from "@/components/ui/ModuleDisabled";

export default async function MapaPage() {
  if (!await isModuleVisible("mapa")) {
    return <ModuleDisabled label="Mapa" />;
  }

  const statsArray = getDepartmentStatsArray();

  return (
    <MapaClient
      statsArray={statsArray}
      allCandidatos={[]}
    />
  );
}
