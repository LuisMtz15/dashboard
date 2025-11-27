// src/hooks/useMetricsData.js
import { useEffect, useState } from "react";
import { fetchMetrics } from "../lib/api";

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

        const items = await fetchMetrics();

        if (!cancelled) {
          console.log("📊 Datos crudos de items:", items);

          const normalized = items.map((item, index) => ({
            id: item.id ?? item.Id ?? item.ID ?? index,
            timestamp: item.timestamp ?? item.Timestamp ?? item.createdAt ?? item.date,
            metric1: Number(item.metric1 ?? item.value1 ?? item.iy3 ?? 0),
            metric2: Number(item.metric2 ?? item.value2 ?? item.y1 ?? 0),
            status: item.status ?? item.State ?? item.tag_e ?? "N/A",
          }));

          console.log("📈 Datos normalizados:", normalized);

          setData(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("❌ Error en useMetricsData:", err);
          setError(err.message || "Error desconocido");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}