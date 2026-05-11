import { calculateAngle, areLandmarksVisible, smoothValue } from "./exerciseUtils";

// State
let stage = "down"; // down, peak
let smoothedAngle = null;
let lastRepTime = 0;
let feedbackCooldown = 0;

export function analyzeLateralRaise(landmarks) {
  if (!landmarks) return null;

  const leftVisible = areLandmarksVisible(landmarks, [11, 13, 23], 0.7);
  const rightVisible = areLandmarksVisible(landmarks, [12, 14, 24], 0.7);

  if (!leftVisible && !rightVisible) {
    return { feedbackText: "Show your full upper body", feedbackState: "bad" };
  }

  // Use the more visible arm
  let hip, shoulder, elbow;
  if (rightVisible && (!leftVisible || landmarks[14].visibility > landmarks[13].visibility)) {
    hip = landmarks[24]; shoulder = landmarks[12]; elbow = landmarks[14];
  } else {
    hip = landmarks[23]; shoulder = landmarks[11]; elbow = landmarks[13];
  }

  // 1. Smoothing
  // Angle between Hip -> Shoulder -> Elbow
  const rawAngle = calculateAngle(hip, shoulder, elbow);
  smoothedAngle = smoothValue(rawAngle, smoothedAngle, 0.2);

  const now = Date.now();
  let repIncrement = false;
  let formScore = 100;
  let feedbackText = "";
  let feedbackState = "idle";
  let danger = 0;

  // 2. Strict Form: Height check
  // Lateral raise should stop around 90-100 degrees
  if (smoothedAngle > 110) {
    formScore -= 20;
    danger = 30;
    if (now > feedbackCooldown) {
      feedbackText = "Don't go too high!";
      feedbackState = "bad";
      feedbackCooldown = now + 2000;
    }
  }

  // 3. State Machine
  // DOWN (angle < 25) -> UP (angle > 80)
  if (smoothedAngle < 25) {
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

export function resetLateralRaise() {
  stage = "down";
  smoothedAngle = null;
  lastRepTime = 0;
}
