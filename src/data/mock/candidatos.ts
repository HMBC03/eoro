import type {
  Persona,
  Candidatura,
  CargoPublico,
  DeclaracionPatrimonio,
  Antecedente,
  VinculoFamiliar,
  FinanciacionCampana,
  CandidatoCompleto,
} from "@/lib/types";
import { mockAlertas } from "./alertas";
import { getPartidoById, mockPartidos } from "./partidos";
import { calculateScore } from "@/lib/utils";
import { getPresidenciales2026, getPresidencialById, getFamiliarPres } from "./presidenciales-2026";

// ============================================================
// 18 mock candidates — fictional but realistic
// ============================================================

const personas: Persona[] = [
  {
    id: "c01",
    cedula: "1001001001",
    nombre_completo: "Mariana Velasco Torres",
    fecha_nacimiento: "1975-06-12",
    departamento_origen: "Antioquia",
    foto_url: null,

    biografia:
      "Abogada constitucionalista con 20 anos de experiencia. Exsenadora 2014-2022. Defensora de los derechos humanos y la reforma agraria. Ha trabajado en la Corte Constitucional.",
    redes_sociales: { twitter: "@mvelasco", instagram: "@marianavelasco" },
    created_at: "2025-01-15",
    updated_at: "2026-02-20",
  },
  {
    id: "c02",
    cedula: "1002002002",
    nombre_completo: "Ricardo Andres Castaño Mejia",
    fecha_nacimiento: "1968-11-03",
    departamento_origen: "Bogota D.C.",
    foto_url: null,

    biografia:
      "Empresario y economista. Exministro de Hacienda 2018-2020. Defensor del libre mercado y la reduccion del estado. MBA de Harvard.",
    redes_sociales: { twitter: "@rcastano", linkedin: "ricardocastano" },
    created_at: "2025-01-15",
    updated_at: "2026-02-20",
  },
  {
    id: "c03",
    cedula: "1003003003",
    nombre_completo: "Luz Angela Herrera Diaz",
    fecha_nacimiento: "1982-03-22",
    departamento_origen: "Valle del Cauca",
    foto_url: null,

    biografia:
      "Ingeniera ambiental y activista. Lider del movimiento ambiental del Pacifico. Concejala de Cali 2016-2019. Impulsora de economia circular.",
    redes_sociales: {
      twitter: "@luzherrera",
      instagram: "@luzangelaherrera",
    },
    created_at: "2025-02-01",
    updated_at: "2026-02-20",
  },
  {
    id: "c04",
    cedula: "1004004004",
    nombre_completo: "Carlos Eduardo Pinzon Ruiz",
    fecha_nacimiento: "1960-08-15",
    departamento_origen: "Santander",
    foto_url: null,

    biografia:
      "Militar retirado (General). Exministro de Defensa 2011-2013. Exembajador en Estados Unidos. Halcon en politica de seguridad.",
    redes_sociales: { twitter: "@cepinzon" },
    created_at: "2025-01-20",
    updated_at: "2026-02-20",
  },
  {
    id: "c05",
    cedula: "1005005005",
    nombre_completo: "Sandra Patricia Morales Quintero",
    fecha_nacimiento: "1979-12-01",
    departamento_origen: "Atlantico",
    foto_url: null,

    biografia:
      "Medica y salubrista publica. Exdirectora del INS. Lider en reforma al sistema de salud. Exrepresentante a la Camara por Atlantico.",
    redes_sociales: { twitter: "@sandramoralesq" },
    created_at: "2025-02-10",
    updated_at: "2026-02-20",
  },
  {
    id: "c06",
    cedula: "1006006006",
    nombre_completo: "Felipe Andres Gutierrez Vega",
    fecha_nacimiento: "1985-04-18",
    departamento_origen: "Cundinamarca",
    foto_url: null,

    biografia:
      "Abogado penalista y politologo. Exdirector del INPEC. Senador 2018-2026. Impulsor de la reforma a la justicia.",
    redes_sociales: { twitter: "@felipegutierrez", instagram: "@fgutierrezv" },
    created_at: "2025-01-10",
    updated_at: "2026-02-20",
  },
  {
    id: "c07",
    cedula: "1007007007",
    nombre_completo: "Diana Carolina Ospina Restrepo",
    fecha_nacimiento: "1990-07-25",
    departamento_origen: "Risaralda",
    foto_url: null,

    biografia:
      "Economista y emprendedora tech. Fundadora de una startup de govtech. Primera vez en politica electoral. Defensora de gobierno abierto.",
    redes_sociales: {
      twitter: "@dianaospina",
      instagram: "@dianaospinar",
      linkedin: "dianaospina",
    },
    created_at: "2025-03-01",
    updated_at: "2026-02-20",
  },
  {
    id: "c08",
    cedula: "1008008008",
    nombre_completo: "Jorge Enrique Duarte Paez",
    fecha_nacimiento: "1955-01-30",
    departamento_origen: "Norte de Santander",
    foto_url: null,

    biografia:
      "Ganadero y exgobernador de Norte de Santander 2008-2011. Cacique politico regional. Investigado por nexos con paramilitarismo (caso archivado).",
    redes_sociales: {},
    created_at: "2025-01-15",
    updated_at: "2026-02-20",
  },
  {
    id: "c09",
    cedula: "1009009009",
    nombre_completo: "Valentina Rojas Cardona",
    fecha_nacimiento: "1988-09-14",
    departamento_origen: "Caldas",
    foto_url: null,

    biografia:
      "Periodista investigativa. Premio Nacional de Periodismo 2020. Primera candidatura a Senado. Enfoque en transparencia y anticorrupcion.",
    redes_sociales: {
      twitter: "@valerojascardona",
      instagram: "@valerojas",
    },
    created_at: "2025-02-15",
    updated_at: "2026-02-20",
  },
  {
    id: "c10",
    cedula: "1010010010",
    nombre_completo: "Andres Mauricio Lopez Bernal",
    fecha_nacimiento: "1972-05-08",
    departamento_origen: "Bolivar",
    foto_url: null,

    biografia:
      "Ingeniero civil y exalcalde de Cartagena 2016-2019. Gestion polemica por contratos de obra publica. Senador desde 2022.",
    redes_sociales: { twitter: "@amlopezb" },
    created_at: "2025-01-15",
    updated_at: "2026-02-20",
  },
  {
    id: "c11",
    cedula: "1011011011",
    nombre_completo: "Catalina Fernandez Arias",
    fecha_nacimiento: "1983-02-28",
    departamento_origen: "Antioquia",
    foto_url: null,

    biografia:
      "Internacionalista y exdirectora de cooperacion internacional. Representante a la Camara 2022-2026. Defensora de equidad de genero.",
    redes_sociales: {
      twitter: "@catfernandez",
      instagram: "@catalinafernandeza",
    },
    created_at: "2025-02-01",
    updated_at: "2026-02-20",
  },
  {
    id: "c12",
    cedula: "1012012012",
    nombre_completo: "Miguel Angel Suarez Torres",
    fecha_nacimiento: "1965-10-20",
    departamento_origen: "Tolima",
    foto_url: null,

    biografia:
      "Sindicalista y lider campesino. Exrepresentante a la Camara por Tolima. Defensor de la reforma agraria y los derechos de los trabajadores.",
    redes_sociales: { twitter: "@miguelsuarezt" },
    created_at: "2025-01-20",
    updated_at: "2026-02-20",
  },
  {
    id: "c13",
    cedula: "1013013013",
    nombre_completo: "Natalia Andrea Gomez Salazar",
    fecha_nacimiento: "1991-11-05",
    departamento_origen: "Quindio",
    foto_url: null,

    biografia:
      "Abogada y activista digital. Cofundadora de ONG de transparencia. Candidata a Camara por primera vez. Experta en gobierno abierto y datos.",
    redes_sociales: {
      twitter: "@natgomez",
      instagram: "@nataliagomezs",
      tiktok: "@natgomezpolitica",
    },
    created_at: "2025-03-10",
    updated_at: "2026-02-20",
  },
  {
    id: "c14",
    cedula: "1014014014",
    nombre_completo: "Humberto Jose Ramirez Correa",
    fecha_nacimiento: "1958-06-22",
    departamento_origen: "Cordoba",
    foto_url: null,

    biografia:
      "Ganadero y exsenador por tres periodos. Dinastia politica familiar. Su hermano fue gobernador y su hijo es alcalde. Investigado por enriquecimiento ilicito (en curso).",
    redes_sociales: {},
    created_at: "2025-01-15",
    updated_at: "2026-02-20",
  },
  {
    id: "c15",
    cedula: "1015015015",
    nombre_completo: "Paola Andrea Mendieta Cruz",
    fecha_nacimiento: "1987-08-10",
    departamento_origen: "Boyaca",
    foto_url: null,

    biografia:
      "Educadora y exsecretaria de educacion de Boyaca. Representante a la Camara 2022-2026. Impulsora de la reforma educativa rural.",
    redes_sociales: {
      twitter: "@paolamendieta",
      instagram: "@paolamendieta",
    },
    created_at: "2025-02-05",
    updated_at: "2026-02-20",
  },
  {
    id: "c16",
    cedula: "1016016016",
    nombre_completo: "Oscar Ivan Bermudez Pardo",
    fecha_nacimiento: "1970-03-15",
    departamento_origen: "Meta",
    foto_url: null,

    biografia:
      "Empresario petrolero y exalcalde de Villavicencio. Senador 2014-2022. Defensor de la industria extractiva con responsabilidad ambiental.",
    redes_sociales: { twitter: "@oscarbermudez" },
    created_at: "2025-01-18",
    updated_at: "2026-02-20",
  },
  {
    id: "c17",
    cedula: "1017017017",
    nombre_completo: "Laura Cristina Echeverri Soto",
    fecha_nacimiento: "1993-01-19",
    departamento_origen: "Huila",
    foto_url: null,

    biografia:
      "Politologa y analista de datos. Asesora del Ministerio de las TIC. Primera candidatura. Propone digitalizacion del estado y gobierno de datos.",
    redes_sociales: {
      twitter: "@lauraecheverri",
      linkedin: "lauraecheverri",
    },
    created_at: "2025-03-01",
    updated_at: "2026-02-20",
  },
  {
    id: "c18",
    cedula: "1018018018",
    nombre_completo: "Rodrigo Alonso Cifuentes Vargas",
    fecha_nacimiento: "1963-12-04",
    departamento_origen: "Cauca",
    foto_url: null,

    biografia:
      "Lider indigena y exgobernador del Cauca. Defensor de los derechos de pueblos originarios. Senador 2018-2026. Impulsor de la autonomia territorial.",
    redes_sociales: { twitter: "@rodrigocifuentes" },
    created_at: "2025-01-15",
    updated_at: "2026-02-20",
  },
];

