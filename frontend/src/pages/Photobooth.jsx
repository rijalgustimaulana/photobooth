import { useState } from "react";
import CameraCapture from "../components/CameraCapture";
import PhotoboothResult from "../components/PhotoboothResult";

export default function Photobooth() {
  const sessionId = localStorage.getItem("session_id");
  const [completed, setCompleted] = useState(false);

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>⚠️ Session tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white flex justify-center items-center">
      <div className="w-full max-w-4xl text-center">
        <h1
          className="text-4xl font-extrabold text-green-500 mb-6"
          style={{ textShadow: "-3px 3px 0 #00AEEF" }}
        >
          🎞️ Photobooth Session
        </h1>

        {!completed ? (
          <CameraCapture
            sessionId={sessionId}
            onCompleted={() => setCompleted(true)}
          />
        ) : (
          <PhotoboothResult />
        )}
      </div>
    </div>
  );
}
