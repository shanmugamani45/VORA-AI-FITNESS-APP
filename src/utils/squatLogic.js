import { calculateAngle, areLandmarksVisible, smoothValue } from "./exerciseUtils";

let stage = "up"; // up, down, peak
let smoothedAngle = null;
let lastRepTime = 0;
let repValid = true;
let feedbackCooldown = 0;

export function analyzeSquat(landmarks) {
  if (!landmarks) return null;

  const leftVisible = areLandmarksVisible(landmarks, [23, 25, 27], 0.7);
  const rightVisible = areLandmarksVisible(landmarks, [24, 26, 28], 0.7);

  if (!leftVisible && !rightVisible) {
    return { feedbackText: "Get in frame", feedbackState: "bad" };
  }

  let hip, knee, ankle, shoulder;
  if (rightVisible && (!leftVisible || landmarks[26].visibility > landmarks[25].visibility)) {
    hip = landmarks[24]; knee = landmarks[26]; ankle = landmarks[28]; shoulder = landmarks[12];
  } else {
    hip = landmarks[23]; knee = landmarks[25]; ankle = landmarks[27]; shoulder = landmarks[11];
  }

  // 1. Smoothing
  const rawAngle = calculateAngle(hip, knee, ankle);
  smoothedAngle = smoothValue(rawAngle, smoothedAngle, 0.25);

  const now = Date.now();
  let repIncrement = false;
  let formScore = 100;
  let feedbackText = "";
  let feedbackState = "idle";
  let danger = 0;

  // 2. Strict Form: Torso stability
  // Check angle between shoulder and hip vertically
  const torsoAngle = calculateAngle({ x: shoulder.x, y: shoulder.y - 1 }, shoulder, hip);
  if (torsoAngle > 45) { // Excessive leaning forward
    repValid = false;
    formScore -= 20;
    if (now > feedbackCooldown) {
      feedbackText = "Keep back straight!";
      feedbackState = "bad";
      feedbackCooldown = now + 2500;
    }
  }

  // 3. State Machine
  // UP (>160) -> DOWN (<95) -> UP (>160)
  if (smoothedAngle > 165) {
    if (stage === "down" && repValid) {
      repIncrement = true;
      feedbackText = "Great squat!";
      feedbackState = "good";
      lastRepTime = now;
    }
    stage = "up";
    repValid = true;
  }

  if (smoothedAngle < 95 && stage === "up") {
    stage = "down";
  }

  // Feedback for depth
  if (stage === "up" && smoothedAngle < 150 && smoothedAngle > 120) {
    feedbackText = "Go deeper";
  }

  return {
    repIncrement,
    formScore: Math.max(0, formScore),
    danger,
    feedbackText: feedbackText || (repIncrement ? "Solid!" : ""),
    feedbackState,
    injuryFlags: { excessiveLean: torsoAngle > 45, injury: formScore < 40 }
  };
}

export function resetSquat() {
  stage = "up";
  smoothedAngle = null;
  lastRepTime = 0;
  repValid = true;
}
