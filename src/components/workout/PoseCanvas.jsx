import { useEffect, useRef } from "react";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

export default function PoseCanvas({ onPose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const onPoseRef = useRef(onPose);

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
        console.log("Initializing Pose Detection...");
        
        // Initialize MediaPipe Pose
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

          canvas.width = results.image.width;
          canvas.height = results.image.height;

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

        // Initialize Camera using standard getUserMedia
        console.log("Requesting Camera Access...");
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Wait for video to be ready before starting the loop
          await new Promise((resolve) => {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current.play();
              resolve();
            };
          });

          console.log("Camera active, starting detection loop.");
          
          const processFrame = async () => {
            if (isStopped) return;
            
            if (videoRef.current && videoRef.current.readyState === 4) {
              await pose.send({ image: videoRef.current });
            }
            animationFrameId = requestAnimationFrame(processFrame);
          };

          processFrame();
        }
      } catch (err) {
        console.error("PoseCanvas Initialization Error:", err);
      }
    };

    startPose();

    return () => {
      console.log("Cleaning up PoseCanvas...");
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
        overflow: "hidden"
      }}
    >
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
          transform: "scaleX(-1)", // Mirror for selfie mode
          zIndex: 1
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

