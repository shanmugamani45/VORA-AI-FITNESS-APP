/**
 * Calculates the angle between three landmarks.
 * @param {object} a - Point A
 * @param {object} b - Point B (the vertex)
 * @param {object} c - Point C
 * @returns {number} Angle in degrees
 */
export function calculateAngle(a, b, c) {
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };

  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.sqrt(ab.x ** 2 + ab.y ** 2);
  const magCB = Math.sqrt(cb.x ** 2 + cb.y ** 2);

  if (magAB * magCB === 0) return 0;

  let angle = Math.acos(Math.max(-1, Math.min(1, dot / (magAB * magCB))));
  return (angle * 180) / Math.PI;
}

/**
 * Exponential Moving Average for smoothing data streams (angles/coordinates).
 * @param {number} newValue - The current frame value
 * @param {number} prevValue - The smoothed value from the previous frame
 * @param {number} alpha - Smoothing factor (0-1, lower = smoother but slower)
 * @returns {number}
 */
export function smoothValue(newValue, prevValue, alpha = 0.3) {
  if (prevValue === undefined || prevValue === null) return newValue;
  return alpha * newValue + (1 - alpha) * prevValue;
}

/**
 * Checks if a set of landmarks are visible enough for tracking.
 */
export function areLandmarksVisible(landmarks, indices, threshold = 0.6) {
  return indices.every(index => landmarks[index] && landmarks[index].visibility > threshold);
}

/**
 * Checks alignment of three points (e.g., Shoulder-Hip-Ankle) for plank posture.
 * @returns {number} The deviation from 180 degrees
 */
export function checkAlignment(p1, p2, p3) {
  const angle = calculateAngle(p1, p2, p3);
  return Math.abs(180 - angle);
}

export function getDistance(p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}
