// src/pages/Dashboard.jsx
import { useState } from "react";
import { useMetricsData } from "../hooks/useMetricsData";
import KpiCards from "../components/charts/KpiCards";
import TimeSeriesChart from "../components/charts/TimeSeriesChart";
import SignalSummaryChart from "../components/charts/SignalSummaryChart";
import SignalSelector from "../components/controls/SignalSelector";
import AlertStopModal from "../components/modals/AlertStopModal";

export default function Dashboard() {
  const { data, loading, error } = useMetricsData();

  const [selectedSignals, setSelectedSignals] = useState([
    "inicio_plc1500",
    "inicio_plc1200",
    "sensor_carrera_1500",
    "sensor_carrera_1200",
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [alertEvents, setAlertEvents] = useState([]);
  const [stopEvents, setStopEvents] = useState([]);
  const [defaultTab, setDefaultTab] = useState("alert"); // "alert" | "stop"

  if (loading) {
    return (
      <main className="flex-1 p-4 md:p-6">
        <p className="text-sm text-slate-500">Cargando datos...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 p-4 md:p-6">
        <p className="text-sm text-red-600">Error cargando datos: {error}</p>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 md:p-6 space-y-6">
      <section>
        <h1 className="text-lg font-semibold text-slate-900">
          Métricas y Señales PLC
        </h1>
        <p className="text-xs text-slate-500">
          Datos provenientes de DynamoDB.
        </p>
      </section>

      <KpiCards
        data={data}
        onShowAlertStopDetail={({
          alertEvents,
          stopEvents,
          hasAlerts,
          hasStops,
        }) => {
          setAlertEvents(alertEvents || []);
          setStopEvents(stopEvents || []);
          // pestaña por defecto: si hay alertas, alertas; si no, paros
          if (hasAlerts) setDefaultTab("alert");
          else if (hasStops) setDefaultTab("stop");
          setModalOpen(true);
        }}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TimeSeriesChart data={data} selectedIds={selectedSignals} />
        </div>
        <div className="space-y-4">
          <SignalSelector
            selectedIds={selectedSignals}
            onChange={setSelectedSignals}
          />
        </div>
      </div>

      <SignalSummaryChart data={data} />

      {modalOpen && (
        <AlertStopModal
          alertEvents={alertEvents}
          stopEvents={stopEvents}
          defaultTab={defaultTab}
          onClose={() => setModalOpen(false)}
        />
      )}
    </main>
  );
}
