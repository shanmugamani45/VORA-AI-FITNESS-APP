import { calculateAngle, areLandmarksVisible, smoothValue } from "./exerciseUtils";

// State
let stage = "down"; // down, press, peak
let smoothedAngle = null;
let lastRepTime = 0;
let repValid = true;
let feedbackCooldown = 0;

export function analyzeOverheadPress(landmarks) {
  if (!landmarks) return null;

  const leftVisible = areLandmarksVisible(landmarks, [11, 13, 15], 0.7);
  const rightVisible = areLandmarksVisible(landmarks, [12, 14, 16], 0.7);

  if (!leftVisible && !rightVisible) {
    return { feedbackText: "Show your full upper body", feedbackState: "bad" };
  }

  // Use the more visible arm
  let shoulder, elbow, wrist;
  if (rightVisible && (!leftVisible || landmarks[14].visibility > landmarks[13].visibility)) {
    shoulder = landmarks[12]; elbow = landmarks[14]; wrist = landmarks[16];
  } else {
    shoulder = landmarks[11]; elbow = landmarks[13]; wrist = landmarks[15];
  }

  // 1. Smoothing
  const rawAngle = calculateAngle(shoulder, elbow, wrist);
  smoothedAngle = smoothValue(rawAngle, smoothedAngle, 0.25);

  const now = Date.now();
  let repIncrement = false;
  let formScore = 100;
  let feedbackText = "";
  let feedbackState = "idle";
  let danger = 0;

  // 2. Strict Form: Vertical alignment
  // Wrist should be roughly above the shoulder at the peak
  const horizontalDiff = Math.abs(wrist.x - shoulder.x);
  if (horizontalDiff > 0.15 && stage === "press") {
    repValid = false;
    formScore -= 20;
    if (now > feedbackCooldown) {
      feedbackText = "Press straight up!";
      feedbackState = "bad";
      feedbackCooldown = now + 2000;
    }
  }

  // 3. State Machine
  // DOWN (<80) -> PRESS -> PEAK (>160)
  if (smoothedAngle < 90) {
    stage = "down";
    repValid = true;
  }

  if (smoothedAngle > 100 && smoothedAngle < 150 && stage === "down") {
    stage = "press";
  }

  if (smoothedAngle > 165 && (stage === "press" || stage === "down")) {
     if (repValid) {
        repIncrement = true;
        feedbackText = "Locked out!";
        feedbackState = "good";
        lastRepTime = now;
     }
     stage = "peak";
  }

  // Reset stage at bottom to allow next rep
  if (smoothedAngle < 90) stage = "down";

  return {
    repIncrement,
    formScore: Math.max(0, formScore),
    danger,
    feedbackText: feedbackText || "",
    feedbackState,
    injuryFlags: { badPath: horizontalDiff > 0.15, injury: formScore < 40 }
  };
}

export function resetOverheadPress() {
  stage = "down";
  smoothedAngle = null;
  lastRepTime = 0;
  repValid = true;
}
