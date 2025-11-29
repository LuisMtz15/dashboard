// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const baseBtn =
    "block px-3 py-2 rounded-lg text-sm transition";
  const active =
    "bg-slate-800/80 text-slate-50";
  const inactive =
    "hover:bg-slate-800 text-slate-300";

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-slate-900 text-slate-100 p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold tracking-tight">Polonia</h1>
        <p className="text-xs text-slate-400">
          Datos del PLC 1200 y 1500
        </p>
      </div>

      <nav className="space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${baseBtn} ${isActive ? active : inactive}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `${baseBtn} ${isActive ? active : inactive}`
          }
        >
          Sobre nosotros
        </NavLink>
      </nav>

      <div className="mt-auto text-xs text-slate-500 space-y-0.5">
        <p>AWS DynamoDB</p>
        <p>CaaS</p>
        <p>CyberSecurity as a Service</p>
        <p>© Todos los derechos reservados</p>
      </div>
    </aside>
  );
}