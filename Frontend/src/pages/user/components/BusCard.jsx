export default function BusCard({ bus, isLive, eta, onTrack }) {
  return (
    <div className="bg-white border rounded-lg p-4 flex items-center justify-between shadow-sm">
      
      {/* Left: Bus info */}
      <div>
        <h3 className="text-base font-semibold text-blue-900">
          🚌 {bus.bus_number}
        </h3>

        <p className="text-sm text-gray-600">
          Route: {bus.route_name || "Not assigned"}
        </p>

        <div className="flex items-center gap-2 mt-1 text-sm">
          <span
            className={`w-2 h-2 rounded-full ${
              isLive ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>

          <span className="text-gray-600">
            {isLive ? "Live" : "Not Live"}
          </span>

          {isLive && eta !== null && (
            <span className="text-gray-500">
              • ETA {eta} min
            </span>
          )}
        </div>
      </div>

      {/* Right: Action */}
      <button
        onClick={() => onTrack(bus)}
        className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded text-sm"
      >
        Track
      </button>
    </div>
  );
}
