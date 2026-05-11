import { useEffect, useRef } from "react";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

export default function PoseCanvas({ onPose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // ✅ FIX: keep latest onPose reference
  const onPoseRef = useRef(onPose);

  useEffect(() => {
    onPoseRef.current = onPose;
  }, [onPose]);

  useEffect(() => {
    let camera;
    let pose;
    let cancelled = false;

    const waitForRefs = () =>
      new Promise((resolve) => {
        const check = () => {
          if (videoRef.current && canvasRef.current) resolve();
          else requestAnimationFrame(check);
        };
        check();
      });

    const startPose = async () => {
      await waitForRefs();
      if (cancelled) return;

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
        if (!results.image) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Match exact native video resolution
        canvas.width = results.image.width;
        canvas.height = results.image.height;

        // Clear transparent buffer
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();

        if (results.poseLandmarks) {
          // Pass raw un-mirrored landmark data
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

      camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await pose.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });

      camera.start();
    };

    startPose();

    return () => {
      cancelled = true;
      if (camera) camera.stop();
      if (pose) pose.close();
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
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
          transform: "scaleX(-1)", // Native GPU Mirroring
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
