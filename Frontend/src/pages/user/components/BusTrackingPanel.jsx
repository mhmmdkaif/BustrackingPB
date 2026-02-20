export default function BusTrackingPanel({
  bus,
  location,
  onOpenMap,
  onClose
}) {
  if (!bus) return null;

  const isLive = !!location;

  return (
    <section className="max-w-xl mx-auto px-4 mt-6">

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-2">

          <h2 className="text-base font-semibold text-slate-800">
            🚌 {bus.bus_number}
          </h2>

          <div className="flex items-center gap-3">

            {isLive && (
              <button
                onClick={onOpenMap}
                className="text-xs text-blue-600 hover:underline"
              >
                View on Map
              </button>
            )}

            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Close
            </button>

          </div>
        </div>

        {/* ROUTE */}
        <p className="text-xs text-slate-500 mb-3">
          {bus.route_name || "Route not assigned"}
        </p>

        {/* LIVE STATUS */}
        <div className="flex items-center gap-2 mb-4">

          <span
            className={`w-2 h-2 rounded-full ${
              isLive ? "bg-green-500" : "bg-red-400"
            }`}
          />

          <span className="text-sm text-slate-700">
            {isLive ? "Live tracking" : "Bus offline"}
          </span>

        </div>

        {/* TIMELINE PLACEHOLDER */}
        {isLive ? (
          <div className="space-y-3 text-sm">

            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>Previous stop</span>
            </div>

            <div className="flex items-center gap-3 ml-1">
              <span>🚌</span>
              <span className="text-blue-600">
                Bus moving towards next stop
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <span>Next stop</span>
            </div>

          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Live tracking not available yet.
          </p>
        )}

        {/* FOOTER */}
        {isLive && location?.eta_minutes !== null && (
          <div className="mt-4 text-sm text-slate-700">
            ETA: {location.eta_minutes} min
          </div>
        )}

      </div>

    </section>
  );
}
