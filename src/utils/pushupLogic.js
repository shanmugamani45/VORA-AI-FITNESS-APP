import { calculateAngle, areLandmarksVisible, smoothValue, checkAlignment } from "./exerciseUtils";

let stage = "up"; // up, down
let smoothedAngle = null;
let lastRepTime = 0;
let repValid = true;
let feedbackCooldown = 0;

export function analyzePushup(landmarks) {
  if (!landmarks) return null;

  const rightVisible = areLandmarksVisible(landmarks, [12, 14, 16, 24, 28], 0.7);
  const leftVisible = areLandmarksVisible(landmarks, [11, 13, 15, 23, 27], 0.7);

  if (!leftVisible && !rightVisible) {
    return { feedbackText: "Upper & lower body hidden", feedbackState: "bad" };
  }

  let shoulder, elbow, wrist, hip, ankle;
  if (rightVisible && (!leftVisible || landmarks[14].visibility > landmarks[13].visibility)) {
    shoulder = landmarks[12]; elbow = landmarks[14]; wrist = landmarks[16]; hip = landmarks[24]; ankle = landmarks[28];
  } else {
    shoulder = landmarks[11]; elbow = landmarks[13]; wrist = landmarks[15]; hip = landmarks[23]; ankle = landmarks[27];
  }

  // 1. Smoothing
  const rawAngle = calculateAngle(shoulder, elbow, wrist);
  smoothedAngle = smoothValue(rawAngle, smoothedAngle, 0.2);

  const now = Date.now();
  let repIncrement = false;
  let formScore = 100;
  let feedbackText = "";
  let feedbackState = "idle";
  let danger = 0;

  // 2. Strict Form: Plank Check (Shoulder-Hip-Ankle)
  const alignmentError = checkAlignment(shoulder, hip, ankle);
  if (alignmentError > 20) { // Sagging or piking hip
    repValid = false;
    formScore -= 30;
    danger = 40;
    if (now > feedbackCooldown) {
      feedbackText = alignmentError > 20 ? "Keep your body straight!" : "";
      feedbackState = "bad";
      feedbackCooldown = now + 3000;
    }
  }

  // 3. State Machine
  // UP (>155) -> DOWN (<85) -> UP (>160)
  if (smoothedAngle > 160) {
    if (stage === "down" && repValid) {
      repIncrement = true;
      feedbackText = "Perfect pushup!";
      feedbackState = "good";
      lastRepTime = now;
    }
    stage = "up";
    repValid = true;
  }

  if (smoothedAngle < 85 && stage === "up") {
    stage = "down";
  }

  // Feedback for depth
  if (stage === "up" && smoothedAngle < 150 && smoothedAngle > 100) {
    feedbackText = "Go deeper";
  }

  return {
    repIncrement,
    formScore: Math.max(0, formScore),
    danger,
    feedbackText: feedbackText || (repIncrement ? "Nice!" : ""),
    feedbackState,
    injuryFlags: { badPlank: alignmentError > 20, injury: formScore < 40 }
  };
}

export function resetPushup() {
  stage = "up";
  smoothedAngle = null;
  lastRepTime = 0;
  repValid = true;
}
