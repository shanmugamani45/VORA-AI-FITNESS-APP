import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const MENU_ITEMS = [
  { id: "home", label: "Home", path: "/dashboard", icon: "🏠" },
  { id: "workout", label: "Start Workout", path: "/workout", icon: "🏋️" },
  { id: "achievement", label: "Achievement", path: "/achievements", icon: "🏆" },
  { id: "avatar", label: "Avatar", path: "/avatar", icon: "👤" },
  { id: "chatbot", label: "AI Chatbot", path: "/chatbot", icon: "🤖" },
  { id: "bmi", label: "BMI Calculator", path: "/bmi", icon: "📊" },
  { id: "gallery", label: "Gym Photo Studio", path: "/photo-studio", icon: "📸" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
           <span className="logo-icon">🔥</span>
           <span className="logo-text">VORA</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {MENU_ITEMS.map((item) => {
          const isExternal = item.path.startsWith("http");
          
          if (isExternal) {
            return (
              <a 
                key={item.id} 
                href={item.path} 
                target="_blank" 
                rel="noopener noreferrer"
                className="nav-item"
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </a>
            );
          }

          return (
            <NavLink 
              key={item.id} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/login" className="nav-item logout">
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </NavLink>
      </div>
    </aside>
  );
}
