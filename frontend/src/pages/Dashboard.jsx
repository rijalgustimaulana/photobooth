import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Dashboard() {
  const nav = useNavigate();
  const [strips, setStrips] = useState([]);
  const [loading, setLoading] = useState(true);

  async function handleLogout() {
    await api.post("/logout", {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    localStorage.clear();
    nav("/");
  }

  async function handleStartPhotobooth() {
    const res = await api.post("/sessions", {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    localStorage.setItem("session_id", res.data.session_id);
    nav("/photobooth");
  }

  async function fetchMyStrips() {
    try {
      const res = await api.get("/my-photobooth-strips", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setStrips(res.data);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteStrip(sessionId) {
    if (!confirm("Hapus photobooth ini?")) return;

    await api.delete(`/photobooth-sessions/${sessionId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    setStrips(prev => prev.filter(s => s.session_id !== sessionId));
  }

  useEffect(() => {
    fetchMyStrips();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white flex justify-center items-center relative">
      <div className="absolute top-6 right-6">
        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-full bg-red-400 text-white font-bold shadow-lg hover:scale-105 transition"
        >
          Logout
        </button>
      </div>

      <div className="px-12 py-10 rounded-[3rem] bg-gradient-to-r from-pink-300 to-pink-200 border-[6px] border-green-400 shadow-2xl max-w-4xl w-full text-center">
        <h1
          className="text-5xl font-extrabold text-green-500 mb-2"
          style={{ textShadow: "-4px 4px 0 #00AEEF" }}
        >
          My Photobooth
        </h1>

        <p className="mb-8 text-gray-700 italic">
          Koleksi fotomu ✨ (maks. 3 strip)
        </p>

        {loading && <p>⏳ Memuat hasil...</p>}

        {!loading && strips.length === 0 && (
          <p className="text-gray-600">Belum ada hasil photobooth</p>
        )}

        <div className="flex justify-center gap-6 flex-wrap">
          {strips.map(item => (
            <div key={item.session_id} className="bg-white rounded-2xl p-4 shadow-xl">
              <img
                src={item.strip_url}
                alt="strip"
                className="w-48 rounded-xl mb-3"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => nav(`/result?session=${item.session_id}`)}
                  className="flex-1 bg-blue-400 text-white rounded-full py-1 font-bold hover:scale-105"
                >
                  Lihat
                </button>

                <button
                  onClick={() => handleDeleteStrip(item.session_id)}
                  className="flex-1 bg-red-400 text-white rounded-full py-1 font-bold hover:scale-105"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleStartPhotobooth}
          className="mt-10 px-10 py-3 rounded-full bg-yellow-300 text-white font-extrabold text-lg shadow-xl hover:scale-105"
          style={{ textShadow: "2px 2px 0 #0077cc" }}
        >
          📸 Take Photobooth
        </button>
      </div>
    </div>
  );
}
