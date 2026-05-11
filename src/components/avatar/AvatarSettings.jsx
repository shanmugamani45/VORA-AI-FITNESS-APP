import { useEffect, useState } from "react";
import { useAvatarStore } from "../../store/useAvatarStore";
import "./AvatarSettings.css";

const THEME_COLORS = [
  { id: "blue", hex: "#00d2ff", name: "Cyber Blue" },
  { id: "green", hex: "#00b894", name: "Matrix Green" },
  { id: "red", hex: "#ff3b3b", name: "Sith Red" },
  { id: "pink", hex: "#fd79a8", name: "Neon Pink" },
  { id: "orange", hex: "#fdcb6e", name: "Solar Orange" }
];

export default function AvatarSettings() {
  const { 
    visualGender, setVisualGender,
    voiceURI, setVoiceURI,
    themeColor, setThemeColor,
    personality, setPersonality,
    verbosity, setVerbosity
  } = useAvatarStore();

  const [availableVoices, setAvailableVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      let voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const testVoice = (uri) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("This is my voice. I am ready to analyze your reps.");
    
    utterance.rate = personality === "drill_sergeant" ? 1.2 : 1.0;
    utterance.pitch = personality === "drill_sergeant" ? 0.9 : 1.0;
    
    const target = availableVoices.find(v => v.voiceURI === uri);
    if (target) utterance.voice = target;
    
    window.speechSynthesis.speak(utterance);
    setVoiceURI(uri);
  };

  return (
    <div className="avatar-settings-container" style={{ "--theme-color": themeColor }}>
      <header className="avatar-header">
        <h1>👤 Avatar <span style={{ color: themeColor }}>Settings</span></h1>
        <p>Architect your personalized holographic AI trainer's aesthetic and behavioral logic.</p>
      </header>

      <div className="settings-grid">
        
        {/* Hologram Appearance */}
        <section className="settings-section">
          <h2 className="section-title"><span>1</span> Visual Model</h2>
          <div className="card-group">
            <div 
              className={`option-card ${visualGender === "female" ? "active" : ""}`}
              onClick={() => setVisualGender("female")}
            >
               <span className="emoji-hero">👩‍🎤</span>
               <h3>Female Hologram</h3>
               <p>The original athletic build AI coach.</p>
            </div>
            <div 
              className={`option-card ${visualGender === "male" ? "active" : ""}`}
              onClick={() => setVisualGender("male")}
            >
               <span className="emoji-hero">👨‍🎤</span>
               <h3>Male Hologram</h3>
               <p>A sleeker muscular build AI baseline.</p>
            </div>
          </div>
        </section>

        {/* Hologram Theme */}
        <section className="settings-section">
          <h2 className="section-title"><span>2</span> Hologram Aura</h2>
          <div className="swatch-group">
            {THEME_COLORS.map(color => (
              <div 
                key={color.id}
                onClick={() => setThemeColor(color.hex)}
                className={`theme-swatch ${themeColor === color.hex ? "active" : ""}`}
                style={{
                  backgroundColor: color.hex,
                  boxShadow: themeColor === color.hex ? `0 0 25px ${color.hex}, inset 0 2px 10px rgba(255,255,255,0.4)` : "inset 0 2px 10px rgba(255,255,255,0.2)",
                }}
                title={color.name}
              />
            ))}
          </div>
        </section>

        {/* Voice Selection */}
        <section className="settings-section">
          <h2 className="section-title"><span>3</span> Synthetic Vocal Matrix</h2>
          <p style={{ opacity: 0.6, fontSize: "0.95rem", marginBottom: "20px", marginTop: "-15px" }}>
            Connecting direct to your operating system's native voice neural engines.
          </p>
          <div className="voice-control-group">
            <select 
              value={voiceURI}
              onChange={(e) => testVoice(e.target.value)}
              className="voice-select"
            >
              <option value="" disabled>Select a system voice integration...</option>
              {availableVoices.map(v => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
            <button 
              onClick={() => testVoice(voiceURI)} 
              className="btn-test-voice"
            >
              Test Voice 🔊
            </button>
          </div>
        </section>

        {/* Personality */}
        <section className="settings-section">
          <h2 className="section-title"><span>4</span> Coaching Persona</h2>
          <div className="card-group">
            <div className={`option-card ${personality === "supportive" ? "active" : ""}`} onClick={() => setPersonality("supportive")}>
               <span className="emoji-hero" style={{ fontSize: "3rem" }}>🌟</span>
               <h3>Supportive Motivation</h3>
               <p>Encouraging, gentle, focuses on positive reinforcement.</p>
            </div>
            <div className={`option-card ${personality === "drill_sergeant" ? "active" : ""}`} onClick={() => setPersonality("drill_sergeant")}>
               <span className="emoji-hero" style={{ fontSize: "3rem" }}>🔥</span>
               <h3>Drill Sergeant</h3>
               <p>Loud, commanding, aggressive motivation to push limits.</p>
            </div>
            <div className={`option-card ${personality === "analytical" ? "active" : ""}`} onClick={() => setPersonality("analytical")}>
               <span className="emoji-hero" style={{ fontSize: "3rem" }}>🤖</span>
               <h3>Robotic & Analytical</h3>
               <p>Hyper-precise raw data, mathematical and technical feedback.</p>
            </div>
          </div>
        </section>

        {/* Verbosity */}
        <section className="settings-section">
          <h2 className="section-title"><span>5</span> Feedback Verbosity</h2>
          <div className="card-group">
            <div className={`option-card ${verbosity === "chatty" ? "active" : ""}`} onClick={() => setVerbosity("chatty")}>
               <span className="emoji-hero" style={{ fontSize: "3rem" }}>💬</span>
               <h3>Chatty / Active</h3>
               <p>Frequent rep tracking, counts aloud, and active engagement.</p>
            </div>
            <div className={`option-card ${verbosity === "quiet" ? "active" : ""}`} onClick={() => setVerbosity("quiet")}>
               <span className="emoji-hero" style={{ fontSize: "3rem" }}>🤫</span>
               <h3>Quiet Focus</h3>
               <p>Muted chatter. Only interrupts for critical safety or posture flaws.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
