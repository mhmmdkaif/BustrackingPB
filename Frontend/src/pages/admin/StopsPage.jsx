import { useState, useEffect, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { MapPin, PlusCircle, Navigation } from "lucide-react";

export default function StopsPage() {
  const { user } = useContext(AuthContext);

  const [stopName, setStopName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [stops, setStops] = useState([]);

  // FETCH STOPS
  const fetchStops = async () => {
    const res = await api.get("/stops", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    setStops(res.data);
  };

  useEffect(() => {
    fetchStops();
  }, []);

  // ADD STOP
  const addStop = async () => {
    if (!stopName || !lat || !lng) {
      alert("Please fill all fields");
      return;
    }

    await api.post(
      "/stops",
      {
        stop_name: stopName,
        latitude: lat,
        longitude: lng,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    setStopName("");
    setLat("");
    setLng("");
    fetchStops();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Stops Management
        </h1>
        <p className="text-slate-500">
          Add and view bus stops
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ADD STOP */}
        <div className="bg-white rounded-xl shadow-sm p-6">

          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PlusCircle size={20} />
            Add New Stop
          </h2>

          {/* STOP NAME */}
          <div className="mb-4">
            <label className="text-sm text-slate-600">
              Stop Name
            </label>
            <input
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Main Bus Stand"
              value={stopName}
              onChange={(e) => setStopName(e.target.value)}
            />
          </div>

          {/* LATITUDE */}
          <div className="mb-4">
            <label className="text-sm text-slate-600">
              Latitude
            </label>
            <div className="relative mt-1">
              <Navigation className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="12.9716"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
            </div>
          </div>

          {/* LONGITUDE */}
          <div className="mb-6">
            <label className="text-sm text-slate-600">
              Longitude
            </label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="77.5946"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={addStop}
            className="
              w-full flex items-center justify-center gap-2
              bg-blue-600 text-white py-2 rounded-lg
              hover:bg-blue-700 transition
            "
          >
            <MapPin size={18} />
            Add Stop
          </button>

        </div>

        {/* STOPS LIST */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">

          <h2 className="text-lg font-semibold mb-4">
            Existing Stops
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse">

              <thead>
                <tr className="border-b text-slate-500 text-sm">
                  <th className="py-2">Stop Name</th>
                </tr>
              </thead>

              <tbody>
                {stops.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="py-2 font-medium">
                      {s.stop_name}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

            {stops.length === 0 && (
              <p className="text-center text-slate-500 py-6">
                No stops found
              </p>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
