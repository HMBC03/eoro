import { getGrafoData } from "@/lib/data/conexiones";
import ConexionesClient from "./ConexionesClient";
import { isModuleVisible } from "@/lib/data/modulos";
import { ModuleDisabled } from "@/components/ui/ModuleDisabled";

export default async function ConexionesPage() {
  if (!await isModuleVisible("conexiones")) {
    return <ModuleDisabled label="Conexiones" />;
  }

  const grafoData = await getGrafoData();
  return <ConexionesClient grafoData={grafoData} />;
}
