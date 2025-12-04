// src/components/charts/KpiCards.jsx

// umbrales para considerar ALERTA por tiempo excesivo en el sensor capacitivo
const MAX_CAP_OK_1500 = 8; // si pasa de 8 muestras en 1 con botón ON → alerta
const MAX_CAP_OK_1200 = 8; // si pasa de 5 muestras en 1 con botón ON → alerta

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

  // rachas para ALERTAS (tiempo excesivo en sensor capacitivo con botón ON)
  let alertStreak1500 = 0;
  let alertStreak1200 = 0;
  let inAlertStreak1500 = false;
  let inAlertStreak1200 = false;

  // banderas para bloques de PARO (botón en 0)
  let inStopBlock1500 = false;
  let inStopBlock1200 = false;
  let lastStopEventIndex1500 = null;
  let lastStopEventIndex1200 = null;

  sortedData.forEach((row, index) => {
    const timestamp = row.timestamp || row.timestamp_bridge || null;

    const inicio1500 = Number(row.inicio_plc1500) === 1;
    const inicio1200 = Number(row.inicio_plc1200) === 1;

    const cap1500 = Number(row.sensor_capacitivo_1500) === 1;
    const cap1200 = Number(row.sensor_capacitivo_1200) === 1;

    // ---------- ALERTAS (CAPACITIVO EN 1 DEMASIADO TIEMPO) ----------

    // PLC 1500: botón ON + sensor capacitivo en 1
    if (inicio1500 && cap1500) {
      alertStreak1500 += 1;
    } else {
      alertStreak1500 = 0;
      inAlertStreak1500 = false;
    }

    if (alertStreak1500 > MAX_CAP_OK_1500 && !inAlertStreak1500) {
      alerts++;
      inAlertStreak1500 = true;
      alertEvents.push({
        index,
        timestamp,
        plc: "1500",
        raw: row,
        type: "alert",
        streak: alertStreak1500,
        reason:
          "Sensor capacitivo 1500 en 1 demasiado tiempo con botón de inicio en 1.",
      });
    }

    // PLC 1200: botón ON + sensor capacitivo en 1
    if (inicio1200 && cap1200) {
      alertStreak1200 += 1;
    } else {
      alertStreak1200 = 0;
      inAlertStreak1200 = false;
    }

    if (alertStreak1200 > MAX_CAP_OK_1200 && !inAlertStreak1200) {
      alerts++;
      inAlertStreak1200 = true;
      alertEvents.push({
        index,
        timestamp,
        plc: "1200",
        raw: row,
        type: "alert",
        streak: alertStreak1200,
        reason:
          "Sensor capacitivo 1200 en 1 demasiado tiempo con botón de inicio en 1.",
      });
    }

    // ---------- PAROS (BLOQUES DE BOTÓN OFF) ----------
    // Aquí aplicamos tu lógica:
    // true, true, true, false, false, false, true, false, false → 2 paros

    // PLC 1500
    if (!inicio1500) {
      if (!inStopBlock1500) {
        // entramos a un nuevo bloque de paro
        inStopBlock1500 = true;
        plannedStops++;

        const ev = {
          indexStart: index,
          indexEnd: index, // se irá actualizando
          timestampStart: timestamp,
          timestampEnd: timestamp,
          plc: "1500",
          raw: row,
          type: "stop",
          count: 1, // cuántos registros incluye el bloque
          reason: "Botón de inicio 1500 en 0 (inicio de un paro del PLC 1500).",
        };

        stopEvents.push(ev);
        lastStopEventIndex1500 = stopEvents.length - 1;
      } else if (lastStopEventIndex1500 != null) {
        // seguimos dentro del mismo bloque de paro
        const ev = stopEvents[lastStopEventIndex1500];
        ev.indexEnd = index;
        ev.timestampEnd = timestamp;
        ev.count += 1;
      }
    } else {
      // botón volvió a 1 → terminamos bloque de paro (si existía)
      inStopBlock1500 = false;
      lastStopEventIndex1500 = null;
    }

    // PLC 1200
    if (!inicio1200) {
      if (!inStopBlock1200) {
        inStopBlock1200 = true;
        plannedStops++;

        const ev = {
          indexStart: index,
          indexEnd: index,
          timestampStart: timestamp,
          timestampEnd: timestamp,
          plc: "1200",
          raw: row,
          type: "stop",
          count: 1,
          reason: "Botón de inicio 1200 en 0 (inicio de un paro del PLC 1200).",
        };

        stopEvents.push(ev);
        lastStopEventIndex1200 = stopEvents.length - 1;
      } else if (lastStopEventIndex1200 != null) {
        const ev = stopEvents[lastStopEventIndex1200];
        ev.indexEnd = index;
        ev.timestampEnd = timestamp;
        ev.count += 1;
      }
    } else {
      inStopBlock1200 = false;
      lastStopEventIndex1200 = null;
    }
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
          Alerta — Sensor capacitivo en 1 demasiado tiempo con botón de inicio en 1. <br />
          Paro — Bloques donde el botón de inicio está en 0
          (p. ej. true,true,true,false,false,false,true = 1 paro).
        </p>
      </button>
    </div>
  );
}