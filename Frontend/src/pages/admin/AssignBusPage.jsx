import { useEffect, useState, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { User, Bus, CheckCircle } from "lucide-react";

export default function AssignBusPage() {
  const { user } = useContext(AuthContext);

  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);

  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedBus, setSelectedBus] = useState("");

  // fetch drivers
  const fetchDrivers = async () => {
    try {
      const res = await api.get("/admin/drivers", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setDrivers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // fetch buses
  const fetchBuses = async () => {
    try {
      const res = await api.get("/buses", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setBuses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchBuses();
  }, []);

  // assign bus
  const assignBus = async () => {
    if (!selectedDriver || !selectedBus) {
      alert("Please select both driver and bus");
      return;
    }

    try {
      await api.post(
        "/drivers/assign",
        {
          driver_id: selectedDriver,
          bus_id: selectedBus,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert("Bus assigned successfully 🚍");
      setSelectedDriver("");
      setSelectedBus("");
    } catch (err) {
      alert("Failed to assign bus");
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex items-center justify-center">

      <div className="bg-white w-full max-w-md rounded-xl shadow-sm p-8 border border-slate-200">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Assign Bus
          </h1>
          <p className="text-slate-500">
            Link a driver with a bus
          </p>
        </div>

        {/* DRIVER SELECT */}
        <div className="mb-4">
          <label className="text-sm font-medium text-slate-600">
            Select Driver
          </label>

          <div className="relative mt-1">
            <User className="absolute left-3 top-3 text-slate-400" size={18} />
            <select
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
            >
              <option value="">Choose driver</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* BUS SELECT */}
        <div className="mb-6">
          <label className="text-sm font-medium text-slate-600">
            Select Bus
          </label>

          <div className="relative mt-1">
            <Bus className="absolute left-3 top-3 text-slate-400" size={18} />
            <select
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedBus}
              onChange={(e) => setSelectedBus(e.target.value)}
            >
              <option value="">Choose bus</option>
              {buses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.bus_number}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={assignBus}
          className="
            w-full flex items-center justify-center gap-2
            bg-blue-600 text-white py-2 rounded-lg
            hover:bg-blue-700 transition
          "
        >
          <CheckCircle size={18} />
          Assign Bus
        </button>

      </div>

    </div>
  );
}
