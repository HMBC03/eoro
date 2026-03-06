import { getAllFuncionarios } from "@/lib/data/funcionarios";
import HistorialClient from "./HistorialClient";

export default async function HistorialPage() {
  const allFuncionarios = await getAllFuncionarios();
  return <HistorialClient allFuncionarios={allFuncionarios} />;
}
