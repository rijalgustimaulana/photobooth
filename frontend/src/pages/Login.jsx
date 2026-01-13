import { useState } from "react";
import { api } from "../api";
import { Link, useNavigate } from "react-router-dom";
import bg from "../assets/bg-Login.jpeg";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);

      nav("/dashboard");
    } catch (err) {
      console.log("Login Error:", err);
      alert("Login failed");
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-gray-100 bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg 
             text-gray-800 placeholder-gray-400 
             focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg 
             text-gray-800 placeholder-gray-400 
             focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
