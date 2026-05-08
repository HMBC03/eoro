import { fetchSenadores, fetchAsistencias, fetchComisiones, unificarSenadoresConAsistencias, relacionarSenadoresConComisiones, getPartidosUnicos, getDefaultDateRange } from "@/lib/data/senadores";
import SenadoClient from "./SenadoClient";

export default async function SenadoPage() {
  const { startAt, endAt } = getDefaultDateRange();
  
  const [senadoresRaw, asimtas, comisiones] = await Promise.all([
    fetchSenadores(),
    fetchAsistencias(startAt, endAt),
    fetchComisiones(),
  ]);

  const senadoresConAsistencias = unificarSenadoresConAsistencias(senadoresRaw, asimtas);
  const senadores = relacionarSenadoresConComisiones(senadoresConAsistencias, comisiones);
  const partidos = getPartidosUnicos(senadores);

  return (
    <SenadoClient 
      initialSenadores={senadores}
      partidos={partidos}
      comisiones={comisiones}
      defaultStartAt={startAt}
      defaultEndAt={endAt}
    />
  );
}