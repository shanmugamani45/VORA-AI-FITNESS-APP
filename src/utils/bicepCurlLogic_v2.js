import { calculateAngle, areLandmarksVisible, smoothValue, getDistance } from "./exerciseUtils";

// Persistent state
let stage = "down"; // down, peak, up
let smoothedAngle = null;
let lastRepTime = 0;
let repValid = true;
let feedbackCooldown = 0;

export function analyzeBicepCurl(landmarks) {
  if (!landmarks) return null;

  const leftVisible = areLandmarksVisible(landmarks, [11, 13, 15], 0.7);
  const rightVisible = areLandmarksVisible(landmarks, [12, 14, 16], 0.7);

  if (!leftVisible && !rightVisible) {
    return { feedbackText: "Stay in view", feedbackState: "bad" };
  }

  // Select side
  let shoulder, elbow, wrist;
  if (rightVisible && (!leftVisible || landmarks[14].visibility > landmarks[13].visibility)) {
    shoulder = landmarks[12]; elbow = landmarks[14]; wrist = landmarks[16];
  } else {
    shoulder = landmarks[11]; elbow = landmarks[13]; wrist = landmarks[15];
  }

  // 1. Smoothing
  const rawAngle = calculateAngle(shoulder, elbow, wrist);
  smoothedAngle = smoothValue(rawAngle, smoothedAngle, 0.2); // Heavy smoothing for strictness

  const now = Date.now();
  let repIncrement = false;
  let formScore = 100;
  let feedbackText = "";
  let feedbackState = "idle";
  let danger = 0;

  // 2. Continuous Form Validation (Elbow Lock)
  // Distance from shoulder to elbow should remain consistent in x-axis
  const elbowDrift = Math.abs(elbow.x - shoulder.x);
  if (elbowDrift > 0.12) {
    repValid = false;
    formScore -= 30;
    danger = 50;
    if (now > feedbackCooldown) {
      feedbackText = "Keep elbow locked!";
      feedbackState = "bad";
      feedbackCooldown = now + 2000;
    }
  }

  // 3. Strict State Machine
  // DOWN (>160) -> PEAK (<45) -> UP (>160)
  if (smoothedAngle > 155) {
    if (stage === "peak" && repValid) {
      if (now - lastRepTime > 800) { // Speed check
        repIncrement = true;
        feedbackText = "Perfect rep!";
        feedbackState = "good";
      } else {
        feedbackText = "Too fast!";
        feedbackState = "bad";
      }
      lastRepTime = now;
    }
    stage = "down";
    repValid = true; // Reset validity at bottom
  }

  if (smoothedAngle < 45 && stage === "down") {
    stage = "peak";
  }

  // Feedback for partial reps
  if (stage === "down" && smoothedAngle < 155 && smoothedAngle > 100) {
    feedbackText = "Full extension";
  }

  return {
    repIncrement,
    formScore: Math.max(0, formScore),
    danger,
    feedbackText: feedbackText || (repIncrement ? "Good!" : ""),
    feedbackState,
    injuryFlags: { elbowFlare: elbowDrift > 0.12, injury: formScore < 40 }
  };
}

export function resetBicepCurl() {
  stage = "down";
  smoothedAngle = null;
  lastRepTime = 0;
  repValid = true;
}
