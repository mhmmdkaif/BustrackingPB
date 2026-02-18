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
        password
      });

      const token = res.data.token;

      const payload = JSON.parse(atob(token.split(".")[1]));

      const userData = {
        token,
        role: payload.role,
        id: payload.id
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg w-full max-w-sm"
      >
        <h2 className="text-2xl mb-4">Login</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
