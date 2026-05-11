import { useState } from "react";

const WORKOUT_DEMOS = [
  { id: 1, name: "Bicep Curl", description: "Master the form for peak bicep peaks.", icon: "🏋️", category: "Arms", videoUrl: "https://www.youtube.com/embed/ykJmrZ5v0Oo" },
  { id: 2, name: "Squat", description: "Perfect your depth and stability.", icon: "🦵", category: "Legs", videoUrl: "https://www.youtube.com/embed/gcNh17Ckjgg" },
  { id: 3, name: "Pushup", description: "Build elite chest and core power.", icon: "💪", category: "Chest", videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4" },
  { id: 4, name: "Overhead Press", description: "Develop powerful shoulder and core stability.", icon: "⬆️", category: "Shoulders", videoUrl: "https://www.youtube.com/embed/zoN5EH50Dro" },
  { id: 5, name: "Lateral Raise", description: "Isolate the lateral deltoid for shoulder width.", icon: "↔️", category: "Shoulders", videoUrl: "https://www.youtube.com/embed/Kl3LEzQ5Zqs" },
  { id: 6, name: "Lunge", description: "Unilateral leg strength and balance training.", icon: "🏃", category: "Legs", videoUrl: "https://www.youtube.com/embed/1cS-6KsJW9g" },
  { id: 7, name: "Front Raise", description: "Target the anterior deltoids perfectly.", icon: "⏫", category: "Shoulders", videoUrl: "https://www.youtube.com/embed/h9xfpTrAvkE" },
  { id: 8, name: "Calf Raise", description: "Build strong calves and ankle resilience.", icon: "🧦", category: "Legs", videoUrl: "https://www.youtube.com/embed/-M4-G8p8fmc" },
  { id: 9, name: "Shoulder Shrug", description: "Elevate your trap isolation and posture.", icon: "🤷", category: "Back", videoUrl: "https://www.youtube.com/embed/rFsSeClGnNA" },
  { id: 10, name: "Jumping Jack", description: "High-intensity cardio warmup for the whole body.", icon: "🤸", category: "Cardio", videoUrl: "https://www.youtube.com/embed/7Pxr4xOrhNk" },
  { id: 11, name: "High Knees", description: "Spike your heart rate with explosive core drives.", icon: "🦵", category: "Cardio", videoUrl: "https://www.youtube.com/embed/0X0Q8wKLEfo" },
  { id: 12, name: "Deadlift (RDL)", description: "The king of posterior chain exercises.", icon: "🏗️", category: "Legs", videoUrl: "https://www.youtube.com/embed/5rIqP63yWFg" },
  { id: 13, name: "Crunch", description: "Classic abdominal isolation movement.", icon: "🛌", category: "Core", videoUrl: "https://www.youtube.com/embed/eeJ_CYqSoT4" },
  { id: 14, name: "Glute Bridge", description: "Isolate and strengthen the posterior muscles.", icon: "🌉", category: "Legs", videoUrl: "https://www.youtube.com/embed/wPM8icPu6H8" },
  { id: 15, name: "Tricep Extension", description: "Long head tricep isolation for mass.", icon: "💪", category: "Arms", videoUrl: "https://www.youtube.com/embed/b_r_LW4HEcM" },
  { id: 16, name: "Leg Raise", description: "Lower abdominal targeting and hip flexors.", icon: "🆙", category: "Core", videoUrl: "https://www.youtube.com/embed/l4kQd9eWclE" },
];

// Helper to extract ID from https://www.youtube.com/embed/VIDEO_ID
const getYoutubeId = (url) => {
  if (!url) return null;
  try {
    const parts = url.split("/");
    const idWithParams = parts[parts.length - 1];
    return idWithParams.split("?")[0];
  } catch (e) {
    return null;
  }
};


export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);

  const filteredDemos = WORKOUT_DEMOS.filter(demo => 
    demo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    demo.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // LOGIC: Show only 8 if not searching. Reveal all matches if searching.
  const visibleDemos = searchQuery ? filteredDemos : filteredDemos.slice(0, 8);

  return (
    <div style={{ padding: "40px", animation: "fadeIn 0.5s ease" }}>
      <header style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.8rem", marginBottom: "10px", fontWeight: "800" }}>Welcome to <span style={{ color: "#ff3b3b" }}>VORA</span></h1>
        <p style={{ opacity: 0.7, fontSize: "1.1rem" }}>Your personalized cinematic fitness journey starts here.</p>
      </header>

      {/* DAILY GOAL GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "60px" }}>
        <div style={welcomeCardStyle}>
           <h3 style={{ color: "#ff3b3b", marginBottom: "10px" }}>Your Goal Today</h3>
           <p style={{ opacity: 0.7 }}>Complete a 20-minute HIIT session to maintain your streak.</p>
        </div>
        <div style={welcomeCardStyle}>
           <h3 style={{ color: "#ff3b3b", marginBottom: "10px" }}>Latest Tip</h3>
           <p style={{ opacity: 0.7 }}>Proper hydration can improve your workout performance by up to 15%.</p>
        </div>
      </div>

      {/* WORKOUT DEMO SECTION */}
      <section style={{ marginTop: "40px" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "25px", fontWeight: "700" }}>
          Workout <span style={{ color: "#ff3b3b" }}>Demo</span>
          {!searchQuery && <span style={{ fontSize: "0.9rem", opacity: 0.3, marginLeft: "15px", fontWeight: "400" }}>Showing 8 of {WORKOUT_DEMOS.length} featured</span>}
        </h2>
        
        {/* SEARCH BAR */}
        <div style={searchBarContainerStyle}>
          <input 
            type="text" 
            placeholder="Search 25+ exercises (e.g. Burpees, Core)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInputStyle}
          />
          <button style={searchButtonStyle}>
             <span>🔍</span> {searchQuery ? "Filtering..." : "Search"}
          </button>
        </div>

        {/* DEMO GRID */}
        <div style={demoGridStyle}>
          {visibleDemos.map(demo => (
            <div 
              key={demo.id} 
              style={demoCardStyle} 
              className="demo-card"
              onClick={() => setSelectedVideo(demo)}
            >
               <div style={thumbnailStyle}>
                  {getYoutubeId(demo.videoUrl) ? (
                    <img 
                      src={`https://img.youtube.com/vi/${getYoutubeId(demo.videoUrl)}/mqdefault.jpg`} 
                      alt={demo.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ fontSize: "3.5rem" }}>{demo.icon}</span>
                  )}
                  <div className="play-overlay" style={playOverlayStyle}>
                     <div style={playIconStyle}>▶</div>
                  </div>
               </div>
               <div style={{ padding: "20px" }}>
                  <div style={{ fontSize: "0.75rem", color: "#ff3b3b", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>{demo.category}</div>
                  <h3 style={{ margin: "0 0 10px 0", fontSize: "1.3rem" }}>{demo.name}</h3>
                  <p style={{ margin: 0, opacity: 0.5, fontSize: "0.9rem", lineHeight: "1.5" }}>{demo.description}</p>
               </div>
            </div>
          ))}
          {visibleDemos.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px", opacity: 0.5 }}>
               No demo videos found for "{searchQuery}". Try searching for "{WORKOUT_DEMOS[Math.floor(Math.random()*WORKOUT_DEMOS.length)].name}"!
            </div>
          )}
        </div>
      </section>

      {/* VIDEO MODAL (Theater Mode) */}
      {selectedVideo && (
        <div style={modalOverlayStyle} onClick={() => setSelectedVideo(null)}>
           <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setSelectedVideo(null)}
                style={closeButtonStyle}
              >✕</button>
              <div style={videoWrapperStyle}>
                <iframe 
                  src={`${selectedVideo.videoUrl}?autoplay=1`}
                  style={{ width: "100%", height: "100%", border: "none" }}
                  title={selectedVideo.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div style={{ padding: "25px", background: "#111" }}>
                  <h3 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>{selectedVideo.name}</h3>
                  <p style={{ opacity: 0.6, margin: 0 }}>Demonstrating proper {selectedVideo.category.toLowerCase()} technique and postural alignment.</p>
              </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes modalPop { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .demo-card { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); cursor: pointer; }
        .demo-card:hover { transform: translateY(-8px); background: rgba(255, 255, 255, 0.05) !important; box-shadow: 0 20px 40px rgba(0,0,0,0.4); border-color: rgba(255, 59, 59, 0.3); }
        .demo-card:hover .play-overlay { opacity: 1 !important; }
      `}</style>
    </div>
  );
}

const welcomeCardStyle = {
  background: "rgba(255, 255, 255, 0.02)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  padding: "30px",
  borderRadius: "20px",
};

const searchBarContainerStyle = {
  display: "flex",
  gap: "15px",
  marginBottom: "40px",
  maxWidth: "100%",
  background: "rgba(255, 255, 255, 0.02)",
  padding: "8px",
  borderRadius: "16px",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
};

const searchInputStyle = {
  flex: 1,
  background: "transparent",
  border: "none",
  color: "white",
  padding: "15px 20px",
  fontSize: "1.1rem",
  outline: "none",
};

const searchButtonStyle = {
  background: "#ff3b3b",
  color: "white",
  border: "none",
  padding: "0 30px",
  borderRadius: "12px",
  fontWeight: "700",
  fontSize: "1rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  transition: "all 0.2s ease"
};

const demoGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "25px",
};

const demoCardStyle = {
  background: "rgba(255, 255, 255, 0.02)",
  borderRadius: "24px",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const thumbnailStyle = {
  height: "180px",
  background: "linear-gradient(45deg, #1e1e1e, #111)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
};

const playOverlayStyle = {
  position: "absolute",
  top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(255, 59, 59, 0.15)",
  backdropFilter: "blur(4px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  opacity: 0,
  transition: "opacity 0.3s ease",
};

const playIconStyle = {
  width: "50px",
  height: "50px",
  background: "#ff3b3b",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  fontSize: "1.2rem",
  boxShadow: "0 0 20px rgba(255, 59, 59, 0.5)",
};

// MODAL STYLES
const modalOverlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.85)",
  backdropFilter: "blur(10px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  padding: "40px",
  animation: "fadeIn 0.3s ease"
};

const modalContentStyle = {
  width: "100%",
  maxWidth: "1000px",
  background: "#1e1e1e",
  borderRadius: "32px",
  overflow: "hidden",
  position: "relative",
  boxShadow: "0 30px 100px rgba(0,0,0,0.8)",
  animation: "modalPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
};

const videoWrapperStyle = {
  aspectRatio: "16/9",
  width: "100%",
  background: "black"
};

const closeButtonStyle = {
  position: "absolute",
  top: "20px",
  right: "20px",
  background: "rgba(255,255,255,0.1)",
  border: "none",
  color: "white",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  fontSize: "1.2rem",
  cursor: "pointer",
  zIndex: 10,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "all 0.2s ease"
};
