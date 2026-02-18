import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import UserDashboard from "./pages/user/UserDashboard";
import DriverDashboard from "./pages/driver/DriverDashboard";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DriversPage from "./pages/admin/DriversPage";
import AssignBusPage from "./pages/admin/AssignBusPage";
import StopsPage from "./pages/admin/StopsPage";
import BusesPage from "./pages/admin/BusesPage";
import RoutesPage from "./pages/admin/RoutesPage";
import RouteBuilderPage from "./pages/admin/routes/RouteBuilderPage";


import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* DRIVER */}
        <Route
          path="/driver"
          element={
            <ProtectedRoute>
              <DriverDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN LAYOUT */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          <Route index element={<AdminDashboard />} />
          <Route path="drivers" element={<DriversPage />} />
          <Route path="assign-bus" element={<AssignBusPage />} />
          <Route path="stops" element={<StopsPage />} />
          <Route path="buses" element={<BusesPage />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="route-builder" element={<RouteBuilderPage />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
