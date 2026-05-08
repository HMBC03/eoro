const SENADO_APIS = [
  {
    nombre: "Senadores",
    descripcion: "Lista completa de senators activos del Senado de la República con su información de contacto, partido político y comisión asignada.",
    endpoint: "https://app.senado.gov.co/backend/api/public/v1/senators?format=json",
    campos: ["id", "name", "party_name", "email", "phone", "web", "image", "commission_id", "followers"],
  },
  {
    nombre: "Comisiones",
    descripcion: "Comisiones permanentes del Senado con su descripción, integración de senators y información de contacto.",
    endpoint: "https://app.senado.gov.co/backend/api/public/v1/commissions?format=json",
    campos: ["id", "name", "description"],
  },
  {
    nombre: "Asistencias",
    descripcion: "Registro de asistencia de senators a las plenarias del Senado. Permite filtrar por rango de fechas.",
    endpoint: "https://app.senado.gov.co/backend/api/public/v1/assistances?format=json&start_at=YYYY-MM-DD&end_at=YYYY-MM-DD",
    campos: ["plenary_id", "plenary_created_at", "senator_id", "senator", "attended"],
  },
];

export default function DatosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Datos Abiertos - Fuentes</h1>
        <p className="text-gray-600 mb-4">
          Todos los datos presentados corresponden a informes del Senado de la República a través del acceso a datos públicos y transparencias. 
          Son tomados y presentados tal cual como la entidad lo carga.
        </p>
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-700">
            <strong>Nota:</strong> Los datos son obtenidos directamente de las APIs oficiales del Senado de Colombia. 
            Esta plataforma no modifica ni procesa la información, solo la presenta de forma estructurada para facilitar su consulta.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {SENADO_APIS.map((api) => (
          <div
            key={api.nombre}
            className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="bg-gray-900 px-5 py-4">
              <h3 className="font-semibold text-lg text-white">{api.nombre}</h3>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600 mb-4">{api.descripcion}</p>
              
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 uppercase mb-2">Endpoint</p>
                <code className="block p-3 bg-gray-100 rounded-lg text-xs text-gray-700 break-all">
                  {api.endpoint}
                </code>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-2">Campos disponibles</p>
                <div className="flex flex-wrap gap-2">
                  {api.campos.map((campo) => (
                    <span
                      key={campo}
                      className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-xs text-blue-700"
                    >
                      {campo}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <a
                  href={api.endpoint}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Ver datos en vivo
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500">
          <strong>Fuente:</strong> Senado de la República de Colombia - Datos Abiertos
          <br />
          <strong>URL oficial:</strong> https://app.senado.gov.co
          <br />
          Los datos son publicados bajo laLicense de datos abiertos del Senado de Colombia.
        </p>
      </div>
    </div>
  );
}