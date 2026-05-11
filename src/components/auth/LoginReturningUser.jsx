import { useNavigate } from "react-router-dom";
import "./LoginReturningUser.css";

export default function LoginReturningUser() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      {/* Animated glowing orbs in background */}
      <div className="auth-bg-orb orb-1"></div>
      <div className="auth-bg-orb orb-2"></div>
      
      <div className="auth-glass-card">
        <div className="auth-avatar">💪</div>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Your AI personal trainer is ready for you.</p>
        
        <button className="auth-btn" onClick={() => navigate("/dashboard")}>
          ENTER PLATFORM
        </button>

        <div className="auth-footer">
          System Secure. Encrypted Biometrics.
        </div>
      </div>
    </div>
  );
}
