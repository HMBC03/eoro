import { getGrafoData } from "@/lib/data/conexiones";
import ConexionesClient from "./ConexionesClient";

export default async function ConexionesPage() {
  const grafoData = await getGrafoData();
  return <ConexionesClient grafoData={grafoData} />;
}
