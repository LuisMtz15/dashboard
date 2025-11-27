// src/pages/Dashboard.jsx
import { useMetricsData } from "../hooks/useMetricsData";
import KpiCards from "../components/charts/KpiCards";
import TimeSeriesChart from "../components/charts/TimeSeriesChart";
import CategoryBarChart from "../components/charts/CategoryBarChart";
import Topbar from "../components/layout/Topbar";

export default function Dashboard() {
  const { data, loading, error } = useMetricsData();

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50">
      <Topbar />

      <main className="flex-1 px-4 py-4 md:px-6 md:py-6">
        {loading && (
          <div className="flex justify-center items-center h-40 text-slate-500 text-sm">
            Cargando datos de DynamoDB...
          </div>
        )}

        {error && !loading && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
            Error: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-6">
            <KpiCards data={data} />

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <TimeSeriesChart data={data} />
              </div>
              <div>
                <CategoryBarChart data={data} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}