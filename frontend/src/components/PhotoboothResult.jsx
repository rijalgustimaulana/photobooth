import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PhotoboothResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session");

  const [stripUrl, setStripUrl] = useState(null);

  useEffect(() => {
    async function fetchStrip() {
      const res = await fetch(
        `http://localhost:8000/api/photobooth-sessions/${sessionId}/strip`
      );
      const data = await res.json();
      setStripUrl(data.strip_url);
    }

    fetchStrip();
  }, [sessionId]);

  const downloadStrip = () => {
    window.location.href =
      `http://localhost:8000/api/photobooth-sessions/${sessionId}/strip/download`;
  };

  if (!stripUrl) return <p>⏳ Menyiapkan hasil photobooth...</p>;

  return (
    <div style={{ textAlign: "center", padding: 24 }}>
      <h2>✨ Hasil Photobooth</h2>

      <img
        src={stripUrl}
        alt="Photo Strip"
        style={{ width: 360, borderRadius: 10, marginBottom: 20 }}
      />

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={downloadStrip} className="btn-blue">
          ⬇️ Download
        </button>

        <button onClick={() => navigate("/dashboard")} className="btn-gray">
          🏠 Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}
