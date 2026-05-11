import { calculateAngle, areLandmarksVisible, smoothValue } from "./exerciseUtils";

// State
let stage = "up"; // up, down
let smoothedAngle = null;
let lastRepTime = 0;
let feedbackCooldown = 0;

export function analyzeLunge(landmarks) {
  if (!landmarks) return null;

  const leftVisible = areLandmarksVisible(landmarks, [23, 25, 27], 0.7);
  const rightVisible = areLandmarksVisible(landmarks, [24, 26, 28], 0.7);

  if (!leftVisible && !rightVisible) {
    return { feedbackText: "Show your legs", feedbackState: "bad" };
  }

  // Detect which leg is lunging (the one with the smaller knee angle)
  const leftAngle = leftVisible ? calculateAngle(landmarks[23], landmarks[25], landmarks[27]) : 180;
  const rightAngle = rightVisible ? calculateAngle(landmarks[24], landmarks[26], landmarks[28]) : 180;
  
  const rawAngle = Math.min(leftAngle, rightAngle);
  
  // 1. Smoothing
  smoothedAngle = smoothValue(rawAngle, smoothedAngle, 0.2);

  const now = Date.now();
  let repIncrement = false;
  let formScore = 100;
  let feedbackText = "";
  let feedbackState = "idle";
  let danger = 0;

  // 2. State Machine
  // UP (>160) -> DOWN (<100) -> UP (>160)
  if (smoothedAngle > 160) {
    if (stage === "down") {
      repIncrement = true;
      feedbackText = "Great lunge!";
      feedbackState = "good";
      lastRepTime = now;
    }
    stage = "up";
  }

  if (smoothedAngle < 105 && stage === "up") {
    stage = "down";
  }

  // 3. Form Feedback: Depth
  if (stage === "up" && smoothedAngle < 150 && smoothedAngle > 120) {
    feedbackText = "Step deeper";
  }

  return {
    repIncrement,
    formScore: Math.max(0, formScore),
    danger,
    feedbackText: feedbackText || "",
    feedbackState,
    injuryFlags: { shallow: stage === "up" && smoothedAngle > 120 },
  };
}

export function resetLunge() {
  stage = "up";
  smoothedAngle = null;
  lastRepTime = 0;
}
