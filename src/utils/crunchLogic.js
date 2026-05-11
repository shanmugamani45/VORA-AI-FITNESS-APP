import { calculateAngle, areLandmarksVisible, smoothValue } from "./exerciseUtils";

let stage = "down"; // laying down
let smoothedAngle = null;

export function analyzeCrunch(landmarks) {
  if (!landmarks) return null;

  const leftVisible = areLandmarksVisible(landmarks, [11, 23, 25], 0.7);
  const rightVisible = areLandmarksVisible(landmarks, [12, 24, 26], 0.7);

  if (!leftVisible && !rightVisible) {
    return { feedbackText: "Show your side profile on the mat", feedbackState: "bad" };
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

  // Relaxed (shoulders on floor) ~120-150 depending on knee bend.
  // Crunched up ~60-90.
  if (smoothedAngle > 120) {
    if (stage === "up") {
      repIncrement = true;
      feedbackText = "Good rep";
      feedbackState = "good";
    }
    stage = "down";
  }

  if (smoothedAngle < 85 && stage === "down") {
    stage = "up";
    feedbackText = "Squeeze your core";
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

export function resetCrunch() {
  stage = "down";
  smoothedAngle = null;
}
