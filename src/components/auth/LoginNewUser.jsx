import { useNavigate } from "react-router-dom";

export default function LoginNewUser() {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <h1>Welcome 👋</h1>
      <p>New User Login</p>

      <button onClick={() => navigate("/workout")}>
        Start Workout
      </button>
    </div>
  );
}
