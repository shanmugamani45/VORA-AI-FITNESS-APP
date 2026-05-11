import { areLandmarksVisible } from "./exerciseUtils";

let lastKnee = "none"; // 'left', 'right', 'none'
let repHalfTick = false; 

export function analyzeHighKnees(landmarks) {
  if (!landmarks) return null;

  const leftVisible = areLandmarksVisible(landmarks, [23, 25], 0.6);
  const rightVisible = areLandmarksVisible(landmarks, [24, 26], 0.6);

  if (!leftVisible && !rightVisible) {
    return { feedbackText: "Ensure legs are visible", feedbackState: "bad" };
  }

  const hipL = landmarks[23];
  const kneeL = landmarks[25];
  
  const hipR = landmarks[24];
  const kneeR = landmarks[26];

  let repIncrement = false;
  let feedbackText = "";
  let feedbackState = "idle";
  let formScore = 100;

  // Assuming Y=0 is top of screen. Knee going high means Knee.y approaches Hip.y
  // Threshold: Knee y is above or very close to hip y. 
  // Let's say high knee is Knee.y < Hip.y + 0.1 (normalized 0-1)
  
  const leftHigh = leftVisible && (kneeL.y < hipL.y + 0.05);
  const rightHigh = rightVisible && (kneeR.y < hipR.y + 0.05);

  if (leftHigh && lastKnee !== "left") {
    if (repHalfTick) {
      repIncrement = true;  // one full cycle L-R gives a rep
      repHalfTick = false;
      feedbackText = "Keep them high!";
      feedbackState = "good";
    } else {
      repHalfTick = true;
    }
    lastKnee = "left";
  }

  if (rightHigh && lastKnee !== "right") {
    if (repHalfTick) {
      repIncrement = true;
      repHalfTick = false;
      feedbackText = "Good pace!";
      feedbackState = "good";
    } else {
      repHalfTick = true;
    }
    lastKnee = "right";
  }

  // Neutral state reset to allow another rep without alternating if needed, 
  // but high knees should alternate, so strict alternating is forced by lastKnee.
  if (!leftHigh && !rightHigh) {
    // We don't reset lastKnee here, otherwise they could just spam one leg.
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

export function resetHighKnees() {
  lastKnee = "none";
  repHalfTick = false;
}
