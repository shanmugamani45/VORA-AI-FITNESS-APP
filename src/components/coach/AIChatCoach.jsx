import { speak } from "../../utils/voice";

export default function AIChatCoach() {
  const handleClick = () => {
    const msg = "Keep your back straight and knees outward.";
    speak(msg);
    alert(msg);
  };

  return (
    <button onClick={handleClick}>
      Ask AI Coach
    </button>
  );
}
