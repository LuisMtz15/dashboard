// src/components/layout/Topbar.jsx
export default function Topbar() {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white/70 backdrop-blur">
      <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Métricas y Señales PLC
          </h2>
        <p className="text-xs text-slate-500">
          Datos provenientes de DynamoDB
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="px-3 py-1.5 text-xs rounded-full border border-slate-300 hover:bg-slate-100">
          Últimos 24h
        </button>
        <button className="px-3 py-1.5 text-xs rounded-full bg-slate-900 text-white hover:bg-slate-800">
          Actualizar
        </button>
      </div>
    </header>
  );
}