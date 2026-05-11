import { useState } from "react";

const CATEGORIES = [
  { label: "Underweight", min: 0, max: 18.5, color: "#fdcb6e" }, // Yellow/Gold
  { label: "Normal", min: 18.5, max: 25, color: "#00b894" },    // Green
  { label: "Overweight", min: 25, max: 30, color: "#e17055" },   // Orange
  { label: "Obesity", min: 30, max: 100, color: "#d63031" },    // Red
];

export default function BMICalculator() {
  const [unit, setUnit] = useState("us"); // 'us' or 'metric'
  const [inputs, setInputs] = useState({ age: 25, gender: "male", feet: 5, inches: 10, weight: 160, cm: 175, kg: 70 });
  const [result, setResult] = useState(null);

  const calculateBMI = () => {
    let bmiValue;
    if (unit === "us") {
      const totalInches = parseFloat(inputs.feet) * 12 + parseFloat(inputs.inches);
      bmiValue = (parseFloat(inputs.weight) / (totalInches * totalInches)) * 703;
    } else {
      const meters = parseFloat(inputs.cm) / 100;
      bmiValue = parseFloat(inputs.kg) / (meters * meters);
    }

    const rounded = Math.round(bmiValue * 10) / 10;
    const Category = CATEGORIES.find(c => rounded < c.max) || CATEGORIES[CATEGORIES.length - 1];
    
    setResult({ bmi: rounded, ...Category });
  };

  const handleInputChange = (e) => setInputs({ ...inputs, [e.target.name]: e.target.value });

  return (
    <div style={{ padding: "40px", animation: "fadeIn 0.6s ease", color: "white" }}>
      <header style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.8rem", marginBottom: "10px", fontWeight: "800" }}>
           Visual <span style={{ color: "#ff3b3b" }}>BMI</span> Calculator
        </h1>
        <p style={{ opacity: 0.7, fontSize: "1.1rem" }}>Premium health tracking for your AI Fitness journey.</p>
      </header>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1.2fr", 
        gap: "40px",
        alignItems: "start" 
      }}>
        
        {/* LEFT PANEL: INPUTS */}
        <div className="glass-card" style={cardStyle}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
            {["us", "metric"].map(u => (
              <button 
                key={u}
                onClick={() => setUnit(u)}
                style={{
                  flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)",
                  background: unit === u ? "#ff3b3b" : "rgba(255,255,255,0.05)",
                  color: "#fff", cursor: "pointer", fontWeight: "bold", textTransform: "uppercase",
                  transition: "all 0.3s"
                }}
              >
                {u === "us" ? "US Units" : "Metric Units"}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gap: "20px" }}>
            <div>
              <label style={labelStyle}>Age</label>
              <input type="number" name="age" value={inputs.age} onChange={handleInputChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Gender</label>
              <div style={{ display: "flex", gap: "20px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input type="radio" name="gender" value="male" checked={inputs.gender === "male"} onChange={handleInputChange} style={{ accentColor: "#ff3b3b" }} /> Male
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input type="radio" name="gender" value="female" checked={inputs.gender === "female"} onChange={handleInputChange} style={{ accentColor: "#ff3b3b" }} /> Female
                </label>
              </div>
            </div>

            {unit === "us" ? (
              <>
                <div style={{ display: "flex", gap: "15px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Height (Feet)</label>
                    <input type="number" name="feet" value={inputs.feet} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Height (Inches)</label>
                    <input type="number" name="inches" value={inputs.inches} onChange={handleInputChange} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Weight (lb)</label>
                  <input type="number" name="weight" value={inputs.weight} onChange={handleInputChange} style={inputStyle} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label style={labelStyle}>Height (cm)</label>
                  <input type="number" name="cm" value={inputs.cm} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Weight (kg)</label>
                  <input type="number" name="kg" value={inputs.kg} onChange={handleInputChange} style={inputStyle} />
                </div>
              </>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button 
                onClick={calculateBMI} 
                style={{ flex: 2, padding: "16px", background: "#ff3b3b", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "1rem", boxShadow: "0 10px 30px rgba(255, 59, 59, 0.3)" }}
              >
                Calculate Results ↗
              </button>
              <button 
                onClick={() => setResult(null)}
                style={{ flex: 1, padding: "16px", background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", cursor: "pointer" }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: VISUAL RESULTS */}
        <div className="glass-card" style={{ ...cardStyle, textAlign: "center", minHeight: "500px", display: "flex", flexDirection: "column", padding: "40px" }}>
          {result ? (
            <div style={{ animation: "slideUp 0.5s ease" }}>
              <h3 style={{ color: "#ff3b3b", fontSize: "1.4rem", marginBottom: "15px", fontWeight: "600" }}>Your BMI is</h3>
              <div style={{ fontSize: "4.5rem", fontWeight: "900", color: "#fff", marginBottom: "40px", letterSpacing: "-2px" }}>
                 {result.bmi}
              </div>

              <BMILinearChart value={result.bmi} />

              <div style={{ marginTop: "60px", padding: "24px", background: "rgba(255,255,255,0.03)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ margin: 0, opacity: 0.8, fontSize: "1rem", lineHeight: "1.6" }}>
                   You are currently in the <strong style={{ color: result.color }}>{result.label}</strong> category. 
                   Maintaining a BMI between <strong>18.5 – 25</strong> is generally considered ideal for long-term health.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ opacity: 0.3, margin: "auto" }}>
              <div style={{ fontSize: "6rem", marginBottom: "20px" }}>📊</div>
              <h3 style={{ fontSize: "1.5rem" }}>Awaiting Data</h3>
              <p>Calculate your BMI to see your linear visual health report.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

function BMILinearChart({ value }) {
  // Logic to calculate position on standard 4-segment equal-width bar
  const getPosition = (val) => {
    if (val < 18.5) return (Math.max(15, val) - 15) / (18.5 - 15) * 25;
    if (val < 25) return 25 + (val - 18.5) / (25 - 18.5) * 25;
    if (val < 30) return 50 + (val - 25) / (30 - 25) * 25;
    return 75 + Math.min(1, (val - 30) / 10) * 25;
  };

  const pos = getPosition(value);

  return (
    <div style={{ position: "relative", width: "100%", padding: "20px 0 40px" }}>
      {/* Indicator Pylon */}
      <div style={{ 
        position: "absolute", 
        left: `${pos}%`, 
        top: "-15px", 
        bottom: "35px",
        width: "6px",
        height: "55px",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 0 15px #fff",
        transition: "left 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        zIndex: 10,
        transform: "translateX(-50%)"
      }}>
         <div style={{ 
            position: "absolute", 
            bottom: "-8px", 
            left: "50%", 
            transform: "translateX(-50%)", 
            width: "0", 
            height: "0", 
            borderLeft: "6px solid transparent", 
            borderRight: "6px solid transparent", 
            borderTop: "8px solid #fff" 
         }}></div>
      </div>

      {/* The Color Bar */}
      <div style={{ display: "flex", width: "100%", height: "18px", borderRadius: "50px", overflow: "hidden", gap: "4px" }}>
        {CATEGORIES.map(cat => (
          <div key={cat.label} style={{ 
            flex: 1, 
            background: cat.color, 
            opacity: 0.9,
            boxShadow: `0 0 15px ${cat.color}33`,
            position: "relative"
          }} />
        ))}
      </div>

      {/* Labels */}
      <div style={{ display: "flex", width: "100%", marginTop: "15px" }}>
        {CATEGORIES.map(cat => (
          <div key={cat.label} style={{ 
            flex: 1, 
            fontSize: "0.85rem", 
            fontStyle: "italic", 
            opacity: 0.6, 
            textAlign: "center",
            fontWeight: "500"
          }}>
            {cat.label}
          </div>
        ))}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "rgba(255, 255, 255, 0.03)",
  backdropFilter: "blur(25px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  padding: "40px",
  borderRadius: "24px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.4)"
};

const labelStyle = { display: "block", marginBottom: "8px", opacity: 0.6, fontWeight: "600", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" };
const inputStyle = { width: "100%", padding: "14px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", outline: "none", fontSize: "1.05rem", transition: "border-color 0.2s" };
