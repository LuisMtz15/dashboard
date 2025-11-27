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

function formatTimestamp(ts) {
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

export default function TimeSeriesChart({ data }) {
  return (
    <div className="p-4 rounded-xl border bg-white shadow-sm h-80">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Métricas en el tiempo
          </h3>
          <p className="text-xs text-slate-500">
            Comparación de metric1 y metric2
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTimestamp}
            tick={{ fontSize: 10 }}
          />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip
            labelFormatter={(value) => `Hora: ${formatTimestamp(value)}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="metric1"
            name="Métrica 1"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="metric2"
            name="Métrica 2"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}