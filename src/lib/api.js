// src/lib/api.js
export async function fetchMetrics() {
  const baseUrl = import.meta.env.VITE_API_URL;

  if (!baseUrl) {
    throw new Error("VITE_API_URL no está definida en el .env");
  }

  const res = await fetch(baseUrl, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`Error al cargar datos: ${res.status}`);
  }

  const json = await res.json();
  console.log("🔍 API raw json:", json);

  // Vamos a intentar encontrar el array de registros
  let items = null;

  // 1) Si ya es un array directamente
  if (Array.isArray(json)) {
    items = json;
  }

  // 2) Si viene como { Items: [...] } (típico de DynamoDB)
  else if (Array.isArray(json.Items)) {
    items = json.Items;
  }

  // 3) Si viene como { body: "[...]" } (string JSON dentro de body)
  else if (json.body) {
    let body = json.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error("No se pudo parsear json.body:", e);
      }
    }

    if (Array.isArray(body)) {
      items = body;
    } else if (Array.isArray(body.Items)) {
      items = body.Items;
    }
  }

  if (!items) {
    throw new Error("No se encontró un array de items en la respuesta de la API");
  }

  console.log("✅ Items detectados:", items);
  return items;
}