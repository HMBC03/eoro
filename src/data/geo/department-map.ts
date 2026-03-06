// ============================================================
// Department ID mapping: @svg-maps/colombia <-> DANE codes <-> display names
// Names MUST match normalizeDepartamento() output in candidatos-reales.ts
// ============================================================

export interface DepartmentMapping {
  svgId: string;
  codigoDane: string;
  nombre: string;
  capital: string;
}

export const DEPARTMENT_MAP: DepartmentMapping[] = [
  { svgId: "ama", codigoDane: "91", nombre: "Amazonas", capital: "Leticia" },
  { svgId: "ant", codigoDane: "05", nombre: "Antioquia", capital: "Medellin" },
  { svgId: "ara", codigoDane: "81", nombre: "Arauca", capital: "Arauca" },
  { svgId: "atl", codigoDane: "08", nombre: "Atlantico", capital: "Barranquilla" },
  { svgId: "bol", codigoDane: "13", nombre: "Bolivar", capital: "Cartagena" },
  { svgId: "boy", codigoDane: "15", nombre: "Boyaca", capital: "Tunja" },
  { svgId: "cal", codigoDane: "17", nombre: "Caldas", capital: "Manizales" },
  { svgId: "caq", codigoDane: "18", nombre: "Caqueta", capital: "Florencia" },
  { svgId: "cas", codigoDane: "85", nombre: "Casanare", capital: "Yopal" },
  { svgId: "cau", codigoDane: "19", nombre: "Cauca", capital: "Popayan" },
  { svgId: "ces", codigoDane: "20", nombre: "Cesar", capital: "Valledupar" },
  { svgId: "cho", codigoDane: "27", nombre: "Choco", capital: "Quibdo" },
  { svgId: "cor", codigoDane: "23", nombre: "Cordoba", capital: "Monteria" },
  { svgId: "cun", codigoDane: "25", nombre: "Cundinamarca", capital: "Bogota" },
  { svgId: "dc", codigoDane: "11", nombre: "Bogota D.C.", capital: "Bogota" },
  { svgId: "guv", codigoDane: "95", nombre: "Guaviare", capital: "San Jose Del Guaviare" },
  { svgId: "gua", codigoDane: "94", nombre: "Guainia", capital: "Inirida" },
  { svgId: "hui", codigoDane: "41", nombre: "Huila", capital: "Neiva" },
  { svgId: "lag", codigoDane: "44", nombre: "La Guajira", capital: "Riohacha" },
  { svgId: "mag", codigoDane: "47", nombre: "Magdalena", capital: "Santa Marta" },
  { svgId: "met", codigoDane: "50", nombre: "Meta", capital: "Villavicencio" },
  { svgId: "nar", codigoDane: "52", nombre: "Narino", capital: "Pasto" },
  { svgId: "nsa", codigoDane: "54", nombre: "Norte de Santander", capital: "Cucuta" },
  { svgId: "put", codigoDane: "86", nombre: "Putumayo", capital: "Mocoa" },
  { svgId: "qui", codigoDane: "63", nombre: "Quindio", capital: "Armenia" },
  { svgId: "ris", codigoDane: "66", nombre: "Risaralda", capital: "Pereira" },
  { svgId: "san", codigoDane: "68", nombre: "Santander", capital: "Bucaramanga" },
  { svgId: "sap", codigoDane: "88", nombre: "San Andres", capital: "San Andres" },
  { svgId: "suc", codigoDane: "70", nombre: "Sucre", capital: "Sincelejo" },
  { svgId: "tol", codigoDane: "73", nombre: "Tolima", capital: "Ibague" },
  { svgId: "vac", codigoDane: "76", nombre: "Valle Del Cauca", capital: "Cali" },
  { svgId: "vau", codigoDane: "97", nombre: "Vaupes", capital: "Mitu" },
  { svgId: "vid", codigoDane: "99", nombre: "Vichada", capital: "Puerto Carreno" },
];

// Lookup indexes (built lazily)
let _bySvgId: Map<string, DepartmentMapping> | null = null;
let _byNombre: Map<string, DepartmentMapping> | null = null;
let _byDane: Map<string, DepartmentMapping> | null = null;

function ensureIndexes() {
  if (_bySvgId) return;
  _bySvgId = new Map();
  _byNombre = new Map();
  _byDane = new Map();
  for (const d of DEPARTMENT_MAP) {
    _bySvgId.set(d.svgId, d);
    _byNombre.set(d.nombre.toLowerCase(), d);
    _byDane.set(d.codigoDane, d);
  }
}

export function getDeptBySvgId(svgId: string): DepartmentMapping | undefined {
  ensureIndexes();
  return _bySvgId!.get(svgId);
}

export function getDeptByNombre(nombre: string): DepartmentMapping | undefined {
  ensureIndexes();
  return _byNombre!.get(nombre.toLowerCase());
}

export function getDeptByDane(code: string): DepartmentMapping | undefined {
  ensureIndexes();
  return _byDane!.get(code);
}
