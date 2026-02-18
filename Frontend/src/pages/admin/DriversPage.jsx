import { useState, useEffect, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { UserPlus, Users, Mail, Lock, CreditCard } from "lucide-react";

export default function DriversPage() {
  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [licenseNumber, setLicenseNumber] = useState(""); // ✅ NEW

  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);

  // FETCH DRIVERS
  const fetchDrivers = async () => {
    const res = await api.get("/admin/drivers", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    setDrivers(res.data);
  };

  // FETCH BUSES
  const fetchBuses = async () => {
    const res = await api.get("/buses");
    setBuses(res.data);
  };

  useEffect(() => {
    if (user?.token) {
      fetchDrivers();
      fetchBuses();
    }
  }, [user?.token]);

  // ADD DRIVER
  const addDriver = async () => {
    if (!name || !email || !password || !licenseNumber) {
      alert("Please fill all fields");
      return;
    }

    await api.post(
      "/auth/register",
      {
        name,
        email,
        password,
        role: "driver",
        license_number: licenseNumber, // ✅ send to backend
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    setName("");
    setEmail("");
    setPassword("");
    setLicenseNumber("");
    fetchDrivers();
  };

  // FIND ASSIGNED BUS
  const getAssignedBus = (driverId) => {
    const bus = buses.find((b) => b.driver_id === driverId);
    return bus ? bus.bus_number : "Not assigned";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Drivers Management
        </h1>
        <p className="text-slate-500">
          Add and manage drivers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ADD DRIVER */}
        <div className="bg-white rounded-xl shadow-sm p-6">

          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <UserPlus size={20} />
            Add New Driver
          </h2>

          {/* NAME */}
          <div className="mb-4">
            <label className="text-sm text-slate-600">Name</label>
            <input
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Driver name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="text-sm text-slate-600">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="driver@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="text-sm text-slate-600">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="password"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* LICENSE NUMBER */}
          <div className="mb-6">
            <label className="text-sm text-slate-600">License Number</label>
            <div className="relative mt-1">
              <CreditCard
                className="absolute left-3 top-3 text-slate-400"
                size={18}
              />
              <input
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="KL14-2023-XXXXXX"
                value={licenseNumber}
                onChange={(e) =>
                  setLicenseNumber(e.target.value.toUpperCase())
                }
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={addDriver}
            className="
              w-full flex items-center justify-center gap-2
              bg-blue-600 text-white py-2 rounded-lg
              hover:bg-blue-700 transition
            "
          >
            <Users size={18} />
            Add Driver
          </button>

        </div>

        {/* DRIVER LIST */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">

          <h2 className="text-lg font-semibold mb-4">
            Existing Drivers
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse">

              <thead>
                <tr className="border-b text-slate-500 text-sm">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">License</th>
                  <th className="py-2">Assigned Bus</th>
                </tr>
              </thead>

              <tbody>
                {drivers.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="py-2 font-medium">{d.name}</td>
                    <td className="py-2">{d.email}</td>
                    <td className="py-2">
                      {d.license_number || "N/A"}
                    </td>
                    <td className="py-2">
                      {getAssignedBus(d.id)}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

            {drivers.length === 0 && (
              <p className="text-center text-slate-500 py-6">
                No drivers found
              </p>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
