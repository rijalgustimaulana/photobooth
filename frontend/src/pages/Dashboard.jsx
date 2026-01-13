import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Dashboard() {
  const nav = useNavigate();

  async function handleLogout() {
    try {
      await api.post(
        "/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("session_id"); // bersih
      nav("/");
    } catch (err) {
      console.log("Logout error:", err);
      alert("Logout gagal");
    }
  }

  // 🔥 INI KUNCI UTAMA PHOTObooth
  async function handleStartPhotobooth() {
    try {
      const res = await api.post(
        "/sessions",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // simpan session untuk dipakai CameraCapture
      localStorage.setItem("session_id", res.data.session_id);

      nav("/photobooth");
    } catch (err) {
      console.error("Create session error:", err);
      alert("Gagal memulai sesi photobooth");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            background: "#ff4757",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* CONTENT */}
      <h1>📸 My Photobooth</h1>
      <p>Selamat datang, Hunter.</p>

      <p>Belum ada foto? Tenang, kamera menunggumu.</p>

      <button
        onClick={handleStartPhotobooth}
        style={{
          marginTop: "16px",
          padding: "10px 18px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Take Photobooth
      </button>
    </div>
  );
}
