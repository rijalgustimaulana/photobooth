import { useState } from "react";
import CameraCapture from "../components/CameraCapture";
import PhotoboothResult from "../components/PhotoboothResult";

function Photobooth() {
  const sessionId = localStorage.getItem("session_id");

  // ⬅️ status apakah sesi sudah selesai
  const [completed, setCompleted] = useState(false);

  if (!sessionId) {
    return (
      <div style={{ padding: 24 }}>
        <h2>⚠️ Session tidak ditemukan</h2>
        <p>Silakan mulai sesi photobooth terlebih dahulu.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>🎞️ Photobooth Session</h1>

      {!completed ? (
        <CameraCapture
          sessionId={sessionId}
          onCompleted={() => setCompleted(true)}
        />
      ) : (
        <PhotoboothResult sessionId={sessionId} />
      )}
    </div>
  );
}

export default Photobooth;
