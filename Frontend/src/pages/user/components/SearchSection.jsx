import { useState } from "react";

export default function SourceDestinationSearch({ stops, onSearch }) {
  const [sourceInput, setSourceInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");

  const [sourceStop, setSourceStop] = useState(null);
  const [destinationStop, setDestinationStop] = useState(null);

  const filterStops = (value) => {
    if (!value) return [];
    return stops.filter((stop) =>
      stop.stop_name.toLowerCase().includes(value.toLowerCase())
    );
  };

  const handleSearch = () => {
    if (!sourceStop || !destinationStop) {
      alert("Please select both source and destination");
      return;
    }

    if (sourceStop.id === destinationStop.id) {
      alert("Source and destination cannot be same");
      return;
    }

    onSearch({
      source: sourceStop.id,
      destination: destinationStop.id
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h2 className="text-lg font-semibold text-blue-900 mb-4">
        Where is my bus?
      </h2>

      {/* SOURCE */}
      <div className="mb-4 relative">
        <label className="block text-sm text-gray-600 mb-1">
          Source
        </label>

        <input
          type="text"
          value={sourceInput}
          onChange={(e) => {
            setSourceInput(e.target.value);
            setSourceStop(null);
          }}
          placeholder="Type source stop"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {sourceInput && !sourceStop && (
          <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
            {filterStops(sourceInput).map((stop) => (
              <li
                key={stop.id}
                onClick={() => {
                  setSourceStop(stop);
                  setSourceInput(stop.stop_name);
                }}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
              >
                {stop.stop_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* DESTINATION */}
      <div className="mb-6 relative">
        <label className="block text-sm text-gray-600 mb-1">
          Destination
        </label>

        <input
          type="text"
          value={destinationInput}
          onChange={(e) => {
            setDestinationInput(e.target.value);
            setDestinationStop(null);
          }}
          placeholder="Type destination stop"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {destinationInput && !destinationStop && (
          <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
            {filterStops(destinationInput).map((stop) => (
              <li
                key={stop.id}
                onClick={() => {
                  setDestinationStop(stop);
                  setDestinationInput(stop.stop_name);
                }}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
              >
                {stop.stop_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* SEARCH BUTTON */}
      <button
        onClick={handleSearch}
        className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded font-medium"
      >
        Search Buses
      </button>
    </div>
  );
}
