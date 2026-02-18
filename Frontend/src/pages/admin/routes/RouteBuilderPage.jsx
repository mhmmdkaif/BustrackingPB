import { useCallback, useEffect, useMemo, useState, useContext } from "react";
import api from "../../../api/api";
import { AuthContext } from "../../../context/AuthContext";

import RouteList from "./RouteList";
import RouteForm from "./RouteForm";

export default function RouteBuilderPage() {

  const { user } = useContext(AuthContext);

  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [routesError, setRoutesError] = useState("");

  /* ================= FETCH ROUTES ================= */

  const authHeaders = useMemo(() => {
    const token = user?.token;
    return token ? { Authorization: `Bearer ${token}` } : null;
  }, [user?.token]);

  const fetchRoutes = useCallback(async () => {
    if (!authHeaders) return;
    try {
      setRoutesError("");
      setLoadingRoutes(true);
      const res = await api.get("/routes", { headers: authHeaders });
      setRoutes(res.data);
    } catch (err) {
      console.error("Failed to fetch routes", err);
      setRoutesError(
        err?.response?.data?.message || "Failed to load routes. Try again."
      );
    } finally {
      setLoadingRoutes(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    if (authHeaders) fetchRoutes();
  }, [authHeaders, fetchRoutes]);

  /* ================= SELECT ROUTE ================= */

  const handleSelectRoute = useCallback((route) => {
    setSelectedRoute(route);
  }, []);

  /* ================= UI ================= */

  return (
    <div className="flex flex-col h-screen bg-slate-100">

      {/* TOP BAR */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">
              Route Builder
            </h1>
            <p className="text-sm text-slate-500">
              Define bus corridors by arranging ordered stops for each route.
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              Total routes: <span className="font-semibold">{routes.length}</span>
            </div>
            {selectedRoute && (
              <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                Editing: <span className="font-semibold">{selectedRoute.route_name}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 max-w-6xl mx-auto w-full px-6 py-4 gap-4 overflow-hidden">

        {/* LEFT PANEL */}
        <RouteList
          routes={routes}
          selectedRoute={selectedRoute}
          onSelect={handleSelectRoute}
          loading={loadingRoutes}
          error={routesError}
          onRefresh={fetchRoutes}
        />

        {/* RIGHT PANEL */}
        <RouteForm
          selectedRoute={selectedRoute}
        />

      </div>
    </div>
  );
}
