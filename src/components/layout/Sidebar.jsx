// src/components/layout/Sidebar.jsx
export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-slate-900 text-slate-100 p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold tracking-tight">Mi Dashboard</h1>
        <p className="text-xs text-slate-400">
          Datos en tiempo casi real ✨
        </p>
      </div>

      <nav className="space-y-2 text-sm">
        <button className="w-full text-left px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition">
          Overview
        </button>
        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 transition">
          Históricos
        </button>
        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 transition">
          Configuración
        </button>
      </nav>

      <div className="mt-auto text-xs text-slate-500">
        <p>AWS DynamoDB</p>
        <p>React · Vite · Tailwind</p>
      </div>
    </aside>
  );
}