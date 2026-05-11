import { getDistance, areLandmarksVisible, smoothValue } from "./exerciseUtils";

let stage = "down";
let smoothedAnkleRatio = null;

export function analyzeJumpingJack(landmarks) {
  if (!landmarks) return null;

  const visible = areLandmarksVisible(landmarks, [11, 12, 15, 16, 23, 24, 27, 28], 0.6);

  if (!visible) {
    return { feedbackText: "Show full body for jumping jacks", feedbackState: "bad" };
  }

  const wristL = landmarks[15];
  const wristR = landmarks[16];
  const shoulderL = landmarks[11];
  const shoulderR = landmarks[12];
  
  const ankleL = landmarks[27];
  const ankleR = landmarks[28];
  const hipL = landmarks[23];
  const hipR = landmarks[24];

  // Hands up? Hand Y is inverted (0 is top)
  const handsAboveShoulders = (wristL.y < shoulderL.y) && (wristR.y < shoulderR.y);
  const handsBelowShoulders = (wristL.y > shoulderL.y) && (wristR.y > shoulderR.y);

  // Feet wide?
  const ankleDist = getDistance(ankleL, ankleR);
  const hipDist = getDistance(hipL, hipR);

  // Smooth the ankle/hip ratio to avoid flicker
  const rawRatio = hipDist > 0 ? (ankleDist / hipDist) : 0;
  smoothedAnkleRatio = smoothValue(rawRatio, smoothedAnkleRatio, 0.2);

  const feetWide = smoothedAnkleRatio > 1.8;
  const feetTogether = smoothedAnkleRatio < 1.2;

  let repIncrement = false;
  let feedbackText = "";
  let feedbackState = "idle";
  let formScore = 100;

  // UP: Hands above shoulders, feet wide
  if (handsAboveShoulders && feetWide && stage === "down") {
    stage = "up";
  }

  // DOWN: Hands below shoulders, feet together
  if (handsBelowShoulders && feetTogether && stage === "up") {
    stage = "down";
    repIncrement = true;
    feedbackText = "Keep the pace!";
    feedbackState = "good";
  }

  // Edge cases - bad form
  if (handsAboveShoulders && !feetWide && stage === "down") {
    feedbackText = "Spread feet out!";
    feedbackState = "bad";
    formScore -= 10;
  }

  return {
    repIncrement,
    formScore: Math.max(0, formScore),
    danger: 0,
    feedbackText,
    feedbackState,
    injuryFlags: {},
  };
}

export function resetJumpingJack() {
  stage = "down";
  smoothedAnkleRatio = null;
}
