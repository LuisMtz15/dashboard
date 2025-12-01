// src/components/charts/KpiCards.jsx

// mínimo de registros consecutivos con sensores estáticos
const MIN_STREAK = 6;

function formatNumber(value) {
  if (value == null || Number.isNaN(value)) return "-";
  return value.toLocaleString("es-MX", {
    maximumFractionDigits: 2,
  });
}

// pequeño helper para obtener un timestamp numérico seguro
function getTime(row) {
  const raw = row.timestamp || row.timestamp_bridge;
  const t = new Date(raw).getTime();
  if (Number.isNaN(t)) return null;
  return t;
}

export default function KpiCards({ data, onShowAlertStopDetail }) {
  if (!data || data.length === 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
          No hay datos todavía...
        </div>
      </div>
    );
  }

  // 🔹 Usar SIEMPRE los datos ordenados por tiempo ascendente
  const sortedData = [...data].sort((a, b) => {
    const ta = getTime(a);
    const tb = getTime(b);

    if (ta == null && tb == null) return 0;
    if (ta == null) return 1;   // sin timestamp se van al final
    if (tb == null) return -1;
    return ta - tb;             // ascendente
  });

  const total = sortedData.length;

  // Inicios (botones)
  const activaciones1200 = sortedData.reduce(
    (acc, d) => acc + (Number(d.inicio_plc1200) || 0),
    0
  );
  const activaciones1500 = sortedData.reduce(
    (acc, d) => acc + (Number(d.inicio_plc1500) || 0),
    0
  );

  // Sensores de carrera (porcentaje de registros en 1)
  const totalCarrera1200 = sortedData.reduce(
    (acc, d) => acc + (Number(d.sensor_carrera_1200) || 0),
    0
  );
  const totalCarrera1500 = sortedData.reduce(
    (acc, d) => acc + (Number(d.sensor_carrera_1500) || 0),
    0
  );
  const porcentajeCarrera1200 =
    total > 0 ? (totalCarrera1200 / total) * 100 : 0;
  const porcentajeCarrera1500 =
    total > 0 ? (totalCarrera1500 / total) * 100 : 0;

  // 🔍 Lógica para ALERTAS y PAROS usando solo las 6 señales, en orden temporal
  let alerts = 0;
  let plannedStops = 0;
  const alertEvents = [];
  const stopEvents = [];

  let prev = null;

  let streakStatic1500 = 0;
  let streakStatic1200 = 0;

  let inAlertStreak1500 = false;
  let inStopStreak1500 = false;
  let inAlertStreak1200 = false;
  let inStopStreak1200 = false;

  sortedData.forEach((row, index) => {
    if (prev) {
      const inicio1200 = Number(row.inicio_plc1200) === 1;
      const inicio1500 = Number(row.inicio_plc1500) === 1;

      const sensoresStatic1500 =
        row.sensor_carrera_1500 === prev.sensor_carrera_1500 &&
        row.sensor_capacitivo_1500 === prev.sensor_capacitivo_1500;

      const sensoresStatic1200 =
        row.sensor_carrera_1200 === prev.sensor_carrera_1200 &&
        row.sensor_capacitivo_1200 === prev.sensor_capacitivo_1200;

      const timestamp = row.timestamp || row.timestamp_bridge || null;

      // ---------- PLC 1500 ----------
      if (sensoresStatic1500) {
        streakStatic1500 += 1;
      } else {
        streakStatic1500 = 0;
        inAlertStreak1500 = false;
        inStopStreak1500 = false;
      }

      if (streakStatic1500 >= MIN_STREAK) {
        if (inicio1500) {
          // 🔴 ALERTA 1500: botón ON, sensores sin cambio por N registros
          if (!inAlertStreak1500) {
            alerts++;
            inAlertStreak1500 = true;
            inStopStreak1500 = false;
            alertEvents.push({
              index,
              timestamp,
              plc: "1500",
              raw: row,
              type: "alert",
              streak: streakStatic1500,
            });
          }
        } else {
          // 🟠 PARO 1500: botón OFF, sensores sin cambio por N registros
          if (!inStopStreak1500) {
            plannedStops++;
            inStopStreak1500 = true;
            inAlertStreak1500 = false;
            stopEvents.push({
              index,
              timestamp,
              plc: "1500",
              raw: row,
              type: "stop",
              streak: streakStatic1500,
            });
          }
        }
      }

      // ---------- PLC 1200 ----------
      if (sensoresStatic1200) {
        streakStatic1200 += 1;
      } else {
        streakStatic1200 = 0;
        inAlertStreak1200 = false;
        inStopStreak1200 = false;
      }

      if (streakStatic1200 >= MIN_STREAK) {
        if (inicio1200) {
          // 🔴 ALERTA 1200
          if (!inAlertStreak1200) {
            alerts++;
            inAlertStreak1200 = true;
            inStopStreak1200 = false;
            alertEvents.push({
              index,
              timestamp,
              plc: "1200",
              raw: row,
              type: "alert",
              streak: streakStatic1200,
            });
          }
        } else {
          // 🟠 PARO 1200
          if (!inStopStreak1200) {
            plannedStops++;
            inStopStreak1200 = true;
            inAlertStreak1200 = false;
            stopEvents.push({
              index,
              timestamp,
              plc: "1200",
              raw: row,
              type: "stop",
              streak: streakStatic1200,
            });
          }
        }
      }
    }

    prev = row;
  });

  const hasAlerts = alerts > 0;
  const hasStops = plannedStops > 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Registros totales */}
      <div className="p-4 rounded-xl border bg-white shadow-sm">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Registros totales
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">
          {formatNumber(total)}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Eventos capturados en DynamoDB
        </p>
      </div>

      {/* 2. Inicios combinados 1200 / 1500 */}
      <div className="p-4 rounded-xl border bg-white shadow-sm">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Inicios PLC 1200 / 1500
        </p>
        <div className="mt-2 space-y-1">
          <p className="text-lg font-semibold text-slate-900">
            1200: {formatNumber(activaciones1200)}
          </p>
          <p className="text-lg font-semibold text-slate-900">
            1500: {formatNumber(activaciones1500)}
          </p>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Veces que se activaron los botones de inicio de cada PLC.
        </p>
      </div>

      {/* 3. Sensores de carrera */}
      <div className="p-4 rounded-xl border bg-white shadow-sm">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Sensores de carrera activos
        </p>
        <p className="mt-2 text-lg font-semibold text-slate-900">
          1200: {porcentajeCarrera1200.toFixed(1)}%
        </p>
        <p className="mt-1 text-lg font-semibold text-slate-900">
          1500: {porcentajeCarrera1500.toFixed(1)}%
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Porcentaje de registros con sensor_carrera en 1.
        </p>
      </div>

      {/* 4. Alertas y paros */}
      <button
        type="button"
        className="p-4 rounded-xl border bg-white shadow-sm text-left cursor-pointer hover:border-slate-300 hover:shadow-md transition"
        onClick={() => {
          if (!onShowAlertStopDetail) return;
          if (!hasAlerts && !hasStops) return;
          onShowAlertStopDetail({
            alertEvents,
            stopEvents,
            hasAlerts,
            hasStops,
          });
        }}
      >
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Alertas y paros del proceso
        </p>

        <div className="mt-2 space-y-1">
          <p
            className={`text-lg font-semibold ${
              hasAlerts ? "text-red-700" : "text-slate-400"
            }`}
          >
            Alertas: {formatNumber(alerts)}
          </p>
          <p
            className={`text-lg font-semibold ${
              hasStops ? "text-amber-700" : "text-slate-400"
            }`}
          >
            Paros provocados: {formatNumber(plannedStops)}
          </p>
        </div>

        <p className="mt-1 text-[11px] text-slate-400 leading-snug">
          Alerta — Botón de inicio de cada PLC en 1 y sensores estáticos por varios registros. <br />
          Paro — Botón de inicio en 0 y sensores estáticos por varios registros.
        </p>
      </button>
    </div>
  );
}