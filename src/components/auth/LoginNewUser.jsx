import { useNavigate } from "react-router-dom";
import "./LoginReturningUser.css";

export default function LoginNewUser() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      {/* Animated glowing orbs in background */}
      <div className="auth-bg-orb orb-1"></div>
      <div className="auth-bg-orb orb-2"></div>
      
      <div className="auth-glass-card" style={{ maxWidth: "600px" }}>
        <div className="auth-avatar">🔥</div>
        <h1 className="auth-title">Welcome to VORA</h1>
        <p className="auth-subtitle">
          Experience the future of fitness. Our AI-powered platform tracks your form, 
          optimizes your routine, and pushes your limits.
        </p>
        
        <div style={{ display: "flex", gap: "20px", width: "100%", marginBottom: "30px" }}>
           <div style={featureStyle}>
              <span style={{ fontSize: "1.5rem" }}>🤖</span>
              <p style={{ margin: "5px 0 0 0", fontSize: "0.8rem", opacity: 0.8 }}>AI Pose Analysis</p>
           </div>
           <div style={featureStyle}>
              <span style={{ fontSize: "1.5rem" }}>📈</span>
              <p style={{ margin: "5px 0 0 0", fontSize: "0.8rem", opacity: 0.8 }}>Real-time Stats</p>
           </div>
           <div style={featureStyle}>
              <span style={{ fontSize: "1.5rem" }}>🎧</span>
              <p style={{ margin: "5px 0 0 0", fontSize: "0.8rem", opacity: 0.8 }}>Virtual Coach</p>
           </div>
        </div>

        <button className="auth-btn" onClick={() => navigate("/dashboard")}>
          INITIALIZE PLATFORM
        </button>

        <div className="auth-footer" style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <span>Version 1.0.4</span>
          <span>•</span>
          <span onClick={() => navigate("/login")} style={{ cursor: "pointer", color: "#00d2ff" }}>Returning User?</span>
        </div>
      </div>
    </div>
  );
}

const featureStyle = {
  flex: 1,
  background: "rgba(255, 255, 255, 0.03)",
  padding: "15px",
  borderRadius: "16px",
  border: "1px solid rgba(255, 255, 255, 0.05)",
};

