import { useState, useEffect, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { Bus, Route, PlusCircle } from "lucide-react";

export default function BusesPage() {
  const { user } = useContext(AuthContext);

  const [busNumber, setBusNumber] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);

  // FETCH BUSES
  const fetchBuses = async () => {
    const res = await api.get("/buses", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    setBuses(res.data);
  };

  // FETCH ROUTES
  const fetchRoutes = async () => {
    const res = await api.get("/routes", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    setRoutes(res.data);
  };

  useEffect(() => {
    fetchBuses();
    fetchRoutes();
  }, []);

  // ADD BUS
  const addBus = async () => {
    if (!busNumber || !selectedRoute) {
      alert("Please fill all fields");
      return;
    }

    await api.post(
      "/buses",
      {
        bus_number: busNumber,
        route_id: selectedRoute,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    setBusNumber("");
    setSelectedRoute("");
    fetchBuses();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Buses Management
        </h1>
        <p className="text-slate-500">
          Add and view buses in the system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ADD BUS CARD */}
        <div className="bg-white rounded-xl shadow-sm p-6">

          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PlusCircle size={20} />
            Add New Bus
          </h2>

          {/* BUS NUMBER */}
          <div className="mb-4">
            <label className="text-sm text-slate-600">
              Bus Number
            </label>
            <input
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="KL-01-1234"
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}
            />
          </div>

          {/* ROUTE SELECT */}
          <div className="mb-6">
            <label className="text-sm text-slate-600">
              Assign Route
            </label>
            <div className="relative mt-1">
              <Route className="absolute left-3 top-3 text-slate-400" size={18} />
              <select
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
              >
                <option value="">Select Route</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.route_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={addBus}
            className="
              w-full flex items-center justify-center gap-2
              bg-blue-600 text-white py-2 rounded-lg
              hover:bg-blue-700 transition
            "
          >
            <Bus size={18} />
            Add Bus
          </button>

        </div>

        {/* BUS LIST */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">

          <h2 className="text-lg font-semibold mb-4">
            Existing Buses
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse">

              <thead>
                <tr className="border-b text-slate-500 text-sm">
                  <th className="py-2">Bus Number</th>
                  <th className="py-2">Route ID</th>
                </tr>
              </thead>

              <tbody>
                {buses.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="py-2 font-medium">
                      {b.bus_number}
                    </td>
                    <td className="py-2">
                      {b.route_id}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

            {buses.length === 0 && (
              <p className="text-center text-slate-500 py-6">
                No buses found
              </p>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
