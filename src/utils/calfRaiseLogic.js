import { calculateAngle, areLandmarksVisible, smoothValue } from "./exerciseUtils";

let stage = "down";
let smoothedAngle = null;

export function analyzeCalfRaise(landmarks) {
  if (!landmarks) return null;

  const leftVisible = areLandmarksVisible(landmarks, [25, 27, 31], 0.7);
  const rightVisible = areLandmarksVisible(landmarks, [26, 28, 32], 0.7);

  if (!leftVisible && !rightVisible) {
    return { feedbackText: "Show your legs and feet", feedbackState: "bad" };
  }

  // Use the more visible leg
  let knee, ankle, footIndex;
  if (rightVisible && (!leftVisible || landmarks[32].visibility > landmarks[31].visibility)) {
    knee = landmarks[26]; ankle = landmarks[28]; footIndex = landmarks[32];
  } else {
    knee = landmarks[25]; ankle = landmarks[27]; footIndex = landmarks[31];
  }

  // Angle Knee -> Ankle -> Toe (Foot Index)
  const rawAngle = calculateAngle(knee, ankle, footIndex);
  smoothedAngle = smoothValue(rawAngle, smoothedAngle, 0.2);

  let repIncrement = false;
  let feedbackText = "";
  let feedbackState = "idle";
  let formScore = 100;

  // Assuming flat foot keeps the angle around 90-110, going up on toes increases it to > 130
  if (smoothedAngle < 110) {
    if (stage === "up") {
      repIncrement = true;
      feedbackText = "Nice calf raise";
      feedbackState = "good";
    }
    stage = "down";
  }

  if (smoothedAngle > 135 && stage === "down") {
    stage = "up";
    feedbackText = "Squeeze the calves";
    feedbackState = "good";
  }

  return {
    repIncrement,
    formScore,
    danger: 0,
    feedbackText,
    feedbackState,
    injuryFlags: {},
  };
}

export function resetCalfRaise() {
  stage = "down";
  smoothedAngle = null;
}
