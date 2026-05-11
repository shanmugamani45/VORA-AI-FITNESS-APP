import { calculateAngle, areLandmarksVisible, smoothValue } from "./exerciseUtils";

let stage = "up"; // standing
let smoothedAngle = null;

export function analyzeDeadlift(landmarks) {
  if (!landmarks) return null;

  const leftVisible = areLandmarksVisible(landmarks, [11, 23, 25], 0.7);
  const rightVisible = areLandmarksVisible(landmarks, [12, 24, 26], 0.7);

  if (!leftVisible && !rightVisible) {
    return { feedbackText: "Show your full side profile", feedbackState: "bad" };
  }

  let shoulder, hip, knee;
  if (rightVisible && (!leftVisible || landmarks[26].visibility > landmarks[25].visibility)) {
    shoulder = landmarks[12]; hip = landmarks[24]; knee = landmarks[26];
  } else {
    shoulder = landmarks[11]; hip = landmarks[23]; knee = landmarks[25];
  }

  // Angle Shoulder -> Hip -> Knee
  const rawAngle = calculateAngle(shoulder, hip, knee);
  smoothedAngle = smoothValue(rawAngle, smoothedAngle, 0.2);

  let repIncrement = false;
  let feedbackText = "";
  let feedbackState = "idle";
  let danger = 0;

  // Standing straight angle is ~170-180.
  // Bending at hips for RDL goes to ~90-110.

  if (smoothedAngle < 110) {
    if (stage === "up") {
      stage = "down";
      feedbackText = "Good stretch";
      feedbackState = "good";
    }
  }

  if (smoothedAngle > 165 && stage === "down") {
    stage = "up";
    repIncrement = true;
    feedbackText = "Squeeze glutes!";
    feedbackState = "good";
  }

  // Form check: bending too far? 
  if (smoothedAngle < 60) {
    danger = 40;
    feedbackText = "Don't bend too low!";
    feedbackState = "bad";
  }

  return {
    repIncrement,
    formScore: 100,
    danger,
    feedbackText,
    feedbackState,
    injuryFlags: {},
  };
}

export function resetDeadlift() {
  stage = "up";
  smoothedAngle = null;
}
