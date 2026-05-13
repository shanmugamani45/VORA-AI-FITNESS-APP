import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginNewUser from "../components/auth/LoginNewUser";
import LoginReturningUser from "../components/auth/LoginReturningUser";
import WorkoutScreen from "../components/workout/WorkoutScreen";
import DashboardLayout from "../components/layout/DashboardLayout";
import Home from "../components/dashboard/Home";
import BMICalculator from "../components/dashboard/BMICalculator";
import AiChatbot from "../components/dashboard/AiChatbot";
import Achievements from "../components/dashboard/Achievements";

import PhotoStudio from "../components/studio/PhotoStudio";
import AvatarSettings from "../components/avatar/AvatarSettings";

export default function RoutesConfig() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginNewUser />} />
        <Route path="/login" element={<LoginReturningUser />} />
        
        {/* Authenticated Routes with Sidebar */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/workout" element={<WorkoutScreen />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/avatar" element={<AvatarSettings />} />
          <Route path="/chatbot" element={<AiChatbot />} />
          <Route path="/bmi" element={<BMICalculator />} />
          <Route path="/photo-studio" element={<PhotoStudio />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
