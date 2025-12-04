// src/hooks/useMetricsData.js
import { useCallback, useEffect, useState } from "react";
import { fetchMetrics } from "../lib/api";
import { useAuth } from "../context/AuthContext";

// helper: pasar true/false a 1/0
function boolToNumber(v) {
  if (v === true) return 1;
  if (v === false) return 0;
  return Number(v) || 0;
}

export function useMetricsData() {
  const { token } = useAuth(); // leemos el token del contexto
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("No autenticado");
      setData([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // le pasamos el token a fetchMetrics
      const items = await fetchMetrics(token); // siempre array

      const normalized = items.map((item, index) => ({
        id: item.id ?? index,
        timestamp: item.timestamp ?? item.timestamp_bridge ?? null,
        topic: item.topic ?? "N/A",

        // si ya quitaste estas señales de Dynamo, puedes borrarlas aquí también
        ev_extender_piston: boolToNumber(item.ev_extender_piston),
        ev_retraer_piston: boolToNumber(item.ev_retraer_piston),
        senal_a_plc1200: boolToNumber(item.senal_a_plc1200),

        inicio_plc1200: boolToNumber(item.inicio_plc1200),
        inicio_plc1500: boolToNumber(item.inicio_plc1500),

        sensor_capacitivo_1200: boolToNumber(item.sensor_capacitivo_1200),
        sensor_capacitivo_1500: boolToNumber(item.sensor_capacitivo_1500),
        sensor_carrera_1200: boolToNumber(item.sensor_carrera_1200),
        sensor_carrera_1500: boolToNumber(item.sensor_carrera_1500),
      }));

      setData(normalized);
    } catch (err) {
      console.error("Error en useMetricsData:", err);
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // cargar al inicio y cuando cambie el token
  useEffect(() => {
    load();
  }, [load]);

  // devolvemos también reload por si quieres usarlo en otra parte
  return { data, loading, error, reload: load };
}