import { getAllFuncionarios } from "@/lib/data/funcionarios";
import HistorialClient from "./HistorialClient";
import { isModuleVisible } from "@/lib/data/modulos";
import { ModuleDisabled } from "@/components/ui/ModuleDisabled";

export default async function HistorialPage() {
  if (!await isModuleVisible("historial")) {
    return <ModuleDisabled label="Historial" />;
  }

  const allFuncionarios = await getAllFuncionarios();
  return <HistorialClient allFuncionarios={allFuncionarios} />;
}
