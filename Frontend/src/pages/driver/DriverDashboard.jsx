import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/api";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function DriverDashboard() {
  const { user, logout } = useContext(AuthContext);

  const [busId, setBusId] = useState("");
  const [tracking, setTracking] = useState(false);

  const fetchBus = async () => {
    try {
      // get my driver profile
      const driverRes = await api.get("/drivers/me", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const driverId = driverRes.data.id;

      // get buses
      const busRes = await api.get("/buses", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const assignedBus = busRes.data.find(
        (b) => b.driver_id === driverId
      );

      if (assignedBus) {
        setBusId(assignedBus.id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBus();
  }, []);

  const startTracking = () => {
    if (!busId) {
      alert("No bus assigned");
      return;
    }

    setTracking(true);

    navigator.geolocation.watchPosition(
      async (pos) => {
        const data = {
          bus_id: busId,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          speed: pos.coords.speed || 40,
        };

        socket.emit("sendLocation", data);

        await api.post("/location", data, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
      },
      (err) => {
        alert("Location permission denied");
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">

      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Driver Dashboard</h1>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-4 rounded mb-4">
        <p className="mb-2">
          Assigned Bus ID:
          <span className="font-medium ml-2">
            {busId || "Not Assigned"}
          </span>
        </p>

        <button
          onClick={startTracking}
          disabled={tracking}
          className="bg-blue-600 text-white w-full p-2 rounded disabled:opacity-50"
        >
          {tracking ? "Tracking Started" : "Start Trip"}
        </button>
      </div>

      <div className="bg-white p-4 rounded">
        <p>
          Status:
          <span className="ml-2 font-medium">
            {tracking ? "Sending Live Location" : "Idle"}
          </span>
        </p>
      </div>

    </div>
  );
}
