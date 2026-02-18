export default function BusTrackingPanel({
  bus,
  location,
  onOpenMap,
  onClose
}) {
  if (!bus) return null;

  const isLive = !!location;

  return (
    <section className="max-w-5xl mx-auto px-4 mt-8">
      <div className="bg-white border rounded-lg shadow-sm p-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-blue-900">
            🚌 {bus.bus_number}
          </h2>

          {onClose && (
            <button
              onClick={onClose}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Close
            </button>
          )}
        </div>

        {/* Route */}
        <p className="text-sm text-gray-600 mb-3">
          Route: {bus.route_name || "Not assigned"}
        </p>

        {/* Live status */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`w-2 h-2 rounded-full ${
              isLive ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          <span className="text-sm text-gray-700">
            {isLive ? "Live tracking available" : "Bus not live yet"}
          </span>
        </div>

        {/* Live details */}
        {isLive && (
          <div className="text-sm text-gray-700 space-y-1 mb-4">
            <p>
              <b>Speed:</b> {location.speed || 0} km/h
            </p>

            <p>
              <b>Last updated:</b>{" "}
              {new Date(location.updated_at).toLocaleTimeString()}
            </p>

            {location.eta_minutes !== null && (
              <p>
                <b>ETA:</b> {location.eta_minutes} minutes
              </p>
            )}
          </div>
        )}

        {/* Action */}
        {isLive && (
          <button
            onClick={onOpenMap}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded font-medium"
          >
            Live tracking on map
          </button>
        )}

      </div>
    </section>
  );
}
