import { calculateAngle, areLandmarksVisible, smoothValue } from "./exerciseUtils";

// State
let stage = "down"; // down, up
let smoothedAngle = null;
let feedbackCooldown = 0;

export function analyzeFrontRaise(landmarks) {
  if (!landmarks) return null;

  const leftVisible = areLandmarksVisible(landmarks, [11, 23, 15], 0.7);
  const rightVisible = areLandmarksVisible(landmarks, [12, 24, 16], 0.7);

  if (!leftVisible && !rightVisible) {
    return { feedbackText: "Show your full upper body", feedbackState: "bad" };
  }

  // Use the more visible arm
  let hip, shoulder, wrist;
  if (rightVisible && (!leftVisible || landmarks[16].visibility > landmarks[15].visibility)) {
    hip = landmarks[24]; shoulder = landmarks[12]; wrist = landmarks[16];
  } else {
    hip = landmarks[23]; shoulder = landmarks[11]; wrist = landmarks[15];
  }

  // 1. Smoothing
  // Angle between Hip -> Shoulder -> Wrist
  const rawAngle = calculateAngle(hip, shoulder, wrist);
  smoothedAngle = smoothValue(rawAngle, smoothedAngle, 0.2);

  const now = Date.now();
  let repIncrement = false;
  let formScore = 100;
  let feedbackText = "";
  let feedbackState = "idle";
  let danger = 0;

  // 2. Strict Form: Height check
  // Front raise should stop around 90-100 degrees
  if (smoothedAngle > 110) {
    formScore -= 20;
    danger = 30;
    if (now > feedbackCooldown) {
      feedbackText = "Don't lift above shoulder level!";
      feedbackState = "bad";
      feedbackCooldown = now + 2000;
    }
  }

  // 3. State Machine
  // DOWN (angle < 30) -> UP (angle > 80)
  if (smoothedAngle < 30) {
    if (stage === "up") {
      repIncrement = true;
      feedbackText = "Good control";
      feedbackState = "good";
    }
    stage = "down";
  }

  if (smoothedAngle > 80 && stage === "down") {
    stage = "up";
  }

  return {
    repIncrement,
    formScore: Math.max(0, formScore),
    danger,
    feedbackText: feedbackText || (stage === "up" ? "Hold it" : ""),
    feedbackState,
    injuryFlags: { tooHigh: smoothedAngle > 110 },
  };
}

export function resetFrontRaise() {
  stage = "down";
  smoothedAngle = null;
}
