import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Bus,
  Users,
  Route,
  MapPin,
  LogOut,
  Map,
  Link as LinkIcon,
} from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-slate-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col">

        {/* LOGO */}
        <div className="text-xl font-bold mb-2 text-slate-800">
          🚍 BusTrack Admin
        </div>

        <p className="text-xs text-slate-500 mb-6">
          Control panel for routes, buses, drivers and stops.
        </p>

        {/* NAV */}
        <nav className="space-y-2">
          <NavItem
            to="/admin"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
          />

          <NavItem
            to="/admin/buses"
            icon={<Bus size={18} />}
            label="Buses"
          />

          <NavItem
            to="/admin/drivers"
            icon={<Users size={18} />}
            label="Drivers"
          />

          <NavItem
            to="/admin/routes"
            icon={<Route size={18} />}
            label="Routes"
          />

          <NavItem
            to="/admin/stops"
            icon={<MapPin size={18} />}
            label="Stops"
          />

          <NavItem
            to="/admin/assign-bus"
            icon={<LinkIcon size={18} />}
            label="Assign Bus"
          />

          <NavItem
            to="/admin/route-builder"
            icon={<Map size={18} />}
            label="Route Builder"
          />
        </nav>

        {/* LOGOUT */}
        <div className="mt-8 pt-4 border-t border-slate-100">
          <button className="flex items-center gap-2 text-xs text-red-600 hover:text-red-700">
            <LogOut size={18} />
            Logout
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        <div className="h-full">
          <Outlet />
        </div>
      </main>

    </div>
  );
}

/* NAV ITEM COMPONENT */
function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `
        flex items-center gap-3 px-3 py-2 rounded-lg
        text-slate-700 hover:bg-slate-100
        ${isActive ? "bg-slate-200 font-medium" : ""}
        `
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
