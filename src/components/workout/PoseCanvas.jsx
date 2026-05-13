import { useEffect, useRef, useState } from "react";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

export default function PoseCanvas({ onPose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const onPoseRef = useRef(onPose);
  const [status, setStatus] = useState("Initializing...");
  const [error, setError] = useState(null);

  useEffect(() => {
    onPoseRef.current = onPose;
  }, [onPose]);

  useEffect(() => {
    let pose;
    let stream;
    let animationFrameId;
    let isStopped = false;

    const startPose = async () => {
      try {
        setStatus("Requesting Camera...");
        
        // 1. Start Camera First (Immediate feedback)
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });

        if (isStopped) return;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Wait for video to be ready
          await new Promise((resolve) => {
            videoRef.current.onloadeddata = () => {
              videoRef.current.play().then(resolve).catch(resolve);
            };
            // Fallback for already loaded or weird browsers
            if (videoRef.current.readyState >= 2) resolve();
          });
          
          setStatus("Camera Active. Loading AI...");
        }

        // 2. Initialize MediaPipe Pose
        pose = new Pose({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5/${file}`,
        });

        pose.setOptions({
          selfieMode: true,
          modelComplexity: 1,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        pose.onResults((results) => {
          if (isStopped || !results.image || !canvasRef.current) return;

          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");

          // Keep canvas size synced with video
          if (canvas.width !== results.image.width || canvas.height !== results.image.height) {
            canvas.width = results.image.width;
            canvas.height = results.image.height;
          }

          ctx.save();
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (results.poseLandmarks) {
            onPoseRef.current?.(results.poseLandmarks);

            drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
              color: "#00FF00",
              lineWidth: 4,
            });

            drawLandmarks(ctx, results.poseLandmarks, {
              color: "#FF0000",
              radius: 4,
            });
          }
          ctx.restore();
        });

        // 3. Start Detection Loop
        console.log("Pose model initialized.");
        setStatus("Ready");
        
        const processFrame = async () => {
          if (isStopped) return;
          
          if (videoRef.current && videoRef.current.readyState >= 2) {
            try {
              await pose.send({ image: videoRef.current });
            } catch (e) {
              console.warn("Pose send error", e);
            }
          }
          animationFrameId = requestAnimationFrame(processFrame);
        };

        processFrame();
        
      } catch (err) {
        console.error("PoseCanvas Error:", err);
        setError(err.message);
        setStatus("Initialization Failed");
      }
    };

    startPose();

    return () => {
      isStopped = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (pose) {
        pose.close();
      }
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {/* Status Overlay */}
      {status !== "Ready" && (
        <div style={{
          position: "absolute",
          zIndex: 10,
          textAlign: "center",
          color: "white",
          background: "rgba(0,0,0,0.6)",
          padding: "20px",
          borderRadius: "12px",
          backdropFilter: "blur(5px)"
        }}>
          <div style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "8px" }}>{status}</div>
          {error && <div style={{ fontSize: "0.8rem", color: "#ff7675" }}>Error: {error}</div>}
          <div style={{ fontSize: "0.8rem", opacity: 0.6, marginTop: "10px" }}>Please ensure camera permissions are granted.</div>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scaleX(-1)",
          zIndex: 1,
          opacity: status === "Ready" || status.includes("AI") ? 1 : 0,
          transition: "opacity 0.5s"
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 2,
          pointerEvents: "none"
        }}
      />
    </div>
  );
}


