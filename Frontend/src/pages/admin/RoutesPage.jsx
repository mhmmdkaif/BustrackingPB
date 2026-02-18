import { useState, useEffect, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { Map, PlusCircle } from "lucide-react";

export default function RoutesPage() {
  const { user } = useContext(AuthContext);

  // ROUTE FORM
  const [routeName, setRouteName] = useState("");
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");

  // DATA
  const [routes, setRoutes] = useState([]);

  /* ================= FETCH ROUTES ================= */

  const fetchRoutes = async () => {
    const res = await api.get("/routes", {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setRoutes(res.data);
  };

  useEffect(() => {
    if (user?.token) {
      fetchRoutes();
    }
  }, [user?.token]);

  /* ================= ADD ROUTE ================= */

  const addRoute = async () => {
    if (!routeName || !startPoint || !endPoint) {
      alert("Please fill all fields");
      return;
    }

    await api.post(
      "/routes",
      {
        route_name: routeName,
        start_point: startPoint,
        end_point: endPoint,
      },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );

    setRouteName("");
    setStartPoint("");
    setEndPoint("");
    fetchRoutes();
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Routes Management
        </h1>
        <p className="text-slate-500">
          Create and view routes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ADD ROUTE */}
        <div className="bg-white rounded-xl shadow-sm p-6">

          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PlusCircle size={20} />
            Add New Route
          </h2>

          <input
            className="w-full mb-3 border rounded-lg px-3 py-2"
            placeholder="Route Name"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
          />

          <input
            className="w-full mb-3 border rounded-lg px-3 py-2"
            placeholder="Start Point"
            value={startPoint}
            onChange={(e) => setStartPoint(e.target.value)}
          />

          <input
            className="w-full mb-4 border rounded-lg px-3 py-2"
            placeholder="End Point"
            value={endPoint}
            onChange={(e) => setEndPoint(e.target.value)}
          />

          <button
            onClick={addRoute}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            <Map size={18} className="inline mr-1" />
            Add Route
          </button>

        </div>

        {/* ROUTE LIST */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">

          <h2 className="text-lg font-semibold mb-4">
            Existing Routes
          </h2>

          {routes.map((r) => (
            <div
              key={r.id}
              className="border-b py-2 flex justify-between"
            >
              <span className="font-medium">
                {r.route_name}
              </span>

              <span className="text-sm text-slate-500">
                {r.start_point} → {r.end_point}
              </span>
            </div>
          ))}

          {routes.length === 0 && (
            <p className="text-center text-slate-500 py-6">
              No routes found
            </p>
          )}

        </div>

      </div>

    </div>
  );
}
