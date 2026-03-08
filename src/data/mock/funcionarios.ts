// ============================================================
// Mock Funcionarios — 12 public officials with full profiles
// ============================================================

import type {
  Persona,
  CargoPublico,
  DeclaracionPatrimonio,
  Antecedente,
  VinculoFamiliar,
  FuncionarioCompleto,
} from "@/lib/types";

// --- Personas ---

const personas: Persona[] = [
  {
    id: "fun01", cedula: "79845123", nombre_completo: "Carlos Andres Mejia Torres",
    fecha_nacimiento: "1975-03-12", departamento_origen: "Bogota D.C.", foto_url: null,
biografia: "Economista con maestria en finanzas publicas. 20 anos de experiencia en el sector publico financiero.",
    redes_sociales: { twitter: "@cmejia_hacienda", linkedin: "carlosmejia-fin" },
    created_at: "2024-01-01", updated_at: "2025-01-15",
  },
  {
    id: "fun02", cedula: "43567890", nombre_completo: "Maria Elena Vargas Rios",
    fecha_nacimiento: "1980-07-22", departamento_origen: "Antioquia", foto_url: null,
biografia: "Abogada tributarista con experiencia en la DIAN. Especialista en fiscalizacion aduanera.",
    redes_sociales: { linkedin: "mariavargas-dian" },
    created_at: "2024-01-01", updated_at: "2025-02-01",
  },
  {
    id: "fun03", cedula: "80123456", nombre_completo: "Jorge Enrique Patino Ruiz",
    fecha_nacimiento: "1968-11-05", departamento_origen: "Bogota D.C.", foto_url: null,
biografia: "Contador publico con 25 anos en organos de control fiscal. Experto en auditoria publica.",
    redes_sociales: {},
    created_at: "2024-01-01", updated_at: "2025-01-20",
  },
  {
    id: "fun04", cedula: "26789012", nombre_completo: "Sandra Milena Ochoa Diaz",
    fecha_nacimiento: "1982-04-18", departamento_origen: "Cordoba", foto_url: null,
biografia: "Abogada penalista de la Universidad de Cordoba. Procuradora regional desde 2021.",
    redes_sociales: { twitter: "@sochoa_proc" },
    created_at: "2024-01-01", updated_at: "2025-01-10",
  },
  {
    id: "fun05", cedula: "19456789", nombre_completo: "Luis Fernando Castano Gomez",
    fecha_nacimiento: "1972-09-30", departamento_origen: "Bogota D.C.", foto_url: null,
biografia: "Administrador publico con experiencia en gestion educativa. Ex director de colegio publico en Bogota.",
    redes_sociales: { linkedin: "lfcastano" },
    created_at: "2024-01-01", updated_at: "2025-02-05",
  },
  {
    id: "fun06", cedula: "52345678", nombre_completo: "Andrea del Pilar Rojas Mendez",
    fecha_nacimiento: "1978-01-14", departamento_origen: "Bogota D.C.", foto_url: null,
biografia: "Ingeniera civil con maestria en infraestructura vial. Directora del INVIAS desde 2023.",
    redes_sociales: { twitter: "@arojas_invias" },
    created_at: "2024-01-01", updated_at: "2025-01-25",
  },
  {
    id: "fun07", cedula: "12890123", nombre_completo: "Hector Raul Benavides Luna",
    fecha_nacimiento: "1976-06-08", departamento_origen: "Narino", foto_url: null,
biografia: "Economista pastuso con experiencia en hacienda departamental. Secretario desde 2020.",
    redes_sociales: {},
    created_at: "2024-01-01", updated_at: "2025-01-18",
  },
  {
    id: "fun08", cedula: "32678901", nombre_completo: "Patricia Moreno Gomez",
    fecha_nacimiento: "1984-12-03", departamento_origen: "Atlantico", foto_url: null,
biografia: "Urbanista con doctorado en planeacion territorial. Vinculada al sector publico desde 2015.",
    redes_sociales: { linkedin: "patriciamoreno-plan", instagram: "@patmoreno" },
    created_at: "2024-01-01", updated_at: "2025-02-10",
  },
  {
    id: "fun09", cedula: "16234567", nombre_completo: "Roberto Carlos Diaz Ortega",
    fecha_nacimiento: "1970-08-25", departamento_origen: "Valle Del Cauca", foto_url: null,
biografia: "Oficial de policia con 28 anos de servicio. Coronel asignado a la region del pacifico.",
    redes_sociales: {},
    created_at: "2024-01-01", updated_at: "2025-01-05",
  },
  {
    id: "fun10", cedula: "51901234", nombre_completo: "Luz Marina Perez Castro",
    fecha_nacimiento: "1979-05-17", departamento_origen: "Bogota D.C.", foto_url: null,
biografia: "Contadora con especializacion en presupuesto publico. 15 anos en el MinSalud.",
    redes_sociales: { linkedin: "luzperez-salud" },
    created_at: "2024-01-01", updated_at: "2025-02-15",
  },
  {
    id: "fun11", cedula: "79012345", nombre_completo: "Fernando Jose Restrepo Mejia",
    fecha_nacimiento: "1965-02-28", departamento_origen: "Bogota D.C.", foto_url: null,
biografia: "Abogado constitucionalista. Secretario General del Senado desde 2018. 30 anos de carrera legislativa.",
    redes_sociales: {},
    created_at: "2024-01-01", updated_at: "2025-01-30",
  },
  {
    id: "fun12", cedula: "41567890", nombre_completo: "Claudia Patricia Luna Reyes",
    fecha_nacimiento: "1977-10-09", departamento_origen: "Bogota D.C.", foto_url: null,
biografia: "Abogada con maestria en derecho penal. Magistrada auxiliar de la Corte Suprema desde 2022.",
    redes_sociales: { linkedin: "claudialuna-csj" },
    created_at: "2024-01-01", updated_at: "2025-02-20",
  },
];

