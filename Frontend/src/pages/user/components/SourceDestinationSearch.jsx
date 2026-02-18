import { useState } from "react";

export default function SourceDestinationSearch({
  stops = [],
  onSearch
}) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const handleSearch = () => {
    if (!source || !destination) {
      alert("Please select both source and destination");
      return;
    }

    if (source === destination) {
      alert("Source and destination cannot be the same");
      return;
    }

    onSearch({ source, destination });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      
      {/* Title */}
      <h2 className="text-lg font-semibold text-blue-900 mb-3">
        Where is my bus?
      </h2>

      {/* Source */}
      <div className="mb-3">
        <label className="block text-sm text-gray-600 mb-1">
          Source
        </label>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select source stop</option>
          {stops.map((stop) => (
            <option key={stop.id} value={stop.stop_name}>
              {stop.stop_name}
            </option>
          ))}
        </select>
      </div>

      {/* Destination */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">
          Destination
        </label>
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select destination stop</option>
          {stops.map((stop) => (
            <option key={stop.id} value={stop.stop_name}>
              {stop.stop_name}
            </option>
          ))}
        </select>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded font-medium transition"
      >
        Search Buses
      </button>

    </div>
  );
}
