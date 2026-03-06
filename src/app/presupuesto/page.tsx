import { getPresupuestoData } from "@/lib/data/presupuesto";
import { getContratos } from "@/lib/data/contratos";
import PresupuestoClient from "./PresupuestoClient";
import { isModuleVisible } from "@/lib/data/modulos";
import { ModuleDisabled } from "@/components/ui/ModuleDisabled";

export default async function PresupuestoPage() {
  if (!await isModuleVisible("presupuesto")) {
    return <ModuleDisabled label="Presupuesto" />;
  }

  const [presupuestoData, allContratos] = await Promise.all([
    getPresupuestoData(),
    getContratos(),
  ]);

  return (
    <PresupuestoClient
      pgnTotal={presupuestoData.pgn_total}
      ramas={presupuestoData.ramas}
      stats={presupuestoData.stats}
      allContratos={allContratos}
    />
  );
}
