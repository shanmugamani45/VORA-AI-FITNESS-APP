import { calculateAngle, areLandmarksVisible, smoothValue } from "./exerciseUtils";

let stage = "up"; // arms straight
let smoothedAngle = null;

export function analyzeTricepExtension(landmarks) {
  if (!landmarks) return null;

  const leftVisible = areLandmarksVisible(landmarks, [11, 13, 15], 0.7);
  const rightVisible = areLandmarksVisible(landmarks, [12, 14, 16], 0.7);

  if (!leftVisible && !rightVisible) {
    return { feedbackText: "Show your arm clearly", feedbackState: "bad" };
  }

  let shoulder, elbow, wrist;
  if (rightVisible && (!leftVisible || landmarks[16].visibility > landmarks[15].visibility)) {
    shoulder = landmarks[12]; elbow = landmarks[14]; wrist = landmarks[16];
  } else {
    shoulder = landmarks[11]; elbow = landmarks[13]; wrist = landmarks[15];
  }

  // Angle Shoulder -> Elbow -> Wrist
  const rawAngle = calculateAngle(shoulder, elbow, wrist);
  smoothedAngle = smoothValue(rawAngle, smoothedAngle, 0.2);

  let repIncrement = false;
  let feedbackText = "";
  let feedbackState = "idle";
  let danger = 0;

  // Fully extended arm: > 150
  // Hand behind head: < 70
  if (smoothedAngle < 70) {
    if (stage === "up") {
      stage = "down";
    }
  }

  if (smoothedAngle > 140 && stage === "down") {
    stage = "up";
    repIncrement = true;
    feedbackText = "Triceps engaged";
    feedbackState = "good";
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

export function resetTricepExtension() {
  stage = "up";
  smoothedAngle = null;
}
