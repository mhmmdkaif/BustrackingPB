import { useMemo, useState } from "react";

export default function SearchSection({ stops = [], onSearch }) {

  const [sourceInput, setSourceInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");

  const [sourceStop, setSourceStop] = useState(null);
  const [destinationStop, setDestinationStop] = useState(null);

  /* ---------------- FILTERED LISTS ---------------- */

  const filteredSourceStops = useMemo(() => {
    if (!sourceInput) return [];
    return stops
      .filter(s =>
        s.stop_name.toLowerCase().includes(sourceInput.toLowerCase())
      )
      .slice(0, 20);
  }, [sourceInput, stops]);

  const filteredDestinationStops = useMemo(() => {
    if (!destinationInput) return [];
    return stops
      .filter(s =>
        s.stop_name.toLowerCase().includes(destinationInput.toLowerCase())
      )
      .slice(0, 20);
  }, [destinationInput, stops]);

  /* ---------------- SEARCH ---------------- */

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

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-5">

      <h2 className="text-xl font-semibold text-slate-800 mb-6">
        Where is my bus?
      </h2>

      {/* SOURCE */}
      <div className="mb-5 relative">
        <label className="text-sm text-slate-600 mb-1 block">
          From
        </label>

        <input
          type="text"
          value={sourceInput}
          onChange={(e) => {
            setSourceInput(e.target.value);
            setSourceStop(null);
          }}
          placeholder="Enter source stop"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {sourceInput && !sourceStop && (
          <div className="absolute z-20 mt-1 w-full bg-white rounded-xl border border-slate-200 shadow max-h-56 overflow-y-auto">

            {filteredSourceStops.map(stop => (
              <div
                key={stop.id}
                onClick={() => {
                  setSourceStop(stop);
                  setSourceInput(stop.stop_name);
                }}
                className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-50"
              >
                {stop.stop_name}
              </div>
            ))}

            {filteredSourceStops.length === 0 && (
              <div className="px-4 py-3 text-sm text-slate-400">
                No stops found
              </div>
            )}

          </div>
        )}
      </div>

      {/* DESTINATION */}
      <div className="mb-6 relative">
        <label className="text-sm text-slate-600 mb-1 block">
          To
        </label>

        <input
          type="text"
          value={destinationInput}
          onChange={(e) => {
            setDestinationInput(e.target.value);
            setDestinationStop(null);
          }}
          placeholder="Enter destination stop"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {destinationInput && !destinationStop && (
          <div className="absolute z-20 mt-1 w-full bg-white rounded-xl border border-slate-200 shadow max-h-56 overflow-y-auto">

            {filteredDestinationStops.map(stop => (
              <div
                key={stop.id}
                onClick={() => {
                  setDestinationStop(stop);
                  setDestinationInput(stop.stop_name);
                }}
                className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-50"
              >
                {stop.stop_name}
              </div>
            ))}

            {filteredDestinationStops.length === 0 && (
              <div className="px-4 py-3 text-sm text-slate-400">
                No stops found
              </div>
            )}

          </div>
        )}
      </div>

      {/* SEARCH BUTTON */}
      <button
        onClick={handleSearch}
        className="w-full rounded-xl bg-blue-600 hover:bg-blue-700
        text-white py-3 text-sm font-semibold transition"
      >
        Find Buses
      </button>

    </div>
  );
}
