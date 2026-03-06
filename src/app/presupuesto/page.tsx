import { getPresupuestoData } from "@/lib/data/presupuesto";
import { getContratos } from "@/lib/data/contratos";
import PresupuestoClient from "./PresupuestoClient";

export default async function PresupuestoPage() {
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
