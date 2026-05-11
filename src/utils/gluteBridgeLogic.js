import { calculateAngle, areLandmarksVisible, smoothValue } from "./exerciseUtils";

let stage = "down"; // hips on floor
let smoothedAngle = null;

export function analyzeGluteBridge(landmarks) {
  if (!landmarks) return null;

  const leftVisible = areLandmarksVisible(landmarks, [11, 23, 25], 0.7);
  const rightVisible = areLandmarksVisible(landmarks, [12, 24, 26], 0.7);

  if (!leftVisible && !rightVisible) {
    return { feedbackText: "Ensure body visible on mat", feedbackState: "bad" };
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

  // Hips on floor: angle < 140 (v-shape).
  // Hips raised to straight line: angle > 165
  if (smoothedAngle < 140) {
    if (stage === "up") {
      repIncrement = true;
    }
    stage = "down";
  }

  if (smoothedAngle > 165 && stage === "down") {
    stage = "up";
    feedbackText = "Hold the bridge!";
    feedbackState = "good";
  }

  return {
    repIncrement,
    formScore: 100,
    danger: 0,
    feedbackText,
    feedbackState,
    injuryFlags: {},
  };
}

export function resetGluteBridge() {
  stage = "down";
  smoothedAngle = null;
}
