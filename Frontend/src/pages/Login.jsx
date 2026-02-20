import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      const payload = JSON.parse(atob(token.split(".")[1]));

      const userData = {
        token,
        role: payload.role,
        id: payload.id,
      };

      login(userData);

      if (payload.role === "admin") navigate("/admin");
      else if (payload.role === "driver") navigate("/driver");
      else navigate("/user");

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-gray-200">

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-md
          bg-white
          rounded-2xl
          shadow-lg
          p-8
          animate-fade-in
        "
      >

        {/* App Name */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            BusTrack
          </h1>
          <p className="text-sm text-slate-500">
            Smart Public Transport System
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm text-slate-600 mb-1">
            Email
          </label>
          <input
            className="
              w-full
              rounded-lg
              border border-slate-300
              px-3 py-2
              text-sm
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-7">
          <label className="block text-sm text-slate-600 mb-1">
            Password
          </label>
          <input
            type="password"
            className="
              w-full
              rounded-lg
              border border-slate-300
              px-3 py-2
              text-sm
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            text-white
            py-2.5
            rounded-lg
            font-medium
            transition
            active:scale-95
          "
        >
          Login
        </button>

      </form>

      {/* Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fadeIn 0.5s ease-out;
          }
        `}
      </style>

    </div>
  );
}