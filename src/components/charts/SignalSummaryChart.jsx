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
import { SIGNALS, SIGNAL_ORDER } from "../../config/signals";

const PALETTE = {
  plc1500_1: "#8fa8e4",   // azul pastel suave
  plc1500_2: "#b5c2f0",   // lila frío
  plc1200_1: "#9ad4c3",   // verde menta pastel
  plc1200_2: "#b7ead8",   // aqua pálido
  sensor_1:  "#c8dfc3",   // verde grisáceo suave
  sensor_2:  "#bad4e2",   // azul grisáceo suave
  default:   "#c7c9d1",   // gris azulado neutro
};

function getSoftColor(id) {
  if (id.includes("1500"))
    return id.includes("sensor")
      ? PALETTE.plc1500_2
      : PALETTE.plc1500_1;

  if (id.includes("1200"))
    return id.includes("sensor")
      ? PALETTE.plc1200_2
      : PALETTE.plc1200_1;

  if (id.includes("sensor"))
    return PALETTE.sensor_1;

  return PALETTE.default;
}

function buildSummary(data) {
  const total = data.length || 1;

  return SIGNAL_ORDER.map((id) => {
    const s = SIGNALS[id];
    if (!s) return null;

    let count = 0;
    data.forEach((row) => {
      const v = Number(row[id] ?? 0);
      if (v > 0) count++;
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

  return (
    <div className="p-4 rounded-xl border bg-white shadow-sm h-67">
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
          margin={{ top: 5, right: 20, left: -10, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 9 }}
            interval={0}
            angle={0}
            textAnchor="middle"
          />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip
            formatter={(value) => [value, "Registros con valor 1"]}
          />

          <Bar dataKey="count" name="Activaciones">
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