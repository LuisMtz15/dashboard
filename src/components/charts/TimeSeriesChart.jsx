// src/components/charts/TimeSeriesChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useMemo, useState } from "react";
import { SIGNALS } from "../../config/signals";

// opciones de rango de tiempo
const RANGE_OPTIONS = [
  { id: "all", label: "Todo" },
  { id: "1h", label: "Última hora", ms: 60 * 60 * 1000 },
  { id: "30m", label: "Últimos 30 min", ms: 30 * 60 * 1000 },
  { id: "5m", label: "Últimos 5 min", ms: 5 * 60 * 1000 },
];

function formatTimestamp(ts) {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return ts;
  }
}

// clave de fecha (YYYY-MM-DD) a partir del timestamp
function getDateKey(ts) {
  if (!ts) return null;
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return null;
  // formato estable tipo 2025-11-27
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// para mostrar la fecha en bonito
function formatDateLabel(dateKey) {
  if (!dateKey || dateKey === "all") return "Todas";
  const [y, m, d] = dateKey.split("-");
  const fake = new Date(Number(y), Number(m) - 1, Number(d));
  return fake.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export default function TimeSeriesChart({ data, selectedIds }) {
  const [rangeId, setRangeId] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");

  const activeSignals = selectedIds
    .map((id) => SIGNALS[id])
    .filter(Boolean);

  // 📅 calcular fechas disponibles en los datos
  const availableDates = useMemo(() => {
    if (!data || data.length === 0) return ["all"];

    const set = new Set();
    data.forEach((row) => {
      const key = getDateKey(row.timestamp);
      if (key) set.add(key);
    });

    const list = Array.from(set);
    list.sort(); // ascendente por fecha
    return ["all", ...list];
  }, [data]);

  // 🔍 filtramos datos según fecha + rango de tiempo
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // 1) Filtrar por fecha (si no es "all")
    let base = data;
    if (selectedDate !== "all") {
      base = data.filter((row) => {
        const key = getDateKey(row.timestamp);
        return key === selectedDate;
      });
    }

    if (!base || base.length === 0) return [];

    // 2) Filtrar por rango de tiempo dentro de esa fecha
    if (rangeId === "all") return base;

    const option = RANGE_OPTIONS.find((r) => r.id === rangeId);
    if (!option?.ms) return base;

    const validTimestamps = base
      .map((d) => new Date(d.timestamp))
      .filter((d) => !Number.isNaN(d.getTime()));

    if (validTimestamps.length === 0) return base;

    const maxTs = Math.max(...validTimestamps.map((d) => d.getTime()));
    const cutoff = maxTs - option.ms;

    return base.filter((row) => {
      const t = new Date(row.timestamp).getTime();
      if (Number.isNaN(t)) return false;
      return t >= cutoff;
    });
  }, [data, rangeId, selectedDate]);

  return (
    <div className="p-4 rounded-xl border bg-white shadow-sm h-93">
      <div className="flex flex-col gap-3 mb-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Señales vs tiempo
          </h3>
          <p className="text-xs text-slate-500">
            1 = activo, 0 = inactivo. Puedes activar o desactivar
            señales en el panel de la derecha.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-end">
          {/* Selector de fecha */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-500">
              Fecha:
            </span>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-[11px] rounded-full border border-slate-200 bg-slate-50 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-slate-300"
            >
              {availableDates.map((dateKey) => (
                <option key={dateKey} value={dateKey}>
                  {dateKey === "all"
                    ? "Todas"
                    : formatDateLabel(dateKey)}
                </option>
              ))}
            </select>
          </div>

          {/* Controles de rango de tiempo */}
          <div className="flex items-center gap-1 rounded-full bg-slate-100 px-1 py-0.5">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRangeId(opt.id)}
                className={`px-1.5 py-1 rounded-full text-[11px] font-medium transition ${
                  rangeId === opt.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <LineChart
          data={filteredData}
          margin={{
            top: 30,
            right: 20,
            left: -10,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTimestamp}
            tick={{ fontSize: 10 }}
          />
          <YAxis
            tick={{ fontSize: 10 }}
            domain={[0, 1]}
            ticks={[0, 1]}
            allowDecimals={false}
          />
          <Tooltip
            labelFormatter={(value) => `Hora: ${formatTimestamp(value)}`}
            formatter={(value, name) => [
              value,
              SIGNALS[name]?.label || name,
            ]}
          />

          {/* Leyenda siempre visible */}
          <Legend
            formatter={(value) => SIGNALS[value]?.label || value}
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: 12 }}
          />

          {activeSignals.map((sig) => (
            <Line
              key={sig.id}
              type="stepAfter"
              dataKey={sig.id}
              name={sig.id}
              stroke={sig.color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}