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
import { useMemo, useState, useEffect } from "react";
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

function getDateKey(ts) {
  if (!ts) return null;
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

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

  // Detectar celular
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const activeSignals = selectedIds
    .map((id) => SIGNALS[id])
    .filter(Boolean);

  const availableDates = useMemo(() => {
    if (!data || data.length === 0) return ["all"];
    const set = new Set();
    data.forEach((row) => {
      const key = getDateKey(row.timestamp);
      if (key) set.add(key);
    });
    const list = Array.from(set);
    list.sort();
    return ["all", ...list];
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    let base = data;
    if (selectedDate !== "all") {
      base = data.filter((row) => getDateKey(row.timestamp) === selectedDate);
    }

    if (!base || base.length === 0) return [];

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
      return !Number.isNaN(t) && t >= cutoff;
    });
  }, [data, selectedDate, rangeId]);

  return (
    <div className="p-4 rounded-xl border bg-white shadow-sm h-93">
      {/* Encabezado */}
      <div className="flex flex-col gap-3 mb-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Señales vs tiempo
          </h3>
          <p className="text-xs text-slate-500">
            1 = activo, 0 = inactivo. Puedes activar o desactivar señales.
          </p>
        </div>

        {/* Controles */}
        <div className="flex flex-wrap items-center gap-2 justify-end">
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-500">Fecha:</span>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-[11px] rounded-full border border-slate-200 bg-slate-50 px-2 py-1"
            >
              {availableDates.map((dateKey) => (
                <option key={dateKey} value={dateKey}>
                  {dateKey === "all" ? "Todas" : formatDateLabel(dateKey)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-slate-100 px-1 py-0.5">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setRangeId(opt.id)}
                className={`px-1.5 py-1 rounded-full text-[11px] ${
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

      {/* 📉 Gráfica */}
      <ResponsiveContainer width="100%" height={isMobile ? "60%" : "80%"}>
        <LineChart
          data={filteredData}
          margin={{
            top: isMobile ? 10 : 30,
            right: isMobile ? 10 : 20,
            left: isMobile ? -5 : -10,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            opacity={isMobile ? 0.15 : 0.3}
          />

          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTimestamp}
            tick={{ fontSize: isMobile ? 8 : 10 }}
            interval={isMobile ? "preserveStartEnd" : 0}
            minTickGap={isMobile ? 35 : 5}
          />

          <YAxis
            tick={{ fontSize: isMobile ? 8 : 10 }}
            domain={[0, 1]}
            ticks={[0, 1]}
          />

          <Tooltip
            labelFormatter={(value) => `Hora: ${formatTimestamp(value)}`}
            formatter={(value, name) => [value, SIGNALS[name]?.label || name]}
          />

          {/* Leyenda oculta en celular */}
          {!isMobile && (
            <Legend
              formatter={(value) => SIGNALS[value]?.label || value}
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: 12 }}
            />
          )}

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