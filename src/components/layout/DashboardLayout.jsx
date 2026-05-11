import { Outlet } from "react-router-dom";
import Sidebar from "../ui/Sidebar";

export default function DashboardLayout() {
  return (
    <div style={{ 
      display: "flex", 
      minHeight: "100vh", 
      background: "#0a0a0c", 
      color: "white",
      overflow: "hidden"
    }}>
      <Sidebar />
      
      <main style={{ 
        flex: 1, 
        height: "100vh",
        overflowY: "auto",
        position: "relative",
        background: "radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0a0a0c 100%)"
      }}>
        {/* Decorative background glow */}
        <div style={{
           position: "absolute",
           top: "-10%",
           right: "-10%",
           width: "500px",
           height: "500px",
           background: "rgba(255, 59, 59, 0.03)",
           filter: "blur(150px)",
           pointerEvents: "none",
           zIndex: 0
        }}></div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
