import { notFound } from "next/navigation";
import { getFuncionarioById } from "@/lib/data/funcionarios";
import HistorialDetailClient from "./HistorialDetailClient";

export default async function FuncionarioPerfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const funcionario = await getFuncionarioById(id);
  if (!funcionario) notFound();

  return <HistorialDetailClient funcionario={funcionario} />;
}
