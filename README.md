# Eoro

Plataforma abierta de transparencia y fiscalizacion ciudadana para Colombia.

Visualiza candidatos, contratos publicos, conexiones politicas, presupuesto nacional y alertas de corrupcion en un solo lugar.

**[transparencia-colombia.vercel.app](https://transparencia-colombia.vercel.app)**

---

### Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS · D3.js · Recharts · Supabase

### Secciones

- **Candidatos 2026** — Perfiles, scores de transparencia, historiales, vinculos familiares
- **Contratos** — Explorador de contratacion publica con votacion ciudadana
- **Conexiones** — Grafo interactivo de relaciones politicas y economicas
- **Presupuesto** — Visualizacion del gasto publico por ramas y entidades
- **Mapa** — Vista geografica por departamento con metricas
- **Historial** — Trayectoria de funcionarios publicos
- **Alertas** — Deteccion de irregularidades y banderas rojas
- **Admin** — Panel protegido para gestion de datos

### Correr localmente

```bash
cp .env.example .env.local
# Agrega tus credenciales de Supabase en .env.local

npm install
npm run dev
```

### Contribuir

El proyecto es abierto. Si quieres aportar, abre un issue o un PR.

### Licencia

MIT

---

## Metodologia: Porcentajes de Asistencia y Votacion (Senado)

Los datos del Senado se obtienen de la API publica oficial `app.senado.gov.co/backend/api/public/v1`. A continuacion se detalla como se calculan los porcentajes que se muestran en la plataforma.

### Endpoints utilizados

| Endpoint | URL |
|---|---|
| Senadores | `https://app.senado.gov.co/backend/api/public/v1/senators?format=json` |
| Asistencias | `https://app.senado.gov.co/backend/api/public/v1/assistances?format=json&start_at=YYYY-MM-DD&end_at=YYYY-MM-DD` |
| Comisiones | `https://app.senado.gov.co/backend/api/public/v1/commissions?format=json` |
| Votaciones | `https://app.senado.gov.co/backend/api/public/v1/votes?format=json&start_at=YYYY-MM-DD&end_at=YYYY-MM-DD` |

### Calculo de Asistencia

**Periodo evaluado**: 20 jul 2022 – 19 jul 2026 (periodo legislativo completo).

1. Se obtienen todos los registros de asistencia del endpoint `/assistances` para el rango de fechas.
2. Se cuenta el **total de sesiones unicas** (fechas distintas con al menos un registro) dentro del periodo.
3. Para cada senador, se cuentan las sesiones donde `attended === "si"`.
4. El **porcentaje de asistencia** se calcula como:

```
% Asistencia = (sesiones_asistidas / total_sesiones_periodo) × 100
```

5. Adicionalmente, se calcula el **porcentaje desde su primer registro de asistencia** para senadores que asumieron el cargo tardiamente, evitando penalizarlos por sesiones anteriores a su ingreso.

```
% Desde ingreso = (sesiones_asistidas / sesiones_desde_fecha_primer_registro) × 100
```

### Calculo de Votacion

1. Se obtienen todos los registros del endpoint `/votes` para el periodo.
2. Se cuenta el total de **plenarias con votacion** (sesiones donde hubo al menos un voto registrado).
3. Para cada senador, se clasifican sus votos en `Si`, `No` o `Abstencion`.
4. La **participacion en votaciones** se calcula como:

```
% Participacion = (sesiones_donde_el_senador_voto / total_plenarias_con_votacion) × 100
```

### Alerta sobre calidad de datos

El API del Senado esta retornando **datos potencialmente inverosimiles** que afectan la precision de los porcentajes. Ejemplo de un registro anomalo detectado en el endpoint `/votes`:

```json
{
  "plenary_id": 8585,
  "created_at": "2026-05-07",
  "senator_id": "169",
  "senator_name": "Restrepo Correa Omar De Jesus",
  "project_id": 10024,
  "project_name": "Prueba voto 7",
  "vote": "Si"
}
```

Se observan registros con `project_name: "Prueba voto X"` y fechas del año **2026** (periodo que aun no ha concluido y para el cual no deberian existir datos completos). Estos registros de prueba estan siendo incluidos en el calculo de porcentajes de votacion, distorsionando las metricas reales.

**Esto es un error del API del Senado, no de esta plataforma.** Los datos se consumen tal cual como los entrega el organismo oficial. Se recomienda al equipo del Senado depurar su base de datos de votaciones para excluir registros de prueba y garantizar que solo se publiquen datos de sesiones reales.

### Revalidacion

Los datos se revalidan cada **20 minutos** (`revalidate: 1200`) para mantener la informacion actualizada sin saturar el API del Senado.
