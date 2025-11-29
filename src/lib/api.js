// src/lib/api.js
export async function fetchMetrics() {
  const baseUrl = import.meta.env.VITE_API_URL;

  if (!baseUrl) {
    throw new Error("VITE_API_URL no está definida en el .env");
  }

  const res = await fetch(baseUrl, { method: "GET" });

  if (!res.ok) {
    throw new Error(`Error al cargar datos: ${res.status}`);
  }

  // La API Gateway + Lambda ya regresan un JSON válido (un arreglo)
  const data = await res.json();

  // Opcional: si quieres ver algo pero sin ensuciar:
  // console.log("API json:", data);

  return Array.isArray(data) ? data : [];
}