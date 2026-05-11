export default function AiChatbot() {
  const chatbotUrl = "https://ai-fitness-chatbot-version-2.vercel.app";

  return (
    <div style={{ 
      padding: "20px", 
      height: "calc(100vh - 40px)", 
      display: "flex", 
      flexDirection: "column",
      animation: "fadeIn 0.5s ease" 
    }}>
      <header style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "15px" }}>
        <div style={{ padding: "10px", background: "rgba(255, 59, 59, 0.1)", borderRadius: "12px", border: "1px solid rgba(255, 59, 59, 0.2)" }}>
           <span style={{ fontSize: "1.2rem" }}>🤖</span>
        </div>
        <div>
          <h1 style={{ fontSize: "1.5rem", margin: 0 }}>AI Fitness <span style={{ color: "#ff3b3b" }}>Coach</span></h1>
          <p style={{ margin: 0, opacity: 0.6, fontSize: "0.85rem" }}>Powered by AI Fit Intelligence</p>
        </div>
      </header>

      <div style={{ 
        flex: 1, 
        background: "rgba(255, 255, 255, 0.02)", 
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
        position: "relative"
      }}>
        <iframe 
          src={chatbotUrl}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            background: "transparent"
          }}
          title="AI Fitness Chatbot"
          allow="microphone; camera"
          loading="lazy"
        />
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
