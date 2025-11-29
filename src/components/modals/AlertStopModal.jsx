// src/components/modals/AlertStopModal.jsx
import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function formatDateTime(ts) {
  if (!ts) return "Sin timestamp";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return String(ts);
  const fecha = d.toLocaleDateString("es-MX", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
  const hora = d.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${fecha} · ${hora}`;
}

function buildChartData(events) {
  return (events || []).map((e, idx) => {
    const ts = e.timestamp || e.timestamp_bridge || null;
    const d = ts ? new Date(ts) : null;
    const label = d
      ? d.toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : `#${idx + 1}`;
    return {
      id: idx,
      timestamp: ts,
      timeLabel: label,
      value: 1,
      plc: e.plc || "", // "1200" / "1500" (por si queremos usarlo luego)
    };
  });
}

export default function AlertStopModal({
  alertEvents,
  stopEvents,
  defaultTab = "alert",
  onClose,
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const hasAlerts = (alertEvents || []).length > 0;
  const hasStops = (stopEvents || []).length > 0;

  const activeEvents =
    activeTab === "alert" ? alertEvents || [] : stopEvents || [];

  const chartData = useMemo(
    () => buildChartData(activeEvents),
    [activeEvents]
  );

  const latest = useMemo(
    () => [...activeEvents].slice(-10).reverse(),
    [activeEvents]
  );

  const isAlertTab = activeTab === "alert";
  const title =
    activeTab === "alert"
      ? "Alertas de proceso"
      : "Paros provocados del proceso";
  const color = isAlertTab ? "#b91c1c" : "#b45309";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Alertas y paros del proceso
            </h2>
            <p className="text-[11px] text-slate-500">
              Detalle de eventos calculados a partir de los botones de
              inicio y los sensores de carrera/capacitivo.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-slate-100 text-slate-500"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 pt-3 flex gap-2 border-b">
          <button
            type="button"
            disabled={!hasAlerts}
            onClick={() => setActiveTab("alert")}
            className={`px-3 py-1.5 text-xs rounded-full border transition ${
              activeTab === "alert"
                ? "bg-red-50 border-red-300 text-red-800"
                : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
            } ${!hasAlerts ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Alertas ({alertEvents?.length || 0})
          </button>
          <button
            type="button"
            disabled={!hasStops}
            onClick={() => setActiveTab("stop")}
            className={`px-3 py-1.5 text-xs rounded-full border transition ${
              activeTab === "stop"
                ? "bg-amber-50 border-amber-300 text-amber-800"
                : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
            } ${!hasStops ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Paros ({stopEvents?.length || 0})
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-auto px-5 py-4 space-y-4">
          {/* Subtítulo de la pestaña activa */}
          <div>
            <h3 className="text-xs font-semibold text-slate-800">
              {title}
            </h3>
            <p className="text-[11px] text-slate-500">
              {isAlertTab
                ? "Se detectan cuando el botón de inicio del PLC está en 1 y los sensores de carrera y capacitivo no cambian entre registros."
                : "Se detectan cuando el botón de inicio está en 0 y los sensores de carrera/capacitivo permanecen estáticos (paro intencional del proceso)."}
            </p>
          </div>

          {/* Gráfica */}
          <div className="h-60 rounded-xl border bg-slate-50/60 p-3">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No hay eventos para esta pestaña.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    opacity={0.2}
                  />
                  <XAxis
                    dataKey="timeLabel"
                    tick={{ fontSize: 10 }}
                    angle={0}
                    textAnchor="middle"
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    domain={[0, 1]}
                    ticks={[0, 1]}
                  />
                  <Tooltip
                    formatter={() => ["Evento", ""]}
                    labelFormatter={(value, payload) => {
                      const item = payload?.[0]?.payload;
                      const plcTag = item?.plc
                        ? ` · PLC${item.plc}`
                        : "";
                      return item?.timestamp
                        ? `${formatDateTime(
                            item.timestamp
                          )}${plcTag}`
                        : value;
                    }}
                  />
                  <Bar dataKey="value" fill={color} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Lista de últimos eventos */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-700">
              Últimos eventos ({latest.length})
            </h3>
            {latest.length === 0 ? (
              <p className="text-xs text-slate-500">
                No hay eventos registrados para este tipo.
              </p>
            ) : (
              <ul className="space-y-1 text-xs text-slate-700">
                {latest.map((e, idx) => (
                  <li
                    key={`${e.timestamp ?? "no-ts"}-${idx}`}
                    className="flex items-start justify-between rounded-lg border bg-white px-3 py-2"
                  >
                    <div>
                      <p className="font-medium">
                        {isAlertTab ? "Alerta" : "Paro"} #
                        {latest.length - idx} · PLC
                        {e.plc || "?"}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {formatDateTime(e.timestamp)}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      idx: {e.index}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-slate-50 hover:bg-slate-800"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}