// --- Candidatures ---
const candidaturas: Candidatura[] = [
  // Presidential
  { id: "cand01", persona_id: "c01", eleccion_year: 2026, tipo: "presidencia", partido_id: "ph", circunscripcion: "Nacional", votos_obtenidos: null, elegido: false, estado: "inscrito", fuente: "Registraduria" },
  { id: "cand02", persona_id: "c02", eleccion_year: 2026, tipo: "presidencia", partido_id: "cd", circunscripcion: "Nacional", votos_obtenidos: null, elegido: false, estado: "inscrito", fuente: "Registraduria" },
  { id: "cand03", persona_id: "c03", eleccion_year: 2026, tipo: "presidencia", partido_id: "av", circunscripcion: "Nacional", votos_obtenidos: null, elegido: false, estado: "inscrito", fuente: "Registraduria" },
  // Senate
  { id: "cand04", persona_id: "c04", eleccion_year: 2026, tipo: "senado", partido_id: "cd", circunscripcion: "Nacional", votos_obtenidos: null, elegido: false, estado: "inscrito", fuente: "Registraduria" },
  { id: "cand05", persona_id: "c05", eleccion_year: 2026, tipo: "senado", partido_id: "pl", circunscripcion: "Nacional", votos_obtenidos: null, elegido: false, estado: "inscrito", fuente: "Registraduria" },
  { id: "cand06", persona_id: "c06", eleccion_year: 2026, tipo: "senado", partido_id: "cr", circunscripcion: "Nacional", votos_obtenidos: null, elegido: false, estado: "inscrito", fuente: "Registraduria" },
  { id: "cand07", persona_id: "c08", eleccion_year: 2026, tipo: "senado", partido_id: "pu", circunscripcion: "Nacional", votos_obtenidos: null, elegido: false, estado: "inscrito", fuente: "Registraduria" },
  { id: "cand08", persona_id: "c09", eleccion_year: 2026, tipo: "senado", partido_id: "av", circunscripcion: "Nacional", votos_obtenidos: null, elegido: false, estado: "inscrito", fuente: "Registraduria" },
  { id: "cand09", persona_id: "c10", eleccion_year: 2026, tipo: "senado", partido_id: "pl", circunscripcion: "Nacional", votos_obtenidos: null, elegido: false, estado: "inscrito", fuente: "Registraduria" },
  { id: "cand10", persona_id: "c12", eleccion_year: 2026, tipo: "senado", partido_id: "ph", circunscripcion: "Nacional", votos_obtenidos: null, elegido: false, estado: "inscrito", fuente: "Registraduria" },
  { id: "cand11", persona_id: "c14", eleccion_year: 2026, tipo: "senado", partido_id: "pc", circunscripcion: "Nacional", votos_obtenidos: null, elegido: false, estado: "inscrito", fuente: "Registraduria" },
  { id: "cand12", persona_id: "c16", eleccion_year: 2026, tipo: "senado", partido_id: "cr", circunscripcion: "Nacional", votos_obtenidos: null, elegido: false, estado: "inscrito", fuente: "Registraduria" },
  { id: "cand13", persona_id: "c18", eleccion_year: 2026, tipo: "senado", partido_id: "pd", circunscripcion: "Nacional", votos_obtenidos: null, elegido: false, estado: "inscrito", fuente: "Registraduria" },
  // House
  { id: "cand14", persona_id: "c07", eleccion_year: 2026, tipo: "camara", partido_id: "nc", circunscripcion: "Risaralda", votos_obtenidos: null, elegido: false, estado: "inscrito", fuente: "Registraduria" },
  { id: "cand15", persona_id: "c11", eleccion_year: 2026, tipo: "camara", partido_id: "av", circunscripcion: "Antioquia", votos_obtenidos: null, elegido: false, estado: "inscrito", fuente: "Registraduria" },
  { id: "cand16", persona_id: "c13", eleccion_year: 2026, tipo: "camara", partido_id: "ph", circunscripcion: "Quindio", votos_obtenidos: null, elegido: false, estado: "inscrito", fuente: "Registraduria" },
  { id: "cand17", persona_id: "c15", eleccion_year: 2026, tipo: "camara", partido_id: "pl", circunscripcion: "Boyaca", votos_obtenidos: null, elegido: false, estado: "inscrito", fuente: "Registraduria" },
  { id: "cand18", persona_id: "c17", eleccion_year: 2026, tipo: "camara", partido_id: "nc", circunscripcion: "Huila", votos_obtenidos: null, elegido: false, estado: "inscrito", fuente: "Registraduria" },
  // Historical candidatures
  { id: "hist01", persona_id: "c01", eleccion_year: 2014, tipo: "senado", partido_id: "ph", circunscripcion: "Nacional", votos_obtenidos: 89432, elegido: true, estado: "electo", fuente: "CEDAE" },
  { id: "hist02", persona_id: "c01", eleccion_year: 2018, tipo: "senado", partido_id: "ph", circunscripcion: "Nacional", votos_obtenidos: 112876, elegido: true, estado: "electo", fuente: "CEDAE" },
  { id: "hist03", persona_id: "c02", eleccion_year: 2022, tipo: "presidencia", partido_id: "cd", circunscripcion: "Nacional", votos_obtenidos: 2340000, elegido: false, estado: "inscrito", fuente: "CEDAE" },
  { id: "hist04", persona_id: "c06", eleccion_year: 2018, tipo: "senado", partido_id: "cr", circunscripcion: "Nacional", votos_obtenidos: 67543, elegido: true, estado: "electo", fuente: "CEDAE" },
  { id: "hist05", persona_id: "c10", eleccion_year: 2022, tipo: "senado", partido_id: "pl", circunscripcion: "Nacional", votos_obtenidos: 45210, elegido: true, estado: "electo", fuente: "CEDAE" },
  { id: "hist06", persona_id: "c14", eleccion_year: 2010, tipo: "senado", partido_id: "pc", circunscripcion: "Nacional", votos_obtenidos: 78900, elegido: true, estado: "electo", fuente: "CEDAE" },
  { id: "hist07", persona_id: "c14", eleccion_year: 2014, tipo: "senado", partido_id: "pc", circunscripcion: "Nacional", votos_obtenidos: 82100, elegido: true, estado: "electo", fuente: "CEDAE" },
  { id: "hist08", persona_id: "c14", eleccion_year: 2018, tipo: "senado", partido_id: "pu", circunscripcion: "Nacional", votos_obtenidos: 91000, elegido: true, estado: "electo", fuente: "CEDAE" },
];

