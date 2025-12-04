// src/lib/authApi.js

const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;

export async function loginRequest(username, password, turnstileToken) {
  if (!LOGIN_URL) {
    throw new Error("VITE_LOGIN_URL no está definido");
  }

  if (!turnstileToken) {
    throw new Error("Falta el token de verificación humana (Turnstile).");
  }

  const res = await fetch(LOGIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      turnstileToken,
    }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = json.error || json.message || "Error de autenticación";
    throw new Error(msg);
  }

  // { token, expiresIn, user }
  return json;
}