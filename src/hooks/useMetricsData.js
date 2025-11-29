// src/hooks/useMetricsData.js
import { useEffect, useState } from "react";
import { fetchMetrics } from "../lib/api";

// helper: pasar true/false a 1/0
function boolToNumber(v) {
  if (v === true) return 1;
  if (v === false) return 0;
  return Number(v) || 0;
}

export function useMetricsData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const items = await fetchMetrics(); // siempre array

        if (!cancelled) {
          //console.log("📊 Datos crudos de items:", items);

          const normalized = items.map((item, index) => ({
            id: item.id ?? index,
            timestamp: item.timestamp ?? item.timestamp_bridge ?? null,
            topic: item.topic ?? "N/A",

            ev_extender_piston: boolToNumber(item.ev_extender_piston),
            ev_retraer_piston: boolToNumber(item.ev_retraer_piston),

            inicio_plc1200: boolToNumber(item.inicio_plc1200),
            inicio_plc1500: boolToNumber(item.inicio_plc1500),
            senal_a_plc1200: boolToNumber(item.senal_a_plc1200),

            sensor_capacitivo_1200: boolToNumber(item.sensor_capacitivo_1200),
            sensor_capacitivo_1500: boolToNumber(item.sensor_capacitivo_1500),
            sensor_carrera_1200: boolToNumber(item.sensor_carrera_1200),
            sensor_carrera_1500: boolToNumber(item.sensor_carrera_1500),
          }));

          //console.log("📈 Datos normalizados:", normalized);

          setData(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("❌ Error en useMetricsData:", err);
          setError(err.message || "Error desconocido");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}