// --- Cargos publicos ---

const cargos: Record<string, CargoPublico[]> = {
  fun01: [
    { id: "cargo-f01a", persona_id: "fun01", cargo: "Director General de Presupuesto", entidad: "Ministerio de Hacienda", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2022-08-15", fecha_fin: null, partido_id: null, nivel: "nacional", fuente: "SIGEP" },
    { id: "cargo-f01b", persona_id: "fun01", cargo: "Subdirector Financiero", entidad: "Ministerio de Hacienda", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2018-03-01", fecha_fin: "2022-08-14", partido_id: null, nivel: "nacional", fuente: "SIGEP" },
    { id: "cargo-f01c", persona_id: "fun01", cargo: "Asesor de Despacho", entidad: "DNP", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2014-06-10", fecha_fin: "2018-02-28", partido_id: null, nivel: "nacional", fuente: "SIGEP" },
  ],
  fun02: [
    { id: "cargo-f02a", persona_id: "fun02", cargo: "Directora Seccional de Impuestos", entidad: "DIAN", departamento: "Antioquia", municipio: "Medellin", fecha_inicio: "2021-04-01", fecha_fin: null, partido_id: null, nivel: "nacional", fuente: "SIGEP" },
    { id: "cargo-f02b", persona_id: "fun02", cargo: "Jefa de Division Juridica", entidad: "DIAN", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2016-07-15", fecha_fin: "2021-03-31", partido_id: null, nivel: "nacional", fuente: "SIGEP" },
  ],
  fun03: [
    { id: "cargo-f03a", persona_id: "fun03", cargo: "Contralor Delegado Sector Defensa", entidad: "Contraloria General", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2020-09-01", fecha_fin: null, partido_id: null, nivel: "nacional", fuente: "SIGEP" },
    { id: "cargo-f03b", persona_id: "fun03", cargo: "Director de Auditoria Fiscal", entidad: "Contraloria General", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2015-01-10", fecha_fin: "2020-08-31", partido_id: null, nivel: "nacional", fuente: "SIGEP" },
    { id: "cargo-f03c", persona_id: "fun03", cargo: "Auditor Senior", entidad: "Contraloria de Cundinamarca", departamento: "Cundinamarca", municipio: "Bogota", fecha_inicio: "2008-03-01", fecha_fin: "2014-12-31", partido_id: null, nivel: "departamental", fuente: "SIGEP" },
  ],
  fun04: [
    { id: "cargo-f04a", persona_id: "fun04", cargo: "Procuradora Regional de Cordoba", entidad: "Procuraduria General", departamento: "Cordoba", municipio: "Monteria", fecha_inicio: "2021-06-01", fecha_fin: null, partido_id: null, nivel: "departamental", fuente: "SIGEP" },
    { id: "cargo-f04b", persona_id: "fun04", cargo: "Asesora Juridica", entidad: "Gobernacion de Cordoba", departamento: "Cordoba", municipio: "Monteria", fecha_inicio: "2017-02-15", fecha_fin: "2021-05-31", partido_id: null, nivel: "departamental", fuente: "SIGEP" },
  ],
  fun05: [
    { id: "cargo-f05a", persona_id: "fun05", cargo: "Secretario General", entidad: "Ministerio de Educacion", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2023-01-15", fecha_fin: null, partido_id: null, nivel: "nacional", fuente: "SIGEP" },
    { id: "cargo-f05b", persona_id: "fun05", cargo: "Director de Calidad Educativa", entidad: "Ministerio de Educacion", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2019-04-01", fecha_fin: "2023-01-14", partido_id: null, nivel: "nacional", fuente: "SIGEP" },
    { id: "cargo-f05c", persona_id: "fun05", cargo: "Secretario de Educacion", entidad: "Alcaldia de Bogota", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2016-01-01", fecha_fin: "2019-03-31", partido_id: null, nivel: "municipal", fuente: "SIGEP" },
  ],
  fun06: [
    { id: "cargo-f06a", persona_id: "fun06", cargo: "Directora General", entidad: "INVIAS", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2023-07-01", fecha_fin: null, partido_id: null, nivel: "nacional", fuente: "SIGEP" },
    { id: "cargo-f06b", persona_id: "fun06", cargo: "Subdirectora de Red Vial", entidad: "INVIAS", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2019-10-01", fecha_fin: "2023-06-30", partido_id: null, nivel: "nacional", fuente: "SIGEP" },
    { id: "cargo-f06c", persona_id: "fun06", cargo: "Directora de Infraestructura", entidad: "Gobernacion de Cundinamarca", departamento: "Cundinamarca", municipio: "Bogota", fecha_inicio: "2015-05-15", fecha_fin: "2019-09-30", partido_id: null, nivel: "departamental", fuente: "SIGEP" },
  ],
  fun07: [
    { id: "cargo-f07a", persona_id: "fun07", cargo: "Secretario de Hacienda", entidad: "Gobernacion de Narino", departamento: "Narino", municipio: "Pasto", fecha_inicio: "2020-01-15", fecha_fin: null, partido_id: null, nivel: "departamental", fuente: "SIGEP" },
    { id: "cargo-f07b", persona_id: "fun07", cargo: "Director de Impuestos Departamentales", entidad: "Gobernacion de Narino", departamento: "Narino", municipio: "Pasto", fecha_inicio: "2016-03-01", fecha_fin: "2020-01-14", partido_id: null, nivel: "departamental", fuente: "SIGEP" },
  ],
  fun08: [
    { id: "cargo-f08a", persona_id: "fun08", cargo: "Secretaria de Planeacion", entidad: "Alcaldia de Barranquilla", departamento: "Atlantico", municipio: "Barranquilla", fecha_inicio: "2022-01-10", fecha_fin: null, partido_id: null, nivel: "municipal", fuente: "SIGEP" },
    { id: "cargo-f08b", persona_id: "fun08", cargo: "Directora de Urbanismo", entidad: "Alcaldia de Barranquilla", departamento: "Atlantico", municipio: "Barranquilla", fecha_inicio: "2018-06-01", fecha_fin: "2022-01-09", partido_id: null, nivel: "municipal", fuente: "SIGEP" },
    { id: "cargo-f08c", persona_id: "fun08", cargo: "Asesora de Planeacion", entidad: "Gobernacion del Atlantico", departamento: "Atlantico", municipio: "Barranquilla", fecha_inicio: "2015-02-01", fecha_fin: "2018-05-31", partido_id: null, nivel: "departamental", fuente: "SIGEP" },
  ],
  fun09: [
    { id: "cargo-f09a", persona_id: "fun09", cargo: "Coronel Comandante Departamento Valle", entidad: "Policia Nacional", departamento: "Valle Del Cauca", municipio: "Cali", fecha_inicio: "2023-03-01", fecha_fin: null, partido_id: null, nivel: "departamental", fuente: "SIGEP" },
    { id: "cargo-f09b", persona_id: "fun09", cargo: "Teniente Coronel", entidad: "Policia Nacional", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2018-01-15", fecha_fin: "2023-02-28", partido_id: null, nivel: "nacional", fuente: "SIGEP" },
    { id: "cargo-f09c", persona_id: "fun09", cargo: "Mayor", entidad: "Policia Nacional", departamento: "Cauca", municipio: "Popayan", fecha_inicio: "2012-06-01", fecha_fin: "2017-12-31", partido_id: null, nivel: "departamental", fuente: "SIGEP" },
    { id: "cargo-f09d", persona_id: "fun09", cargo: "Capitan", entidad: "Policia Nacional", departamento: "Valle Del Cauca", municipio: "Buenaventura", fecha_inicio: "2006-01-10", fecha_fin: "2012-05-31", partido_id: null, nivel: "departamental", fuente: "SIGEP" },
  ],
  fun10: [
    { id: "cargo-f10a", persona_id: "fun10", cargo: "Directora Financiera", entidad: "Ministerio de Salud", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2021-08-01", fecha_fin: null, partido_id: null, nivel: "nacional", fuente: "SIGEP" },
    { id: "cargo-f10b", persona_id: "fun10", cargo: "Subdirectora de Presupuesto", entidad: "Ministerio de Salud", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2017-05-15", fecha_fin: "2021-07-31", partido_id: null, nivel: "nacional", fuente: "SIGEP" },
  ],
  fun11: [
    { id: "cargo-f11a", persona_id: "fun11", cargo: "Secretario General", entidad: "Senado de la Republica", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2018-07-20", fecha_fin: null, partido_id: null, nivel: "nacional", fuente: "SIGEP" },
    { id: "cargo-f11b", persona_id: "fun11", cargo: "Asesor Juridico", entidad: "Senado de la Republica", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2010-03-01", fecha_fin: "2018-07-19", partido_id: null, nivel: "nacional", fuente: "SIGEP" },
    { id: "cargo-f11c", persona_id: "fun11", cargo: "Abogado Consultor", entidad: "Camara de Representantes", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2002-06-15", fecha_fin: "2010-02-28", partido_id: null, nivel: "nacional", fuente: "SIGEP" },
  ],
  fun12: [
    { id: "cargo-f12a", persona_id: "fun12", cargo: "Magistrada Auxiliar", entidad: "Corte Suprema de Justicia", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2022-02-01", fecha_fin: null, partido_id: null, nivel: "nacional", fuente: "SIGEP" },
    { id: "cargo-f12b", persona_id: "fun12", cargo: "Fiscal Delegada", entidad: "Fiscalia General de la Nacion", departamento: "Bogota D.C.", municipio: "Bogota", fecha_inicio: "2016-09-01", fecha_fin: "2022-01-31", partido_id: null, nivel: "nacional", fuente: "SIGEP" },
    { id: "cargo-f12c", persona_id: "fun12", cargo: "Jueza Penal Municipal", entidad: "Rama Judicial", departamento: "Cundinamarca", municipio: "Zipaquira", fecha_inicio: "2010-04-15", fecha_fin: "2016-08-31", partido_id: null, nivel: "municipal", fuente: "SIGEP" },
  ],
};

// --- Declaraciones de patrimonio ---

const declaraciones: Record<string, DeclaracionPatrimonio[]> = {
  fun01: [
    { id: "dec-f01a", persona_id: "fun01", anio: 2024, patrimonio_total: 620_000_000, ingresos_total: 185_000_000, bienes_inmuebles_valor: 380_000_000, vehiculos_valor: 85_000_000, cuentas_bancarias_saldo: 155_000_000, conflictos_interes: [], fuente: "Ley 2013" },
    { id: "dec-f01b", persona_id: "fun01", anio: 2023, patrimonio_total: 580_000_000, ingresos_total: 178_000_000, bienes_inmuebles_valor: 380_000_000, vehiculos_valor: 75_000_000, cuentas_bancarias_saldo: 125_000_000, conflictos_interes: [], fuente: "Ley 2013" },
  ],
  fun02: [
    { id: "dec-f02a", persona_id: "fun02", anio: 2024, patrimonio_total: 410_000_000, ingresos_total: 156_000_000, bienes_inmuebles_valor: 280_000_000, vehiculos_valor: 55_000_000, cuentas_bancarias_saldo: 75_000_000, conflictos_interes: [], fuente: "Ley 2013" },
    { id: "dec-f02b", persona_id: "fun02", anio: 2023, patrimonio_total: 385_000_000, ingresos_total: 148_000_000, bienes_inmuebles_valor: 280_000_000, vehiculos_valor: 45_000_000, cuentas_bancarias_saldo: 60_000_000, conflictos_interes: [], fuente: "Ley 2013" },
  ],
  fun03: [
    { id: "dec-f03a", persona_id: "fun03", anio: 2024, patrimonio_total: 890_000_000, ingresos_total: 210_000_000, bienes_inmuebles_valor: 550_000_000, vehiculos_valor: 120_000_000, cuentas_bancarias_saldo: 220_000_000, conflictos_interes: [], fuente: "Ley 2013" },
    { id: "dec-f03b", persona_id: "fun03", anio: 2023, patrimonio_total: 830_000_000, ingresos_total: 200_000_000, bienes_inmuebles_valor: 520_000_000, vehiculos_valor: 120_000_000, cuentas_bancarias_saldo: 190_000_000, conflictos_interes: [], fuente: "Ley 2013" },
    { id: "dec-f03c", persona_id: "fun03", anio: 2022, patrimonio_total: 780_000_000, ingresos_total: 190_000_000, bienes_inmuebles_valor: 520_000_000, vehiculos_valor: 100_000_000, cuentas_bancarias_saldo: 160_000_000, conflictos_interes: [], fuente: "Ley 2013" },
  ],
  fun04: [
    { id: "dec-f04a", persona_id: "fun04", anio: 2024, patrimonio_total: 320_000_000, ingresos_total: 135_000_000, bienes_inmuebles_valor: 200_000_000, vehiculos_valor: 45_000_000, cuentas_bancarias_saldo: 75_000_000, conflictos_interes: ["Familiar con contratos en Gobernacion de Cordoba"], fuente: "Ley 2013" },
    { id: "dec-f04b", persona_id: "fun04", anio: 2023, patrimonio_total: 290_000_000, ingresos_total: 128_000_000, bienes_inmuebles_valor: 190_000_000, vehiculos_valor: 40_000_000, cuentas_bancarias_saldo: 60_000_000, conflictos_interes: ["Familiar con contratos en Gobernacion de Cordoba"], fuente: "Ley 2013" },
  ],
  fun05: [
    { id: "dec-f05a", persona_id: "fun05", anio: 2024, patrimonio_total: 480_000_000, ingresos_total: 165_000_000, bienes_inmuebles_valor: 310_000_000, vehiculos_valor: 65_000_000, cuentas_bancarias_saldo: 105_000_000, conflictos_interes: [], fuente: "Ley 2013" },
  ],
  fun06: [
    { id: "dec-f06a", persona_id: "fun06", anio: 2024, patrimonio_total: 540_000_000, ingresos_total: 192_000_000, bienes_inmuebles_valor: 350_000_000, vehiculos_valor: 70_000_000, cuentas_bancarias_saldo: 120_000_000, conflictos_interes: [], fuente: "Ley 2013" },
    { id: "dec-f06b", persona_id: "fun06", anio: 2023, patrimonio_total: 510_000_000, ingresos_total: 185_000_000, bienes_inmuebles_valor: 350_000_000, vehiculos_valor: 60_000_000, cuentas_bancarias_saldo: 100_000_000, conflictos_interes: [], fuente: "Ley 2013" },
  ],
  fun07: [
    { id: "dec-f07a", persona_id: "fun07", anio: 2024, patrimonio_total: 280_000_000, ingresos_total: 118_000_000, bienes_inmuebles_valor: 180_000_000, vehiculos_valor: 35_000_000, cuentas_bancarias_saldo: 65_000_000, conflictos_interes: [], fuente: "Ley 2013" },
  ],
  fun08: [
    { id: "dec-f08a", persona_id: "fun08", anio: 2024, patrimonio_total: 350_000_000, ingresos_total: 142_000_000, bienes_inmuebles_valor: 220_000_000, vehiculos_valor: 50_000_000, cuentas_bancarias_saldo: 80_000_000, conflictos_interes: [], fuente: "Ley 2013" },
    { id: "dec-f08b", persona_id: "fun08", anio: 2023, patrimonio_total: 325_000_000, ingresos_total: 135_000_000, bienes_inmuebles_valor: 220_000_000, vehiculos_valor: 45_000_000, cuentas_bancarias_saldo: 60_000_000, conflictos_interes: [], fuente: "Ley 2013" },
  ],
  fun09: [
    { id: "dec-f09a", persona_id: "fun09", anio: 2024, patrimonio_total: 450_000_000, ingresos_total: 155_000_000, bienes_inmuebles_valor: 300_000_000, vehiculos_valor: 60_000_000, cuentas_bancarias_saldo: 90_000_000, conflictos_interes: [], fuente: "Ley 2013" },
  ],
  fun10: [
    { id: "dec-f10a", persona_id: "fun10", anio: 2024, patrimonio_total: 390_000_000, ingresos_total: 148_000_000, bienes_inmuebles_valor: 250_000_000, vehiculos_valor: 55_000_000, cuentas_bancarias_saldo: 85_000_000, conflictos_interes: [], fuente: "Ley 2013" },
    { id: "dec-f10b", persona_id: "fun10", anio: 2023, patrimonio_total: 365_000_000, ingresos_total: 140_000_000, bienes_inmuebles_valor: 250_000_000, vehiculos_valor: 45_000_000, cuentas_bancarias_saldo: 70_000_000, conflictos_interes: [], fuente: "Ley 2013" },
  ],
  fun11: [
    { id: "dec-f11a", persona_id: "fun11", anio: 2024, patrimonio_total: 1_200_000_000, ingresos_total: 280_000_000, bienes_inmuebles_valor: 750_000_000, vehiculos_valor: 180_000_000, cuentas_bancarias_saldo: 270_000_000, conflictos_interes: [], fuente: "Ley 2013" },
    { id: "dec-f11b", persona_id: "fun11", anio: 2023, patrimonio_total: 1_100_000_000, ingresos_total: 265_000_000, bienes_inmuebles_valor: 720_000_000, vehiculos_valor: 150_000_000, cuentas_bancarias_saldo: 230_000_000, conflictos_interes: [], fuente: "Ley 2013" },
    { id: "dec-f11c", persona_id: "fun11", anio: 2022, patrimonio_total: 980_000_000, ingresos_total: 250_000_000, bienes_inmuebles_valor: 680_000_000, vehiculos_valor: 120_000_000, cuentas_bancarias_saldo: 180_000_000, conflictos_interes: [], fuente: "Ley 2013" },
  ],
  fun12: [
    { id: "dec-f12a", persona_id: "fun12", anio: 2024, patrimonio_total: 470_000_000, ingresos_total: 175_000_000, bienes_inmuebles_valor: 300_000_000, vehiculos_valor: 70_000_000, cuentas_bancarias_saldo: 100_000_000, conflictos_interes: [], fuente: "Ley 2013" },
  ],
};

// --- Antecedentes (most clean, a few with records) ---

const antecedentes: Record<string, Antecedente[]> = {
  fun03: [
    { id: "ant-f03a", persona_id: "fun03", tipo: "disciplinario", estado: "archivado", descripcion: "Investigacion preliminar por presunta omision en informe de auditoria 2016. Archivada por falta de merito.", entidad_reporta: "Procuraduria General", fecha_sancion: "2017-06-15", fecha_vencimiento: null, fuente: "SIRI" },
  ],
  fun04: [
    { id: "ant-f04a", persona_id: "fun04", tipo: "disciplinario", estado: "vigente", descripcion: "Investigacion en curso por presunto conflicto de interes. Familiar con contratos en entidad supervisada.", entidad_reporta: "Procuraduria General", fecha_sancion: "2024-11-20", fecha_vencimiento: "2025-11-20", fuente: "SIRI" },
  ],
  fun07: [
    { id: "ant-f07a", persona_id: "fun07", tipo: "fiscal", estado: "archivado", descripcion: "Proceso de responsabilidad fiscal por presunta irregularidad en contrato de 2018. Cerrado por pago.", entidad_reporta: "Contraloria General", fecha_sancion: "2020-03-10", fecha_vencimiento: null, fuente: "SIREL" },
  ],
};

// --- Vinculos familiares (some linked to existing candidates) ---

const vinculos: Record<string, VinculoFamiliar[]> = {
  fun04: [
    { id: "vin-f04a", persona_a_id: "fun04", persona_b_id: "cand03", parentesco: "Prima", verificado: true, fuente: "Registraduria", fecha_deteccion: "2024-06-15" },
  ],
};

// --- Build FuncionarioCompleto array ---

function buildFuncionarios(): FuncionarioCompleto[] {
  return personas.map((persona) => {
    const personaCargos = cargos[persona.id] ?? [];
    const cargoActual = personaCargos.find((c) => c.fecha_fin === null) ?? personaCargos[0];

    return {
      persona,
      cargo_actual: cargoActual,
      historial_cargos: personaCargos,
      declaraciones: declaraciones[persona.id] ?? [],
      antecedentes: antecedentes[persona.id] ?? [],
      vinculos: vinculos[persona.id] ?? [],
    };
  });
}

const allFuncionarios = buildFuncionarios();

// --- Public API ---

export function getAllFuncionarios(): FuncionarioCompleto[] {
  return allFuncionarios;
}

export function getFuncionarioById(id: string): FuncionarioCompleto | null {
  return allFuncionarios.find((f) => f.persona.id === id) ?? null;
}

export function buscarFuncionarios(query: string): FuncionarioCompleto[] {
  if (!query || query.length < 2) return allFuncionarios;
  const q = query.toLowerCase();
  return allFuncionarios.filter(
    (f) =>
      f.persona.nombre_completo.toLowerCase().includes(q) ||
      f.cargo_actual.entidad.toLowerCase().includes(q) ||
      f.cargo_actual.cargo.toLowerCase().includes(q) ||
      f.cargo_actual.departamento.toLowerCase().includes(q)
  );
}
