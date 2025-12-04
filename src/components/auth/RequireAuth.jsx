// src/components/auth/RequireAuth.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RequireAuth() {
  const { token, initialized } = useAuth();
  const location = useLocation();

  // 1) Todavía estamos leyendo del localStorage
  if (!initialized) {
    return (
      <div className="p-4 text-sm text-slate-500">
        Verificando sesión...
      </div>
    );
  }

  // 2) Ya cargó todo y NO hay token -> manda a login
  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // 3) Hay token válido -> deja pasar a las rutas protegidas
  return <Outlet />;
}