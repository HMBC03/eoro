import { getAllPresidenciales } from "@/lib/data/presidenciales";
import PresidencialesClient from "./PresidencialesClient";
import { isModuleVisible } from "@/lib/data/modulos";
import { ModuleDisabled } from "@/components/ui/ModuleDisabled";

export default async function PresidencialesPage() {
  if (!(await isModuleVisible("presidenciales"))) {
    return <ModuleDisabled label="Presidenciales 2026" />;
  }

  const presidenciales = await getAllPresidenciales();

  return <PresidencialesClient presidenciales={presidenciales} />;
}
