import { useEffect, useState } from "react";
import { achievementService } from "../../utils/achievementService";

export default function Achievements() {
  const [badges, setBadges] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    setBadges(achievementService.getBadgeData());
    setStats(achievementService.getStats());
  }, []);

  const totalPossible = badges.length * 3;
  const currentEarned = badges.reduce((acc, b) => acc + b.level, 0);

  return (
    <div style={{ padding: "40px", animation: "fadeIn 0.5s ease" }}>
      <header style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
           <h1 style={{ fontSize: "2.8rem", marginBottom: "10px", fontWeight: "800" }}>Your <span style={{ color: "#ff3b3b" }}>Achievements</span></h1>
           <p style={{ opacity: 0.7, fontSize: "1.1rem" }}>Level up your fitness rank and unlock elite badges.</p>
        </div>
        <div style={{ textAlign: "right" }}>
           <div style={{ fontSize: "0.9rem", opacity: 0.5, textTransform: "uppercase", letterSpacing: "1px" }}>Total Rank Progress</div>
           <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#ff3b3b" }}>{currentEarned} <span style={{ fontSize: "1.1rem", opacity: 0.3 }}>/ {totalPossible}</span></div>
        </div>
      </header>

      {/* QUICK STATS CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px", marginBottom: "50px" }}>
        <div className="card" style={statCardStyle}>
          <h3 style={{ color: "#ff3b3b" }}>Total Workouts</h3>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{stats.sessions || 0}</div>
        </div>
        <div className="card" style={statCardStyle}>
          <h3 style={{ color: "#ff3b3b" }}>Global Reps</h3>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{Object.values(stats.totalReps || {}).reduce((a, b) => a + b, 0)}</div>
        </div>
        <div className="card" style={statCardStyle}>
          <h3 style={{ color: "#ff3b3b" }}>Active Streak</h3>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{stats.streak || 0} Days</div>
        </div>
      </div>

      <h2 style={{ marginBottom: "30px", fontSize: "1.8rem" }}>Fitness <span style={{ color: "#ff3b3b" }}>Badges</span></h2>
      
      {/* BADGE GRID: 3x2 Grid that fits based on screen width */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(3, 1fr)", 
        gap: "40px",
        width: "100%",
        marginTop: "20px",
        paddingBottom: "60px"
      }}>
        {badges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

function BadgeCard({ badge }) {
  const isLocked = badge.level === 0;
  const rankNames = ["Locked", "Bronze", "Silver", "Gold"];
  const rankColors = ["#333", "#cd7f32", "#c0c0c0", "#ffd700"];

  return (
    <div style={{
      ...badgeCardStyle,
      opacity: isLocked ? 0.6 : 1,
      filter: isLocked ? "grayscale(1) brightness(0.7)" : "none",
      borderColor: !isLocked ? `${badge.color}66` : "rgba(255,255,255,0.05)",
      boxShadow: !isLocked ? `0 15px 40px ${badge.color}15` : "none",
      minHeight: "280px"
    }}>
      <div style={{ fontSize: "3.5rem", marginBottom: "20px", filter: !isLocked ? `drop-shadow(0 0 15px ${badge.color})` : "none" }}>
        {badge.icon}
      </div>
      
      <h3 style={{ margin: "5px 0", fontSize: "1.4rem", fontWeight: "700" }}>{badge.title}</h3>
      
      {!isLocked && (
        <div style={{ 
          fontSize: "0.8rem", 
          fontWeight: "800", 
          color: rankColors[badge.level], 
          textTransform: "uppercase", 
          letterSpacing: "2px",
          marginBottom: "20px"
        }}>
          {rankNames[badge.level]} Rank
        </div>
      )}

      {/* Progress Section */}
      <div style={{ width: "100%", marginTop: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "8px", opacity: 0.7 }}>
          <span style={{ fontWeight: "600" }}>{badge.isMaxed ? "MAXED" : `Goal: ${badge.nextThreshold}`}</span>
          <span style={{ fontWeight: "700" }}>{badge.currentVal} <span style={{ opacity: 0.5 }}>/ {badge.nextThreshold}</span></span>
        </div>
        <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ 
            width: `${badge.progress}%`, 
            height: "100%", 
            background: isLocked ? "#444" : `linear-gradient(90deg, ${badge.color}aa, ${badge.color})`,
            boxShadow: !isLocked ? `0 0 15px ${badge.color}` : "none",
            transition: "width 1s cubic-bezier(0.34, 1.56, 0.64, 1)" 
          }} />
        </div>
      </div>
    </div>
  );
}

const statCardStyle = {
  background: "rgba(255, 255, 255, 0.03)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  padding: "35px",
  borderRadius: "24px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
};

const badgeCardStyle = {
  background: "rgba(255, 255, 255, 0.03)",
  backdropFilter: "blur(15px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  padding: "35px",
  borderRadius: "24px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
};
