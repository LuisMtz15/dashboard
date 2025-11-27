// src/components/charts/KpiCards.jsx
function formatNumber(value) {
  if (value == null || Number.isNaN(value)) return "-";
  return value.toLocaleString("es-MX", {
    maximumFractionDigits: 2,
  });
}

export default function KpiCards({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
          No hay datos todavía...
        </div>
      </div>
    );
  }

  const totalPoints = data.length;
  const avgMetric1 =
    data.reduce((acc, item) => acc + (item.metric1 || 0), 0) / totalPoints;
  const avgMetric2 =
    data.reduce((acc, item) => acc + (item.metric2 || 0), 0) / totalPoints;
  const uniqueStatus = new Set(data.map((d) => d.status)).size;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="p-4 rounded-xl border bg-white shadow-sm">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Registros
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">
          {formatNumber(totalPoints)}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Total de puntos recibidos
        </p>
      </div>

      <div className="p-4 rounded-xl border bg-white shadow-sm">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Promedio Métrica 1
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">
          {formatNumber(avgMetric1)}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Basado en todos los registros
        </p>
      </div>

      <div className="p-4 rounded-xl border bg-white shadow-sm">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Promedio Métrica 2
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">
          {formatNumber(avgMetric2)}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Basado en todos los registros
        </p>
      </div>

      <div className="p-4 rounded-xl border bg-white shadow-sm">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Estados distintos
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">
          {uniqueStatus}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Agrupado por campo "status"
        </p>
      </div>
    </div>
  );
}