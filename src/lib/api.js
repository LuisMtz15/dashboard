// src/lib/api.js

export async function fetchMetrics(token) {
  const baseUrl = import.meta.env.VITE_API_URL;

  if (!baseUrl) {
    throw new Error("VITE_API_URL no está definida en el .env");
  }

  if (!token) {
    throw new Error("No autenticado: falta token");
  }

  const res = await fetch(baseUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // 👈 aquí va el JWT
    },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(
      `Error al cargar datos: ${res.status} ${txt || ""}`.trim()
    );
  }

  const data = await res.json();

  return Array.isArray(data) ? data : [];
}