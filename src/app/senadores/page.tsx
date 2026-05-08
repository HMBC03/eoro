import { fetchSenadores, fetchAsistencias, unificarSenadoresConAsistencias, getPartidosUnicos, getDefaultDateRange } from "@/lib/data/senadores";
import SenadoresClient from "./SenadoresClient";

export default async function SenadoresPage() {
  const { startAt, endAt } = getDefaultDateRange();
  
  const [senadoresRaw, asimtas] = await Promise.all([
    fetchSenadores(),
    fetchAsistencias(startAt, endAt),
  ]);

  const senadores = unificarSenadoresConAsistencias(senadoresRaw, asimtas);
  const partidos = getPartidosUnicos(senadores);

  return (
    <SenadoresClient 
      initialSenadores={senadores}
      partidos={partidos}
      defaultStartAt={startAt}
      defaultEndAt={endAt}
    />
  );
}