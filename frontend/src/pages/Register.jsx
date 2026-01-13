import { useState } from "react";
import { api } from "../api";
import { Link, useNavigate } from "react-router-dom";
import bg from "../assets/bg-Login.jpeg";

export default function Register() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    try {
      await api.post("/register", { email, name, password });
      alert("Register berhasil");

      nav("/login");
    } catch (err) {
      console.log("Register Error:", err);
      alert("Register gagal");
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-gray-100 bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Register
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input 
          placeholder="Name"
          className="w-full px-4 py-2 border rounded-lg 
             text-gray-800 placeholder-gray-400 
             focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" 
          onChange={(e) => setName(e.target.value)} />
          <br />

          <input 
          type="email" 
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-lg 
             text-gray-800 placeholder-gray-400 
             focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" 
          onChange={(e) => setEmail(e.target.value)} />
          <br />

          <input 
          type="password" 
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg 
             text-gray-800 placeholder-gray-400 
             focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" 
          onChange={(e) => setPassword(e.target.value)} />
          <br />

          <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >Register</button>
        </form>

          <p className="text-center text-sm text-gray-600 mt-4">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
          </p>
      </div>
    </div>
  );
}
