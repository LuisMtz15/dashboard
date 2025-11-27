// src/components/charts/CategoryBarChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function groupByStatus(data) {
  const map = new Map();

  data.forEach((item) => {
    const key = item.status ?? "N/A";
    const current = map.get(key) || { status: key, count: 0 };
    current.count += 1;
    map.set(key, current);
  });

  return Array.from(map.values());
}

export default function CategoryBarChart({ data }) {
  const grouped = groupByStatus(data);

  return (
    <div className="p-4 rounded-xl border bg-white shadow-sm h-80">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Registros por estado
          </h3>
          <p className="text-xs text-slate-500">
            Conteo agrupado por campo "status"
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={grouped}
          margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="status" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="count" name="Registros" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}