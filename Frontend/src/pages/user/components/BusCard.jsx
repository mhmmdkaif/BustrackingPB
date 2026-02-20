export default function BusCard({ bus, isLive, eta, onTrack }) {
  return (
    <div
      className="bg-white border border-slate-200 rounded-xl p-4
      flex items-center justify-between shadow-sm"
    >

      {/* LEFT */}
      <div className="min-w-0">

        <h3 className="text-sm font-semibold text-slate-800 truncate">
          🚌 {bus.bus_number}
        </h3>

        <p className="text-xs text-slate-500 mt-0.5 truncate">
          {bus.route_name || "Route not assigned"}
        </p>

        <div className="flex items-center gap-2 mt-2 text-xs">

          <span
            className={`w-2 h-2 rounded-full ${
              isLive ? "bg-green-500" : "bg-red-400"
            }`}
          />

          <span className="text-slate-600">
            {isLive ? "Live" : "Offline"}
          </span>

          {isLive && eta !== null && (
            <span className="text-slate-500">
              • {eta} min
            </span>
          )}
        </div>

      </div>

      {/* RIGHT */}
      <button
        onClick={() => onTrack(bus)}
        className="ml-3 shrink-0 rounded-lg bg-blue-600
        hover:bg-blue-700 text-white px-4 py-2 text-xs font-medium"
      >
        Track
      </button>

    </div>
  );
}
