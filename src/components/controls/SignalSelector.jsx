// src/components/controls/SignalSelector.jsx
import { SIGNALS, SIGNAL_ORDER } from "../../config/signals";

export default function SignalSelector({
  selectedIds,
  onChange,
}) {
  const toggleSignal = (id) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((s) => s !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm p-3 md:p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Señales visibles
          </h3>
          <p className="text-xs text-slate-500">
            Activa/desactiva qué señales quieres ver en la gráfica.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-2 max-h-80 overflow-auto pr-1">
        {SIGNAL_ORDER.map((id) => {
          const s = SIGNALS[id];
          if (!s) return null;

          const checked = selectedIds.includes(id);

          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleSignal(id)}
              className={`flex items-start gap-2 rounded-lg border px-2.5 py-2 text-left text-xs transition ${
                checked
                  ? "border-slate-900 bg-slate-900/5"
                  : "border-slate-200 hover:border-slate-400"
              }`}
            >
              <span
                className="mt-0.5 h-3 w-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-slate-900">
                    {s.label}
                  </span>
                  <span className="text-[10px] uppercase tracking-wide text-slate-400">
                    {s.group}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {s.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}