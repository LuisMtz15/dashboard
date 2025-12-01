// src/components/charts/SignalSummaryChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import { SIGNALS, SIGNAL_ORDER } from "../../config/signals";

const PALETTE = {
  plc1500_1: "#8fa8e4",
  plc1500_2: "#b5c2f0",
  plc1200_1: "#9ad4c3",
  plc1200_2: "#b7ead8",
  sensor_1: "#c8dfc3",
  sensor_2: "#bad4e2",
  default: "#c7c9d1",
};

function getSoftColor(id) {
  if (id.includes("1500"))
    return id.includes("sensor") ? PALETTE.plc1500_2 : PALETTE.plc1500_1;

  if (id.includes("1200"))
    return id.includes("sensor") ? PALETTE.plc1200_2 : PALETTE.plc1200_1;

  if (id.includes("sensor")) return PALETTE.sensor_1;

  return PALETTE.default;
}

function buildSummary(data) {
  return SIGNAL_ORDER.map((id) => {
    const s = SIGNALS[id];
    if (!s) return null;

    let count = 0;
    data.forEach((row) => {
      if (Number(row[id] ?? 0) > 0) count++;
    });

    return {
      id,
      label: s.label,
      group: s.group,
      count,
    };
  }).filter(Boolean);
}

export default function SignalSummaryChart({ data }) {
  const summary = buildSummary(data);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < 1008);
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  return (
    <div className="p-4 rounded-xl border bg-white shadow-sm h-64">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Activaciones por señal
          </h3>
          <p className="text-xs text-slate-500">
            Total de veces que cada señal estuvo en 1.
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={summary}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: isMobile ? 55 : 30, // Solo cambia en móvil
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

          <XAxis
            dataKey="label"
            tick={{
              fontSize: isMobile ? 7 : 9, // solo móvil
            }}
            interval={isMobile ? 0 : 0} // solo móvil
            angle={isMobile ? -30 : 0} // solo móvil
            textAnchor={isMobile ? "end" : "middle"} // solo móvil
            height={isMobile ? 55 : 50} // solo móvil
          />

          <YAxis tick={{ fontSize: 10 }} />

          <Tooltip formatter={(value) => [value, "Registros con valor 1"]} />

          <Bar
            dataKey="count"
            name="Activaciones"
            barSize={isMobile ? 60 : 180} // barras un poco más finas solo en móvil
          >
            {summary.map((item) => (
              <Cell
                key={item.id}
                fill={getSoftColor(item.id)}
                fillOpacity={0.95}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}