import { useContext, useEffect, useState } from "react";
import api from "../../api/api";
import { io } from "socket.io-client";
import { AuthContext } from "../../context/AuthContext";

const socket = io("http://localhost:5000");

export default function DriverTrip() {

  const { user } = useContext(AuthContext);

  const [busId, setBusId] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);

  // Fetch assigned bus
  useEffect(() => {
    const fetchBus = async () => {
      try {
        const driverRes = await api.get("/drivers/me", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const busRes = await api.get("/buses", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const assigned = busRes.data.find(
          (b) => b.driver_id === driverRes.data.id
        );

        if (assigned) setBusId(assigned.id);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBus();
  }, [user]);

  // Start Trip
  const startTrip = () => {
    if (!busId) return alert("No bus assigned");

    const id = navigator.geolocation.watchPosition(
      async (pos) => {
        const data = {
          bus_id: busId,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          speed: pos.coords.speed || 40,
        };

        socket.emit("sendLocation", data);

        await api.post("/location", data, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      },
      () => alert("Location permission denied")
    );

    setWatchId(id);
    setTracking(true);
  };

  // Stop Trip
  const stopTrip = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setTracking(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto px-4">

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">

        {/* Header */}
        <h2 className="text-base font-semibold text-slate-800 mb-1">
          🚍 Assigned Bus
        </h2>

        <p className="text-xs text-slate-500 mb-4">
          {busId || "Not Assigned"}
        </p>

        {/* Status */}
        <div className="flex items-center gap-2 mb-4">

          <span
            className={`w-2 h-2 rounded-full ${
              tracking ? "bg-green-500" : "bg-red-400"
            }`}
          />

          <span className="text-sm text-slate-700">
            {tracking ? "Live tracking ON" : "Idle"}
          </span>

        </div>

        {/* Action Button */}
        {!tracking ? (
          <button
            onClick={startTrip}
            className="w-full bg-green-600 text-white py-2 rounded-lg"
          >
            Start Trip
          </button>
        ) : (
          <button
            onClick={stopTrip}
            className="w-full bg-red-600 text-white py-2 rounded-lg"
          >
            Stop Trip
          </button>
        )}

      </div>

    </section>
  );
}
