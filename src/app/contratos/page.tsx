import { getContratosWithScores } from "@/lib/data/contratos";
import type { ContratoScore } from "@/lib/contract-score";
import ContratosClient from "./ContratosClient";

export default async function ContratosPage() {
  const { contratos, scores, stats } = await getContratosWithScores();

  // Convert Map to Record for RSC serialization
  const scoresRecord: Record<string, ContratoScore> = {};
  scores.forEach((v, k) => {
    scoresRecord[k] = v;
  });

  return (
    <ContratosClient
      contratos={contratos}
      scores={scoresRecord}
      stats={stats}
    />
  );
}
