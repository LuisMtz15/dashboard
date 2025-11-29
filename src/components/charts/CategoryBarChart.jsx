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

function groupByTopic(data) {
  const map = new Map();

  data.forEach((item) => {
    const key = item.topic ?? "N/A";
    const current = map.get(key) || { topic: key, count: 0 };
    current.count += 1;
    map.set(key, current);
  });

  return Array.from(map.values());
}

export default function CategoryBarChart({ data }) {
  const grouped = groupByTopic(data);

  return (
    <div className="p-4 rounded-xl border bg-white shadow-sm h-80">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Registros por topic
          </h3>
          <p className="text-xs text-slate-500">
            Conteo de mensajes de cada topic
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={grouped}
          margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="topic" tick={{ fontSize: 9 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="count" name="Registros" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}