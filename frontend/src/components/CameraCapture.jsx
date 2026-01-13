import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CameraCapture({ sessionId }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const MAX_FRAME = 3;

  const [stream, setStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [countdown, setCountdown] = useState(null);

  // 🔥 STATE STRIP
  const [photos, setPhotos] = useState([]); // { frame, base64 }
  const [frame, setFrame] = useState(1);

  const isComplete = photos.length === MAX_FRAME;

  /* =========================================================
     CAMERA STREAM
  ========================================================= */
  useEffect(() => {
    if (cameraOn && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [cameraOn, stream]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      setCameraOn(true);
    } catch {
      alert("Akses kamera ditolak");
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setStream(null);
    setCameraOn(false);
  };

  /* =========================================================
     CAPTURE FLOW
  ========================================================= */
  const startCountdown = () => {
    let t = 3;
    setCountdown(t);

    const interval = setInterval(() => {
      t--;
      if (t === 0) {
        clearInterval(interval);
        setCountdown(null);
        capture();
      } else {
        setCountdown(t);
      }
    }, 1000);
  };

  const capture = async () => {
    if (isComplete) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    const base64 = canvas.toDataURL("image/jpeg", 0.9);

    // simpan frontend
    setPhotos((p) => [...p, { frame, base64 }]);

    // simpan backend
    await fetch(
      `http://localhost:8000/api/sessions/${sessionId}/photos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          frame,
          image_base64: base64,
        }),
      }
    );

    setFrame((f) => f + 1);
    stopCamera();
  };

  /* =========================================================
     RETAKE PER FRAME
  ========================================================= */
  const retakePhoto = async (frameNumber) => {
    // frontend rollback
    setPhotos((p) => p.filter((x) => x.frame !== frameNumber));
    setFrame(frameNumber);

    // backend rollback (endpoint HARUS ADA)
    await fetch(
      `http://localhost:8000/api/sessions/${sessionId}/photos/${frameNumber}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  };

  /* =========================================================
     FINAL ACTION
  ========================================================= */
  const finishSession = () => {
    navigate(`/result?session=${sessionId}`);
  };

  const resetSession = () => {
    setPhotos([]);
    setFrame(1);
  };

  /* =========================================================
     RENDER
  ========================================================= */
  return (
    <div className="flex flex-col items-center gap-4">
      <p>
        Frame: {photos.length}/{MAX_FRAME}
      </p>

      {/* VIDEO */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={cameraOn ? "block rounded-xl shadow" : "hidden"}
      />

      {/* COUNTDOWN */}
      {countdown && (
        <div className="text-6xl font-bold animate-pulse">
          {countdown}
        </div>
      )}

      {/* CAMERA CONTROL */}
      {!cameraOn && !isComplete && (
        <button onClick={startCamera} className="btn-green">
          Turn On Camera
        </button>
      )}

      {cameraOn && (
        <>
          <button onClick={startCountdown} className="btn-black">
            Take Photo (Frame {frame})
          </button>

          <button onClick={stopCamera} className="btn-gray">
            Turn Off Camera
          </button>
        </>
      )}

      {/* STRIP PREVIEW */}
      <div className="flex gap-4 mt-4">
        {photos.map((p) => (
          <div key={p.frame} className="flex flex-col items-center">
            <img
              src={p.base64}
              alt={`Frame ${p.frame}`}
              className="w-32 rounded-lg shadow"
            />
            <button
              onClick={() => retakePhoto(p.frame)}
              className="text-sm text-red-600"
            >
              Retake Frame {p.frame}
            </button>
          </div>
        ))}
      </div>

      {/* FINAL */}
      {isComplete && (
        <div className="flex gap-3 mt-4">
          <button onClick={finishSession} className="btn-blue">
            🎉 Lihat Hasil
          </button>
          <button onClick={resetSession} className="btn-orange">
            🔁 Retake Session
          </button>
        </div>
      )}

      <canvas ref={canvasRef} hidden />
    </div>
  );
}
