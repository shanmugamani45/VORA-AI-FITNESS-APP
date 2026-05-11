import { calculateAngle, areLandmarksVisible, smoothValue } from "./exerciseUtils";

let stage = "down"; // legs on floor
let smoothedAngle = null;

export function analyzeLegRaise(landmarks) {
  if (!landmarks) return null;

  const leftVisible = areLandmarksVisible(landmarks, [11, 23, 27], 0.7);
  const rightVisible = areLandmarksVisible(landmarks, [12, 24, 28], 0.7);

  if (!leftVisible && !rightVisible) {
    return { feedbackText: "Please show full body on mat", feedbackState: "bad" };
  }

  let shoulder, hip, ankle;
  if (rightVisible && (!leftVisible || landmarks[28].visibility > landmarks[27].visibility)) {
    shoulder = landmarks[12]; hip = landmarks[24]; ankle = landmarks[28];
  } else {
    shoulder = landmarks[11]; hip = landmarks[23]; ankle = landmarks[27];
  }

  // Angle Shoulder -> Hip -> Ankle
  const rawAngle = calculateAngle(shoulder, hip, ankle);
  smoothedAngle = smoothValue(rawAngle, smoothedAngle, 0.2);

  let repIncrement = false;
  let feedbackText = "";
  let feedbackState = "idle";

  // Relaxed (legs on floor) ~160-180.
  // Legs raised 90 degrees ~90-110.
  if (smoothedAngle > 150) {
    if (stage === "up") {
      repIncrement = true;
      feedbackText = "Great core control";
      feedbackState = "good";
    }
    stage = "down";
  }

  if (smoothedAngle < 110 && stage === "down") {
    stage = "up";
    feedbackText = "Hold legs up";
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

export function resetLegRaise() {
  stage = "down";
  smoothedAngle = null;
}
