import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PhotoboothResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session");
  const [stripUrl, setStripUrl] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/photobooth-sessions/${sessionId}/strip`)
      .then(res => res.json())
      .then(data => setStripUrl(data.strip_url));
  }, [sessionId]);

  const downloadStrip = () => {
    window.location.href =
      `http://localhost:8000/api/photobooth-sessions/${sessionId}/strip/download`;
  };

  if (!stripUrl)
    return <p className="text-center mt-20">⏳ Menyiapkan hasil...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white flex items-center justify-center">
      <div className="px-12 py-10 rounded-[3rem] bg-gradient-to-r from-pink-300 to-pink-200 border-[6px] border-green-400 shadow-2xl text-center">
        <h2
          className="text-4xl font-extrabold text-green-500 mb-6"
          style={{ textShadow: "-3px 3px 0 #00AEEF" }}
        >
          ✨ Hasil Photobooth
        </h2>

        <img
          src={stripUrl}
          alt="strip"
          className="w-80 rounded-2xl shadow-xl mb-6 mx-auto"
        />

        <div className="flex gap-4 justify-center">
          <button
            onClick={downloadStrip}
            className="px-8 py-3 rounded-full bg-yellow-300 text-white font-extrabold shadow-lg hover:scale-105"
            style={{ textShadow: "2px 2px 0 #0077cc" }}
          >
            ⬇️ Download
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3 rounded-full bg-green-300 text-white font-extrabold shadow-lg hover:scale-105"
          >
            🏠 Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
