import { fetchSenadores, fetchAsistencias, fetchComisiones, fetchVotaciones, unificarSenadoresConAsistencias, relacionarSenadoresConComisiones, unificarSenadoresConVotaciones, getPartidosUnicos, getDefaultDateRange } from "@/lib/data/senadores";
import SenadoClient from "./SenadoClient";

export default async function SenadoPage() {
  const { startAt, endAt } = getDefaultDateRange();
  
  const [senadoresRaw, asimtas, comisiones, votaciones] = await Promise.all([
    fetchSenadores(),
    fetchAsistencias(startAt, endAt),
    fetchComisiones(),
    fetchVotaciones(startAt, endAt),
  ]);

  const senadoresConAsistencias = unificarSenadoresConAsistencias(senadoresRaw, asimtas);
  const senadoresConComisiones = relacionarSenadoresConComisiones(senadoresConAsistencias, comisiones);
  const Senado = unificarSenadoresConVotaciones(senadoresConComisiones, votaciones, asimtas);
  const partidos = getPartidosUnicos(Senado);

  return (
    <SenadoClient 
      initialSenadores={Senado}
      partidos={partidos}
      comisiones={comisiones}
      defaultStartAt={startAt}
      defaultEndAt={endAt}
    />
  );
}