const STORAGE_KEY = "ai_fit_achievements";

const INITIAL_STATS = {
  totalReps: {
    BICEP_CURL: 0,
    SQUAT: 0,
    PUSHUP: 0,
    OVERHEAD_PRESS: 0,
    LATERAL_RAISE: 0,
    LUNGE: 0,
  },
  sessions: 0,
  lastWorkoutDate: null,
  streak: 0,
};

const BADGE_DEFINITIONS = [
  {
    id: "bicep_beast",
    title: "Iron Biceps",
    icon: "💪",
    exerciseId: "BICEP_CURL",
    tiers: [50, 200, 1000],
    color: "#ff3b3b",
  },
  {
    id: "squat_king",
    title: "Leg Legend",
    icon: "🦵",
    exerciseId: "SQUAT",
    tiers: [50, 200, 1000],
    color: "#00b894",
  },
  {
    id: "pushup_pro",
    title: "Chest Master",
    icon: "🏗️",
    exerciseId: "PUSHUP",
    tiers: [50, 200, 500],
    color: "#0984e3",
  },
  {
    id: "session_warrior",
    title: "War Machine",
    icon: "🏅",
    type: "sessions",
    tiers: [1, 10, 50],
    color: "#f1c40f",
  },
  {
    id: "streak_expert",
    title: "Consistency",
    icon: "🔥",
    type: "streak",
    tiers: [3, 7, 30],
    color: "#e67e22",
  },
  {
    id: "total_rep_grandmaster",
    title: "Elite Athlete",
    icon: "🏆",
    type: "total_reps",
    tiers: [500, 2000, 10000],
    color: "#9b59b6",
  }
];

export const achievementService = {
  getStats: () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { ...INITIAL_STATS };
  },

  saveSession: (exerciseId, reps) => {
    const stats = achievementService.getStats();
    stats.totalReps[exerciseId] = (stats.totalReps[exerciseId] || 0) + reps;
    stats.sessions += 1;
    
    // Streak logic
    const today = new Date().toDateString();
    if (stats.lastWorkoutDate !== today) {
      if (stats.lastWorkoutDate === new Date(Date.now() - 86400000).toDateString()) {
        stats.streak += 1;
      } else {
        stats.streak = 1;
      }
      stats.lastWorkoutDate = today;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    return stats;
  },

  getBadgeData: () => {
    const stats = achievementService.getStats();
    const allTotalReps = Object.values(stats.totalReps).reduce((a, b) => a + b, 0);

    return BADGE_DEFINITIONS.map(badge => {
      let currentVal = 0;
      if (badge.exerciseId) currentVal = stats.totalReps[badge.exerciseId];
      else if (badge.type === "sessions") currentVal = stats.sessions;
      else if (badge.type === "streak") currentVal = stats.streak;
      else if (badge.type === "total_reps") currentVal = allTotalReps;

      // Find current tier level (0 = locked, 1 = bronze, etc)
      let level = 0;
      badge.tiers.forEach((t, i) => {
        if (currentVal >= t) level = i + 1;
      });

      const nextThreshold = level < badge.tiers.length ? badge.tiers[level] : badge.tiers[badge.tiers.length - 1];
      const prevThreshold = level > 0 ? badge.tiers[level - 1] : 0;
      
      const progressToNext = level < badge.tiers.length 
        ? ((currentVal - prevThreshold) / (nextThreshold - prevThreshold)) * 100 
        : 100;

      return {
        ...badge,
        level,
        currentVal,
        nextThreshold,
        progress: Math.min(100, progressToNext),
        isMaxed: level === badge.tiers.length
      };
    });
  }
};
