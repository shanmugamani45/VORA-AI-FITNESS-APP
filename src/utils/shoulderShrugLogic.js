import { getDistance, areLandmarksVisible, smoothValue } from "./exerciseUtils";

let stage = "down";
let smoothedRatio = null;

export function analyzeShoulderShrug(landmarks) {
  if (!landmarks) return null;

  const visible = areLandmarksVisible(landmarks, [0, 11, 12, 23, 24], 0.7);

  if (!visible) {
    return { feedbackText: "Ensure upper body is fully visible", feedbackState: "bad" };
  }

  const nose = landmarks[0];
  const shoulderLeft = landmarks[11];
  const shoulderRight = landmarks[12];
  const hipLeft = landmarks[23];
  const hipRight = landmarks[24];

  // Averages for center points
  const shoulderCenter = { x: (shoulderLeft.x + shoulderRight.x) / 2, y: (shoulderLeft.y + shoulderRight.y) / 2 };
  const hipCenter = { x: (hipLeft.x + hipRight.x) / 2, y: (hipLeft.y + hipRight.y) / 2 };

  const torsoLen = getDistance(shoulderCenter, hipCenter);
  const headDist = getDistance(nose, shoulderCenter);

  if (torsoLen === 0) return null;

  // ratio drops when shoulders go up
  const rawRatio = headDist / torsoLen;
  smoothedRatio = smoothValue(rawRatio, smoothedRatio, 0.2);

  let repIncrement = false;
  let feedbackText = "";
  let feedbackState = "idle";
  
  // Ratios depend on camera angle, but typically relaxed > 0.35, shrugged < 0.25 (shoulders get close to nose)
  // Let's use a threshold approach based on a moving baseline or static broad thresholds.
  if (smoothedRatio > 0.32) {
    if (stage === "up") {
      repIncrement = true;
      feedbackText = "Good trap squeeze";
      feedbackState = "good";
    }
    stage = "down";
  }

  if (smoothedRatio < 0.25 && stage === "down") {
    stage = "up";
    feedbackText = "Hold the shrug";
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

export function resetShoulderShrug() {
  stage = "down";
  smoothedRatio = null;
}
