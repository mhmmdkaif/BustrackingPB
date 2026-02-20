import { useState, useRef, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

import DriverTrip from "./DriverTrip";
import DriverMap from "./DriverMap";
import DriverHistory from "./DriverHistory";

const socket = io("http://localhost:5000");

export default function DriverDashboard() {

  const { user } = useContext(AuthContext);

  const [page, setPage] = useState("trip");
  const [tracking, setTracking] = useState(false);

  const [busInfo, setBusInfo] = useState(null);

  const watchIdRef = useRef(null);
  const busIdRef = useRef(null);

  /* ---------------- FETCH BUS + ROUTE ---------------- */

  useEffect(() => {
    const loadDriverBus = async () => {
      try {
        const driverRes = await api.get("/drivers/me", {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        const busRes = await api.get("/buses", {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        const assigned = busRes.data.find(
          (b) => b.driver_id === driverRes.data.id
        );

        if (assigned) {
          setBusInfo(assigned);
          busIdRef.current = assigned.id;
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadDriverBus();
  }, [user]);

  /* ---------------- START TRIP ---------------- */

  const startTrip = () => {
    if (!busIdRef.current) {
      alert("No bus assigned");
      return;
    }

    if (tracking) return;

    const id = navigator.geolocation.watchPosition(
      async (pos) => {
        const data = {
          bus_id: busIdRef.current,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          speed: pos.coords.speed || 40,
        };

        socket.emit("sendLocation", data);
        await api.post("/location", data);
      },
      () => alert("Location permission denied")
    );

    watchIdRef.current = id;
    setTracking(true);
  };

  /* ---------------- STOP TRIP ---------------- */

  const stopTrip = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setTracking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* BUS INFO CARD */}
      <section className="max-w-xl mx-auto px-4 pt-4">

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 mb-4">

          <h2 className="text-base font-semibold text-slate-800 mb-1">
            🚍 Assigned Bus
          </h2>

          {busInfo ? (
            <>
              <p className="text-sm text-slate-700">
                {busInfo.bus_number}
              </p>

              <p className="text-xs text-slate-500">
                {busInfo.route_name || "Route not assigned"}
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-500">
              No bus assigned
            </p>
          )}

        </div>

      </section>

      {/* TABS */}
      <div className="max-w-xl mx-auto px-4 flex gap-3">

        <Tab label="Trip" active={page==="trip"} onClick={()=>setPage("trip")} />
        <Tab label="Map" active={page==="map"} onClick={()=>setPage("map")} />
        <Tab label="History" active={page==="history"} onClick={()=>setPage("history")} />

      </div>

      <div className="mt-4">

        {page==="trip" && (
          <DriverTrip
            tracking={tracking}
            startTrip={startTrip}
            stopTrip={stopTrip}
          />
        )}

        {page==="map" && <DriverMap />}
        {page==="history" && <DriverHistory />}

      </div>

    </div>
  );
}

/* ---------------- TAB BUTTON ---------------- */

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm border
        ${active
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-slate-600 border-slate-200"
        }`}
    >
      {label}
    </button>
  );
}
