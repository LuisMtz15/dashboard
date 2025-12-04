// src/components/layout/Topbar.jsx
import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";

export default function Topbar() {
  const { logout } = useAuth();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white/70 backdrop-blur">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Métricas y Señales PLC
        </h2>
        <p className="text-xs text-slate-500">Datos provenientes de DynamoDB</p>
      </div>

      <div className="flex items-center gap-3">

        {/* Botón ACTUALIZAR */}
        <button
          type="button"
          onClick={handleRefresh}
          className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-full bg-slate-900 text-white hover:bg-slate-800 transition"
        >
          <span className="text-sm">↻</span>
          <span>Actualizar</span>
        </button>

        {/* Botón LOGOUT */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-red-300 text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={14} strokeWidth={2} /> {/* icono profesional */}
          <span>Salir</span>
        </button>
      </div>
    </header>
  );
}
