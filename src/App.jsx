// src/App.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar.jsx";
import Topbar from "./components/layout/Topbar.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar a la izquierda */}
      <Sidebar />

      {/* Columna principal */}
      <div className="flex-1 flex flex-col">
        {/* Barra superior */}
        <Topbar />

        {/* Contenido de cada página (Dashboard, About, Settings) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}