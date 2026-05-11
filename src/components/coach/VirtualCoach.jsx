import { useState, useEffect, useRef } from "react";
import { useAvatarStore } from "../../store/useAvatarStore";
import "./VirtualCoach.css";
import coachFemaleImg from "../../assets/coach_female.png";
import coachMaleImg from "../../assets/coach_male.png";

export default function VirtualCoach({ state, text, isFixed = false }) {
  const { visualGender, themeColor } = useAvatarStore();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Speech Synchronization
  useEffect(() => {
    const handleStart = () => setIsSpeaking(true);
    const handleEnd = () => setIsSpeaking(false);
    window.addEventListener("speech-start", handleStart);
    window.addEventListener("speech-end", handleEnd);
    return () => {
      window.removeEventListener("speech-start", handleStart);
      window.removeEventListener("speech-end", handleEnd);
    };
  }, []);

  // 3D Parallax Tilt Effect
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    // Tilt slightly towards cursor
    setRotation({ 
      x: -y * 20, // max 10deg tilt
      y: x * 20 
    });
  };

  const resetRotation = () => setRotation({ x: 0, y: 0 });

  return (
    <div 
      className={`coach-perspective-container ${isFixed ? "is-fixed" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetRotation}
    >
      <div 
        ref={containerRef}
        className={`coach-3d-wrapper coach-${state || "idle"} ${isSpeaking ? "is-speaking" : ""}`}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          "--hologram-glow": themeColor
        }}
      >
        {/* Hologram Pedestal / Base */}
        <div className="hologram-pedestal">
          <div className="pedestal-glow"></div>
          <div className="pedestal-ring"></div>
        </div>

        {/* Feedback Bubble */}
        {text && (
          <div className="coach-bubble-3d">
            <div className="bubble-content-3d">
              {text}
            </div>
          </div>
        )}

        {/* Avatar Frame */}
        <div className="avatar-frame-3d">
          <div className="avatar-glow-3d"></div>
          <div className="avatar-scanlines"></div>
          
          <div className="avatar-image-container-3d">
            <img 
              src={visualGender === "male" ? coachMaleImg : coachFemaleImg} 
              alt="AI Coach" 
              className="avatar-img-3d" 
            />
            {isSpeaking && <div className="mouth-sync-3d"></div>}
          </div>
          
          {/* Status Indicator Dot */}
          <div className="status-indicator-3d"></div>
        </div>
      </div>
    </div>
  );
}