// --- Public positions ---
const cargos: CargoPublico[] = [
  { id: "car01", persona_id: "c01", cargo: "Senadora de la Republica", entidad: "Senado", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2014-07-20", fecha_fin: "2022-07-20", partido_id: "ph", nivel: "nacional", fuente: "SIGEP" },
  { id: "car02", persona_id: "c02", cargo: "Ministro de Hacienda", entidad: "Ministerio de Hacienda", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2018-08-07", fecha_fin: "2020-03-15", partido_id: "cd", nivel: "nacional", fuente: "SIGEP" },
  { id: "car03", persona_id: "c03", cargo: "Concejala de Cali", entidad: "Concejo Municipal de Cali", departamento: "Valle del Cauca", municipio: "Cali", fecha_inicio: "2016-01-01", fecha_fin: "2019-12-31", partido_id: "av", nivel: "municipal", fuente: "SIGEP" },
  { id: "car04", persona_id: "c04", cargo: "Ministro de Defensa", entidad: "Ministerio de Defensa", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2011-08-07", fecha_fin: "2013-06-15", partido_id: null, nivel: "nacional", fuente: "SIGEP" },
  { id: "car05", persona_id: "c04", cargo: "Embajador en EE.UU.", entidad: "Embajada de Colombia", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2013-09-01", fecha_fin: "2017-08-06", partido_id: null, nivel: "nacional", fuente: "SIGEP" },
  { id: "car06", persona_id: "c05", cargo: "Representante a la Camara", entidad: "Camara de Representantes", departamento: "Atlantico", municipio: "Barranquilla", fecha_inicio: "2018-07-20", fecha_fin: "2022-07-20", partido_id: "pl", nivel: "nacional", fuente: "SIGEP" },
  { id: "car07", persona_id: "c06", cargo: "Senador de la Republica", entidad: "Senado", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2018-07-20", fecha_fin: "2026-07-20", partido_id: "cr", nivel: "nacional", fuente: "SIGEP" },
  { id: "car08", persona_id: "c08", cargo: "Gobernador de Norte de Santander", entidad: "Gobernacion N. Santander", departamento: "Norte de Santander", municipio: "Cucuta", fecha_inicio: "2008-01-01", fecha_fin: "2011-12-31", partido_id: "pu", nivel: "departamental", fuente: "SIGEP" },
  { id: "car09", persona_id: "c10", cargo: "Alcalde de Cartagena", entidad: "Alcaldia de Cartagena", departamento: "Bolivar", municipio: "Cartagena", fecha_inicio: "2016-01-01", fecha_fin: "2019-12-31", partido_id: "pl", nivel: "municipal", fuente: "SIGEP" },
  { id: "car10", persona_id: "c10", cargo: "Senador de la Republica", entidad: "Senado", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2022-07-20", fecha_fin: null, partido_id: "pl", nivel: "nacional", fuente: "SIGEP" },
  { id: "car11", persona_id: "c14", cargo: "Senador de la Republica", entidad: "Senado", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2010-07-20", fecha_fin: "2022-07-20", partido_id: "pc", nivel: "nacional", fuente: "SIGEP" },
  { id: "car12", persona_id: "c16", cargo: "Alcalde de Villavicencio", entidad: "Alcaldia de Villavicencio", departamento: "Meta", municipio: "Villavicencio", fecha_inicio: "2008-01-01", fecha_fin: "2011-12-31", partido_id: "cr", nivel: "municipal", fuente: "SIGEP" },
  { id: "car13", persona_id: "c16", cargo: "Senador de la Republica", entidad: "Senado", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2014-07-20", fecha_fin: "2022-07-20", partido_id: "cr", nivel: "nacional", fuente: "SIGEP" },
  { id: "car14", persona_id: "c18", cargo: "Gobernador del Cauca", entidad: "Gobernacion del Cauca", departamento: "Cauca", municipio: "Popayan", fecha_inicio: "2004-01-01", fecha_fin: "2007-12-31", partido_id: "pd", nivel: "departamental", fuente: "SIGEP" },
  { id: "car15", persona_id: "c18", cargo: "Senador de la Republica", entidad: "Senado", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2018-07-20", fecha_fin: null, partido_id: "pd", nivel: "nacional", fuente: "SIGEP" },
];

// --- Patrimony declarations ---
const declaraciones: DeclaracionPatrimonio[] = [
  // c01 — stable growth
  { id: "d01", persona_id: "c01", anio: 2020, patrimonio_total: 450_000_000, ingresos_total: 180_000_000, bienes_inmuebles_valor: 320_000_000, vehiculos_valor: 45_000_000, cuentas_bancarias_saldo: 85_000_000, conflictos_interes: [], fuente: "Ley 2013" },
  { id: "d02", persona_id: "c01", anio: 2022, patrimonio_total: 520_000_000, ingresos_total: 195_000_000, bienes_inmuebles_valor: 350_000_000, vehiculos_valor: 50_000_000, cuentas_bancarias_saldo: 120_000_000, conflictos_interes: [], fuente: "Ley 2013" },
  { id: "d03", persona_id: "c01", anio: 2025, patrimonio_total: 580_000_000, ingresos_total: 210_000_000, bienes_inmuebles_valor: 380_000_000, vehiculos_valor: 55_000_000, cuentas_bancarias_saldo: 145_000_000, conflictos_interes: ["Esposo socio de firma de abogados que asesora entidades publicas"], fuente: "Ley 2013" },
  // c02 — wealthy
  { id: "d04", persona_id: "c02", anio: 2020, patrimonio_total: 8_500_000_000, ingresos_total: 1_200_000_000, bienes_inmuebles_valor: 5_200_000_000, vehiculos_valor: 350_000_000, cuentas_bancarias_saldo: 2_950_000_000, conflictos_interes: ["Acciones en empresa con contratos con el estado"], fuente: "Ley 2013" },
  { id: "d05", persona_id: "c02", anio: 2025, patrimonio_total: 12_800_000_000, ingresos_total: 1_800_000_000, bienes_inmuebles_valor: 7_400_000_000, vehiculos_valor: 520_000_000, cuentas_bancarias_saldo: 4_880_000_000, conflictos_interes: ["Acciones en empresa con contratos con el estado"], fuente: "Ley 2013" },
  // c10 — suspicious growth
  { id: "d06", persona_id: "c10", anio: 2016, patrimonio_total: 380_000_000, ingresos_total: 120_000_000, bienes_inmuebles_valor: 250_000_000, vehiculos_valor: 60_000_000, cuentas_bancarias_saldo: 70_000_000, conflictos_interes: [], fuente: "Ley 2013" },
  { id: "d07", persona_id: "c10", anio: 2019, patrimonio_total: 1_250_000_000, ingresos_total: 160_000_000, bienes_inmuebles_valor: 850_000_000, vehiculos_valor: 180_000_000, cuentas_bancarias_saldo: 220_000_000, conflictos_interes: [], fuente: "Ley 2013" },
  { id: "d08", persona_id: "c10", anio: 2025, patrimonio_total: 2_100_000_000, ingresos_total: 200_000_000, bienes_inmuebles_valor: 1_400_000_000, vehiculos_valor: 250_000_000, cuentas_bancarias_saldo: 450_000_000, conflictos_interes: [], fuente: "Ley 2013" },
  // c14 — dynasty
  { id: "d09", persona_id: "c14", anio: 2015, patrimonio_total: 3_200_000_000, ingresos_total: 450_000_000, bienes_inmuebles_valor: 2_100_000_000, vehiculos_valor: 280_000_000, cuentas_bancarias_saldo: 820_000_000, conflictos_interes: ["Hermano gobernador de Cordoba", "Hijo alcalde de Monteria"], fuente: "Ley 2013" },
  { id: "d10", persona_id: "c14", anio: 2025, patrimonio_total: 5_800_000_000, ingresos_total: 680_000_000, bienes_inmuebles_valor: 3_900_000_000, vehiculos_valor: 420_000_000, cuentas_bancarias_saldo: 1_480_000_000, conflictos_interes: ["Hermano gobernador de Cordoba", "Hijo alcalde de Monteria", "Cunado contratista de la gobernacion"], fuente: "Ley 2013" },
  // c07 — modest
  { id: "d11", persona_id: "c07", anio: 2025, patrimonio_total: 120_000_000, ingresos_total: 96_000_000, bienes_inmuebles_valor: 0, vehiculos_valor: 35_000_000, cuentas_bancarias_saldo: 85_000_000, conflictos_interes: [], fuente: "Ley 2013" },
];

// --- Legal records ---
const antecedentes: Antecedente[] = [
  { id: "a01", persona_id: "c08", tipo: "disciplinario", estado: "archivado", descripcion: "Investigacion por presuntos nexos con grupos armados durante gobernacion", entidad_reporta: "Procuraduria General", fecha_sancion: "2013-06-15", fecha_vencimiento: null, fuente: "SIRI" },
  { id: "a02", persona_id: "c10", tipo: "fiscal", estado: "vigente", descripcion: "Investigacion por sobrecostos en contrato de via perimetral de Cartagena por $45.000M", entidad_reporta: "Contraloria General", fecha_sancion: "2021-03-10", fecha_vencimiento: null, fuente: "SIREL" },
  { id: "a03", persona_id: "c14", tipo: "disciplinario", estado: "vigente", descripcion: "Investigacion por posible enriquecimiento ilicito — patrimonio aumento 81% en un periodo legislativo", entidad_reporta: "Procuraduria General", fecha_sancion: "2024-09-01", fecha_vencimiento: null, fuente: "SIRI" },
  { id: "a04", persona_id: "c14", tipo: "fiscal", estado: "vigente", descripcion: "Vinculado a proceso de responsabilidad fiscal por contratos de la Gobernacion de Cordoba con empresa de su cunado", entidad_reporta: "Contraloria General", fecha_sancion: "2025-01-15", fecha_vencimiento: null, fuente: "SIREL" },
  { id: "a05", persona_id: "c16", tipo: "disciplinario", estado: "absuelto", descripcion: "Investigacion por presunta celebracion indebida de contratos en Alcaldia de Villavicencio", entidad_reporta: "Procuraduria General", fecha_sancion: "2014-05-20", fecha_vencimiento: "2014-12-01", fuente: "SIRI" },
];

// --- Family connections ---
const vinculos: VinculoFamiliar[] = [
  { id: "v01", persona_a_id: "c14", persona_b_id: "fam01", parentesco: "Hermano", verificado: true, fuente: "Ley 2013 / SIGEP", fecha_deteccion: "2024-06-15" },
  { id: "v02", persona_a_id: "c14", persona_b_id: "fam02", parentesco: "Hijo", verificado: true, fuente: "Ley 2013 / SIGEP", fecha_deteccion: "2024-06-15" },
  { id: "v03", persona_a_id: "c14", persona_b_id: "fam03", parentesco: "Cunado", verificado: true, fuente: "SECOP / Ley 2013", fecha_deteccion: "2025-01-10" },
  { id: "v04", persona_a_id: "c01", persona_b_id: "fam04", parentesco: "Esposo", verificado: true, fuente: "Ley 2013", fecha_deteccion: "2025-03-01" },
  { id: "v05", persona_a_id: "c10", persona_b_id: "fam05", parentesco: "Primo", verificado: false, fuente: "Investigacion periodistica", fecha_deteccion: "2024-11-20" },
];

// Extra personas for family members
const familiares: Persona[] = [
  { id: "fam01", cedula: "9001001001", nombre_completo: "Eduardo Ramirez Correa", fecha_nacimiento: "1961-04-10", departamento_origen: "Cordoba", foto_url: null, biografia: "Gobernador de Cordoba 2020-2023. Hermano del senador Humberto Ramirez.", redes_sociales: {}, created_at: "2025-01-15", updated_at: "2025-01-15" },
  { id: "fam02", cedula: "9002002002", nombre_completo: "Sebastian Ramirez Ochoa", fecha_nacimiento: "1990-07-20", departamento_origen: "Cordoba", foto_url: null, biografia: "Alcalde de Monteria 2024-2027. Hijo del senador Humberto Ramirez.", redes_sociales: {}, created_at: "2025-01-15", updated_at: "2025-01-15" },
  { id: "fam03", cedula: "9003003003", nombre_completo: "Luis Fernando Ochoa Ramirez", fecha_nacimiento: "1965-02-28", departamento_origen: "Cordoba", foto_url: null, biografia: "Empresario de construccion. Contratista de la Gobernacion de Cordoba. Cunado del senador.", redes_sociales: {}, created_at: "2025-01-15", updated_at: "2025-01-15" },
  { id: "fam04", cedula: "9004004004", nombre_completo: "Andres Felipe Torres Mejia", fecha_nacimiento: "1973-09-05", departamento_origen: "Antioquia", foto_url: null, biografia: "Abogado. Socio de firma que asesora entidades publicas. Esposo de Mariana Velasco.", redes_sociales: {}, created_at: "2025-03-01", updated_at: "2025-03-01" },
  { id: "fam05", cedula: "9005005005", nombre_completo: "Jairo Lopez Bernal", fecha_nacimiento: "1975-11-12", departamento_origen: "Bolivar", foto_url: null, biografia: "Contratista de obras civiles en Cartagena. Primo del senador Lopez.", redes_sociales: {}, created_at: "2024-11-20", updated_at: "2024-11-20" },
];

// --- Campaign finance ---
const financiacion: FinanciacionCampana[] = [
  // c01
  { id: "f01", candidatura_id: "cand01", tipo: "ingreso", concepto: "Recursos propios", valor: 180_000_000, aportante_nombre: "Mariana Velasco Torres", aportante_tipo: "propio", fuente: "Cuentas Claras" },
  { id: "f02", candidatura_id: "cand01", tipo: "ingreso", concepto: "Aporte del partido", valor: 520_000_000, aportante_nombre: "Pacto Historico", aportante_tipo: "estatal", fuente: "Cuentas Claras" },
  { id: "f03", candidatura_id: "cand01", tipo: "gasto", concepto: "Propaganda en redes sociales", valor: 320_000_000, aportante_nombre: "", aportante_tipo: "propio", fuente: "Cuentas Claras" },
  // c02
  { id: "f04", candidatura_id: "cand02", tipo: "ingreso", concepto: "Recursos propios", valor: 1_200_000_000, aportante_nombre: "Ricardo Castano Mejia", aportante_tipo: "propio", fuente: "Cuentas Claras" },
  { id: "f05", candidatura_id: "cand02", tipo: "ingreso", concepto: "Donacion empresarial", valor: 800_000_000, aportante_nombre: "Grupo Empresarial del Norte S.A.S.", aportante_tipo: "empresa", fuente: "Cuentas Claras" },
  { id: "f06", candidatura_id: "cand02", tipo: "ingreso", concepto: "Donacion familiar", valor: 350_000_000, aportante_nombre: "Familia Castano", aportante_tipo: "familiar", fuente: "Cuentas Claras" },
  // c14 — no report (red flag)
  // c09
  { id: "f07", candidatura_id: "cand08", tipo: "ingreso", concepto: "Crowdfunding ciudadano", valor: 45_000_000, aportante_nombre: "Donaciones individuales (<1M c/u)", aportante_tipo: "particular", fuente: "Cuentas Claras" },
  { id: "f08", candidatura_id: "cand08", tipo: "ingreso", concepto: "Recursos propios", valor: 15_000_000, aportante_nombre: "Valentina Rojas Cardona", aportante_tipo: "propio", fuente: "Cuentas Claras" },
];

// ============================================================
// Build complete candidate profiles
// ============================================================

export function buildCandidatoCompleto(personaId: string): CandidatoCompleto | null {
  const persona = [...personas, ...familiares].find((p) => p.id === personaId);
  if (!persona) return null;

  const candidaturasPersona = candidaturas.filter((c) => c.persona_id === personaId);
  const candidaturaActual = candidaturasPersona.find((c) => c.eleccion_year === 2026);
  if (!candidaturaActual) return null;

  const partido = getPartidoById(candidaturaActual.partido_id) ?? mockPartidos[0];
  const cargosPersona = cargos.filter((c) => c.persona_id === personaId);
  const declaracionesPersona = declaraciones.filter((d) => d.persona_id === personaId);
  const antecedentesPersona = antecedentes.filter((a) => a.persona_id === personaId);
  const vinculosPersona = vinculos.filter(
    (v) => v.persona_a_id === personaId || v.persona_b_id === personaId
  );
  const financiacionCandidatura = financiacion.filter(
    (f) => f.candidatura_id === candidaturaActual.id
  );
  const alertasPersona = mockAlertas.filter((a) => a.persona_id === personaId);

  const candidatoBase = {
    persona,
    candidatura_actual: candidaturaActual,
    partido,
    historial_cargos: cargosPersona,
    historial_candidaturas: candidaturasPersona,
    declaraciones: declaracionesPersona,
    antecedentes: antecedentesPersona,
    vinculos: vinculosPersona,
    financiacion: financiacionCandidatura,
    alertas: alertasPersona,
    score: { persona_id: personaId, total: 0, desglose: { financiacion_reportada: 0, sin_antecedentes_disciplinarios: 0, sin_responsabilidad_fiscal: 0, declaro_bienes: 0, crecimiento_patrimonial_razonable: 0, sin_familiares_vinculados: 0, sin_cambios_partido: 0, reporto_conflictos: 0 } },
  };

  candidatoBase.score = calculateScore(candidatoBase);
  return candidatoBase;
}

export function getAllCandidatos(): CandidatoCompleto[] {
  const mockCandidatos = candidaturas
    .filter((c) => c.eleccion_year === 2026)
    .map((c) => buildCandidatoCompleto(c.persona_id))
    .filter((c): c is CandidatoCompleto => c !== null);

  return [...getPresidenciales2026(), ...mockCandidatos];
}

export function getCandidatoById(id: string): CandidatoCompleto | null {
  return getPresidencialById(id) ?? buildCandidatoCompleto(id);
}

export function getFamiliarPersona(familiarId: string): Persona | undefined {
  return familiares.find((f) => f.id === familiarId) ?? getFamiliarPres(familiarId);
}

export { familiares };
