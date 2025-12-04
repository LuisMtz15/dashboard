// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import { loginRequest } from "../lib/authApi";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITEKEY;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cfToken, setCfToken] = useState(""); // token de Turnstile
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 👁️ estado para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);

  // sólo mostramos el captcha cuando hay usuario y contraseña
  const shouldShowCaptcha = Boolean(
    SITE_KEY && username.trim() && password.trim()
  );

  // ⬇️ YA NO borramos el token aquí
  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      if (!SITE_KEY) {
        throw new Error(
          "Falta configurar VITE_TURNSTILE_SITEKEY en el .env"
        );
      }

      if (!cfToken) {
        throw new Error(
          "No se pudo obtener la verificación de Cloudflare. " +
            "Si ves la palomita verde pero sale este mensaje, puede que tu navegador o un bloqueador esté " +
            "interfiriendo con el captcha. Prueba desactivar el bloqueo para este sitio o usar otro navegador."
        );
      }

      const result = await loginRequest(
        username,
        password,
        cfToken // mandamos el token del captcha
      );

      login({ token: result.token, user: result.user });
      navigate("/"); // al dashboard
    } catch (err) {
      setErrorMsg(err.message || "Error al iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-white">
            POLONIA
          </h1>
          <p className="text-xs text-slate-400 mt-1">Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Usuario */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Usuario
            </label>
            <input
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={username}
              onChange={handleUsernameChange}
              autoComplete="username"
              required
            />
          </div>

          {/* Contraseña con ojito */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 pr-10 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={password}
                onChange={handlePasswordChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Turnstile */}
          {SITE_KEY ? (
            shouldShowCaptcha ? (
              <div className="flex justify-center">
                <Turnstile
                  siteKey={SITE_KEY}
                  onSuccess={(token) => {
                    // ✅ guardamos token cuando Cloudflare diga "ok"
                    setCfToken(token);
                  }}
                  onExpire={() => {
                    // ⏰ si expira, ahora sí lo limpiamos
                    setCfToken("");
                  }}
                  onError={() => {
                    // ❌ si hay error, limpiamos también
                    setCfToken("");
                  }}
                  options={{
                    theme: "dark",
                  }}
                />
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">
                Escribe tu usuario y contraseña para mostrar la verificación
                de seguridad.
              </p>
            )
          ) : (
            <p className="text-xs text-amber-400">
              Falta configurar VITE_TURNSTILE_SITEKEY en el .env
            </p>
          )}

          {errorMsg && (
            <p className="text-xs text-red-400 bg-red-900/20 border border-red-700/40 rounded-lg px-2 py-1">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            // puedes volver a poner `|| !cfToken` aquí si quieres
            disabled={submitting}
            className="w-full inline-flex items-center justify-center rounded-lg bg-sky-500 hover:bg-sky-400 disabled:bg-slate-600 text-sm font-medium text-white px-4 py-2.5 transition"
          >
            {submitting ? "Entrando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}