import { useEffect, useRef, useState } from "react";
import "./WorkoutScreen.css";
import PoseCanvas from "./PoseCanvas";
import VirtualCoach from "../coach/VirtualCoach";
import { analyzeBicepCurl, resetBicepCurl } from "../../utils/bicepCurlLogic_v2";
import { analyzeSquat, resetSquat } from "../../utils/squatLogic";
import { analyzePushup, resetPushup } from "../../utils/pushupLogic";
import { analyzeOverheadPress, resetOverheadPress } from "../../utils/overheadPressLogic";
import { analyzeLateralRaise, resetLateralRaise } from "../../utils/lateralRaiseLogic";
import { analyzeLunge, resetLunge } from "../../utils/lungeLogic";
import { analyzeFrontRaise, resetFrontRaise } from "../../utils/frontRaiseLogic";
import { analyzeCalfRaise, resetCalfRaise } from "../../utils/calfRaiseLogic";
import { analyzeShoulderShrug, resetShoulderShrug } from "../../utils/shoulderShrugLogic";
import { analyzeJumpingJack, resetJumpingJack } from "../../utils/jumpingJackLogic";
import { analyzeHighKnees, resetHighKnees } from "../../utils/highKneesLogic";
import { analyzeDeadlift, resetDeadlift } from "../../utils/deadliftLogic";
import { analyzeCrunch, resetCrunch } from "../../utils/crunchLogic";
import { analyzeGluteBridge, resetGluteBridge } from "../../utils/gluteBridgeLogic";
import { analyzeTricepExtension, resetTricepExtension } from "../../utils/tricepExtensionLogic";
import { analyzeLegRaise, resetLegRaise } from "../../utils/legRaiseLogic";
import { speak } from "../../utils/voice";
import { achievementService } from "../../utils/achievementService";

const EXERCISES = {
  BICEP_CURL: {
    id: "BICEP_CURL",
    name: "Bicep Curl",
    icon: "🏋️",
    analyze: analyzeBicepCurl,
    reset: resetBicepCurl,
  },
  SQUAT: {
    id: "SQUAT",
    name: "Squat",
    icon: "🦵",
    analyze: analyzeSquat,
    reset: resetSquat,
  },
  PUSHUP: {
    id: "PUSHUP",
    name: "Pushup",
    icon: "💪",
    analyze: analyzePushup,
    reset: resetPushup,
  },
  OVERHEAD_PRESS: {
    id: "OVERHEAD_PRESS",
    name: "Overhead Press",
    icon: "⬆️",
    analyze: analyzeOverheadPress,
    reset: resetOverheadPress,
  },
  LATERAL_RAISE: {
    id: "LATERAL_RAISE",
    name: "Lateral Raise",
    icon: "↔️",
    analyze: analyzeLateralRaise,
    reset: resetLateralRaise,
  },
  LUNGE: {
    id: "LUNGE",
    name: "Lunge",
    icon: "🏃",
    analyze: analyzeLunge,
    reset: resetLunge,
  },
  FRONT_RAISE: {
    id: "FRONT_RAISE",
    name: "Front Raise",
    icon: "⏫",
    analyze: analyzeFrontRaise,
    reset: resetFrontRaise,
  },
  CALF_RAISE: {
    id: "CALF_RAISE",
    name: "Calf Raise",
    icon: "🧦",
    analyze: analyzeCalfRaise,
    reset: resetCalfRaise,
  },
  SHOULDER_SHRUG: {
    id: "SHOULDER_SHRUG",
    name: "Shoulder Shrug",
    icon: "🤷",
    analyze: analyzeShoulderShrug,
    reset: resetShoulderShrug,
  },
  JUMPING_JACK: {
    id: "JUMPING_JACK",
    name: "Jumping Jack",
    icon: "🤸",
    analyze: analyzeJumpingJack,
    reset: resetJumpingJack,
  },
  HIGH_KNEES: {
    id: "HIGH_KNEES",
    name: "High Knees",
    icon: "🦵",
    analyze: analyzeHighKnees,
    reset: resetHighKnees,
  },
  DEADLIFT: {
    id: "DEADLIFT",
    name: "Deadlift (RDL)",
    icon: "🏗️",
    analyze: analyzeDeadlift,
    reset: resetDeadlift,
  },
  CRUNCH: {
    id: "CRUNCH",
    name: "Crunch",
    icon: "🛌",
    analyze: analyzeCrunch,
    reset: resetCrunch,
  },
  GLUTE_BRIDGE: {
    id: "GLUTE_BRIDGE",
    name: "Glute Bridge",
    icon: "🌉",
    analyze: analyzeGluteBridge,
    reset: resetGluteBridge,
  },
  TRICEP_EXTENSION: {
    id: "TRICEP_EXTENSION",
    name: "Tricep Extension",
    icon: "💪",
    analyze: analyzeTricepExtension,
    reset: resetTricepExtension,
  },
  LEG_RAISE: {
    id: "LEG_RAISE",
    name: "Leg Raise",
    icon: "🆙",
    analyze: analyzeLegRaise,
    reset: resetLegRaise,
  },
};

const miniBtnStyle = {
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.2)",
  color: "white",
  width: "24px",
  height: "24px",
  borderRadius: "6px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "bold",
  transition: "all 0.2s"
};

export default function WorkoutScreen() {
  const [routine, setRoutine] = useState([{ id: Date.now(), exerciseId: "BICEP_CURL", sets: 3, reps: 10 }]);
  const [currentRoutineIndex, setCurrentRoutineIndex] = useState(0);
  const [isTransitioningExercise, setIsTransitioningExercise] = useState(false);

  const [isAddRoutineModalOpen, setIsAddRoutineModalOpen] = useState(false);
  const [modalExerciseId, setModalExerciseId] = useState("BICEP_CURL");
  const [modalSets, setModalSets] = useState(3);
  const [modalReps, setModalReps] = useState(10);

  const activeBlock = routine[currentRoutineIndex] || routine[0];
  const selectedExercise = EXERCISES[activeBlock.exerciseId] || EXERCISES.BICEP_CURL;
  const targetSets = activeBlock.sets;
  const targetReps = activeBlock.reps;

  const [reps, setReps] = useState(0);
  const [isRepAnimating, setIsRepAnimating] = useState(false);
  const [formScore, setFormScore] = useState(100);
  const [danger, setDanger] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const cameraWrapperRef = useRef(null);

  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);

  const [coachText, setCoachText] = useState("Ready");
  const [coachState, setCoachState] = useState("idle");

  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);

  const [duration, setDuration] = useState(0);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);

  const totalFormRef = useRef(0);
  const repCountRef = useRef(0);
  const globalRepsRef = useRef(0);
  const globalFormRef = useRef(0);
  const lastFeedbackRef = useRef("");

  // -----------------------------
  // START WORKOUT
  // -----------------------------
  const startWorkout = () => {
    selectedExercise.reset();
    setSessionStarted(true);
    setSessionEnded(false);

    setReps(0);
    setCurrentSet(1);
    setCurrentRoutineIndex(0);
    setIsResting(false);
    setIsTransitioningExercise(false);
    setFormScore(100);
    setDanger(0);

    repCountRef.current = 0;
    totalFormRef.current = 0;
    globalRepsRef.current = 0;
    globalFormRef.current = 0;
    lastFeedbackRef.current = "";

    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    setCoachText("Let's go!");
    setCoachState("good");
    speak(`Started ${selectedExercise.name}. Let's make every rep count!`);
  };

  // -----------------------------
  // END WORKOUT
  // -----------------------------
  const endWorkout = () => {
    setSessionEnded(true);
    setSessionStarted(false);

    clearInterval(timerRef.current);
    achievementService.saveSession(selectedExercise.id, reps);

    setCoachText("Workout complete");
    setCoachState("idle");
    speak("Workout complete. Review your session metrics.");
  };

  // -----------------------------
  // HANDLE POSE DATA
  // -----------------------------
  const handlePose = (landmarks) => {
    if (!sessionStarted || sessionEnded || isResting || isTransitioningExercise) return;

    const result = selectedExercise.analyze(landmarks);
    if (!result) return;

    // REP COUNT (Strict Check)
    if (result.repIncrement) {
      repCountRef.current += 1;
      globalRepsRef.current += 1;
      setReps(repCountRef.current);
      setIsRepAnimating(true);
      setTimeout(() => setIsRepAnimating(false), 400);
      
      totalFormRef.current += result.formScore;
      globalFormRef.current += result.formScore;
      setFormScore(result.formScore);

      if (repCountRef.current >= targetReps) {
        setIsResting(true);
        if (currentSet >= targetSets) {
          if (currentRoutineIndex < routine.length - 1) {
            setIsTransitioningExercise(true);
            const nextExerciseId = routine[currentRoutineIndex + 1].exerciseId;
            const nextExerciseName = EXERCISES[nextExerciseId].name;
            speak(`Exercise complete! Up next: ${nextExerciseName}. Let me know when you are ready.`);
            setCoachText(`Up next: ${nextExerciseName}`);
            setCoachState("idle");
          } else {
            speak("Protocol complete! Outstanding work.");
            endWorkout();
          }
        } else {
          speak(`Set ${currentSet} complete. Take a breather.`);
          setCoachText(`Set ${currentSet} complete.`);
          setCoachState("idle");
        }
      } else {
        setCoachText(result.feedbackText || `Rep ${repCountRef.current}`);
        setCoachState("good");
        speak(result.feedbackText || `Rep ${repCountRef.current}`);
      }
    }

    // CONTINUOUS FORM FEEDBACK
    if (!result.repIncrement && result.feedbackText && result.feedbackText !== lastFeedbackRef.current) {
      setCoachText(result.feedbackText);
      setCoachState(result.feedbackState);

      if (result.feedbackState === "bad") {
        speak(result.feedbackText);
        lastFeedbackRef.current = result.feedbackText;
        setTimeout(() => {
          if (lastFeedbackRef.current === result.feedbackText) lastFeedbackRef.current = "";
        }, 3000);
      }
    }

    if (typeof result.danger === "number") {
      setDanger(result.danger);
    }
  };

  const updateRoutineBlock = (index, field, value) => {
    const newRoutine = [...routine];
    newRoutine[index][field] = value;
    setRoutine(newRoutine);
  };

  const addRoutineBlock = () => {
    setRoutine([...routine, { id: Date.now(), exerciseId: modalExerciseId, sets: modalSets, reps: modalReps }]);
    setIsAddRoutineModalOpen(false);
  };

  const removeRoutineBlock = (index) => {
    if (routine.length <= 1) return;
    setRoutine(routine.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && cameraWrapperRef.current) {
      cameraWrapperRef.current.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable full-screen mode:", err.message);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const averageForm =
    globalRepsRef.current === 0
      ? 0
      : Math.round(globalFormRef.current / globalRepsRef.current);

  return (
    <div className="workout-screen-container">
      <header className="workout-header">
        <div className="workout-title">
          <span>{selectedExercise.icon}</span>
          <h1>{selectedExercise.name}</h1>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "flex-end", alignItems: "center" }}>
          {!sessionStarted && <span style={{ opacity: 0.5, fontSize: "0.9rem", marginRight: "10px", fontWeight: "bold" }}>CURRENTLY ACTIVE:</span>}
          
          <div className="exercise-selector-wrapper">
            <label>Sets:</label>
            <input 
              type="number" min="1" max="10" 
              value={routine[currentRoutineIndex].sets} 
              onChange={e => updateRoutineBlock(currentRoutineIndex, 'sets', parseInt(e.target.value) || 1)} 
              disabled={sessionStarted} 
              className="settings-input" 
            />
          </div>
          
          <div className="exercise-selector-wrapper">
            <label>Reps:</label>
            <input 
              type="number" min="1" max="100" 
              value={routine[currentRoutineIndex].reps} 
              onChange={e => updateRoutineBlock(currentRoutineIndex, 'reps', parseInt(e.target.value) || 1)} 
              disabled={sessionStarted} 
              className="settings-input" 
            />
          </div>

          <div className="exercise-selector-wrapper">
            <select
              value={routine[currentRoutineIndex].exerciseId}
              onChange={e => updateRoutineBlock(currentRoutineIndex, 'exerciseId', e.target.value)}
              disabled={sessionStarted}
              className="exercise-select"
            >
              {Object.values(EXERCISES).map(ex => (
                <option key={ex.id} value={ex.id}>{ex.icon} {ex.name}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div className="workout-grid">
        <div className="left-column" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div 
            ref={cameraWrapperRef}
            className="camera-container" 
          style={{ "--form-color": sessionStarted ? (formScore > 85 ? "rgba(0, 184, 148, 0.4)" : formScore > 60 ? "rgba(253, 203, 110, 0.4)" : "rgba(214, 48, 49, 0.5)") : "transparent" }}
        >
          <PoseCanvas onPose={handlePose} />
          
          <button 
            onClick={toggleFullscreen}
            className="btn-fullscreen"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? "✖" : "⛶"}
          </button>

          {isTransitioningExercise && (
            <div className="start-session-overlay">
              <div style={{ textAlign: "center" }}>
                <h2 style={{ fontSize: "3rem", marginBottom: "10px", textShadow: "0 5px 20px rgba(0,0,0,0.8)" }}>
                  Exercise Complete! <span style={{ color: "#00b894" }}>✔</span>
                </h2>
                <p style={{ fontSize: "1.5rem", marginBottom: "30px", opacity: 0.8 }}>
                  Up next: <strong style={{ color: "#00d2ff" }}>{EXERCISES[routine[currentRoutineIndex + 1].exerciseId].name}</strong>
                </p>
                <button
                  onClick={() => {
                    setCurrentRoutineIndex(prev => prev + 1);
                    setCurrentSet(1);
                    setReps(0);
                    repCountRef.current = 0;
                    setIsResting(false);
                    setIsTransitioningExercise(false);
                    speak(`Starting ${EXERCISES[routine[currentRoutineIndex + 1].exerciseId].name}. Let's go!`);
                  }}
                  className="btn-start-session"
                >
                  ▶ Start Next Exercise
                </button>
              </div>
            </div>
          )}

          {!isTransitioningExercise && isResting && (
            <div className="start-session-overlay">
              <div style={{ textAlign: "center" }}>
                <h2 style={{ fontSize: "3rem", marginBottom: "30px", textShadow: "0 5px 20px rgba(0,0,0,0.8)" }}>
                  Set {currentSet} Complete! <span style={{ color: "#00d2ff" }}>💪</span>
                </h2>
                <button
                  onClick={() => {
                    setCurrentSet(prev => prev + 1);
                    setReps(0);
                    repCountRef.current = 0;
                    setIsResting(false);
                    speak(`Starting Set ${currentSet + 1}. Let's go!`);
                  }}
                  className="btn-start-session"
                >
                  ▶ Start Set {currentSet + 1}
                </button>
              </div>
            </div>
          )}
        </div>

          {/* Action Bar */}
          <div style={{ display: "flex", gap: "20px" }}>
            <button
              onClick={sessionStarted ? undefined : startWorkout}
              className="btn-start-session"
              style={{
                flex: 1,
                padding: "12px 20px",
                fontSize: "1.1rem",
                opacity: sessionStarted ? 0.4 : 1,
                cursor: sessionStarted ? "not-allowed" : "pointer",
                filter: sessionStarted ? "grayscale(1)" : "none",
                transform: "none",
                borderRadius: "16px",
                whiteSpace: "nowrap"
              }}
              disabled={sessionStarted}
            >
              ▶ Start Workout
            </button>
            <button
              onClick={!sessionStarted ? undefined : endWorkout}
              className="btn-end-workout"
              style={{
                flex: 1,
                padding: "12px 20px",
                fontSize: "1.1rem",
                opacity: !sessionStarted ? 0.4 : 1,
                cursor: !sessionStarted ? "not-allowed" : "pointer",
                width: "auto",
                whiteSpace: "nowrap"
              }}
              disabled={!sessionStarted}
            >
              ⏹ End Workout
            </button>
          </div>

          {/* Queue List Below Action Bar */}
          {routine.length - 1 > currentRoutineIndex && (
            <div style={{ marginTop: "10px" }}>
              <h3 style={{ margin: "0 0 15px 0", fontSize: "0.9rem", color: "#a2b0c6", opacity: 0.8, letterSpacing: "1px" }}>
                UP NEXT IN PLAYLIST
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {routine.slice(currentRoutineIndex + 1).map((block, relativeIndex) => {
                  const actualIndex = currentRoutineIndex + 1 + relativeIndex;
                  return (
                    <div key={block.id} style={{ display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.2)", padding: "15px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <span style={{ background: "rgba(0,210,255,0.1)", color: "#00d2ff", padding: "4px 8px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: "bold" }}>#{actualIndex + 1}</span>
                        <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{EXERCISES[block.exerciseId].name}</span>
                      </div>
                      
                      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                           <span style={{ opacity: 0.6, fontSize: "0.8rem" }}>SETS</span>
                           {!sessionStarted && <button onClick={() => updateRoutineBlock(actualIndex, "sets", Math.max(1, block.sets - 1))} style={miniBtnStyle}>-</button>}
                           <span style={{ fontWeight: "bold", minWidth: "20px", textAlign: "center" }}>{block.sets}</span>
                           {!sessionStarted && <button onClick={() => updateRoutineBlock(actualIndex, "sets", block.sets + 1)} style={miniBtnStyle}>+</button>}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                           <span style={{ opacity: 0.6, fontSize: "0.8rem" }}>REPS</span>
                           {!sessionStarted && <button onClick={() => updateRoutineBlock(actualIndex, "reps", Math.max(1, block.reps - 1))} style={miniBtnStyle}>-</button>}
                           <span style={{ fontWeight: "bold", minWidth: "20px", textAlign: "center" }}>{block.reps}</span>
                           {!sessionStarted && <button onClick={() => updateRoutineBlock(actualIndex, "reps", block.reps + 1)} style={miniBtnStyle}>+</button>}
                        </div>
                        
                        {!sessionStarted && (
                          <button 
                            onClick={() => removeRoutineBlock(actualIndex)}
                            style={{ background: "transparent", border: "none", color: "rgba(255,118,117,0.7)", cursor: "pointer", padding: "5px", fontSize: "1.2rem", transition: "0.2s" }}
                            title="Remove from queue"
                          >
                            ✖
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!sessionStarted && (
             <div style={{ marginTop: "10px", textAlign: "center" }}>
               <button 
                  onClick={() => setIsAddRoutineModalOpen(true)}
                  style={{ background: "rgba(0, 210, 255, 0.05)", border: "1px dashed rgba(0, 210, 255, 0.3)", color: "#00d2ff", borderRadius: "12px", padding: "18px", cursor: "pointer", width: "100%", fontSize: "0.95rem", fontWeight: "bold", letterSpacing: "1px", transition: "all 0.3s" }}
                >
                  + ADD EXERCISE TO PLAYLIST
                </button>
             </div>
          )}
        </div>

        <div className="right-column">
          {!sessionEnded ? (
            <div className="stats-panel">
              <h3 className="stats-header">Real-time Metrics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Routine Progress</span>
                  <div className="stat-value" style={{ color: "#00d2ff", fontSize: "1.5rem", marginTop: "10px" }}>{currentRoutineIndex + 1} / {routine.length}</div>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Set</span>
                  <div className="stat-value" style={{ 
                    color: sessionStarted ? "#00d2ff" : "#a2b0c6", 
                    fontSize: "2rem", 
                    marginTop: "10px",
                    textShadow: sessionStarted ? "0 0 10px rgba(0, 210, 255, 0.3)" : "none"
                  }}>
                    {currentSet} <span style={{ fontSize: "1rem", opacity: 0.5 }}>/ {targetSets}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Strict Reps</span>
                  <div className={`stat-value stat-reps ${isRepAnimating ? 'rep-animate' : ''}`}>
                    {reps} <span style={{ fontSize: "1.5rem", opacity: 0.5 }}>/ {targetReps}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Time</span>
                  <div className="stat-value">{duration}s</div>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Form Score</span>
                  <div className="stat-value" style={{ color: formScore > 85 ? "#00b894" : formScore > 60 ? "#fdcb6e" : "#ff7675" }}>{formScore}</div>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Postural Stability</span>
                  <div className="stat-value" style={{ color: danger > 30 ? "#ff7675" : "#00b894" }}>{Math.max(0, 100 - danger)}%</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="performance-panel">
              <h3>📊 Session Analysis</h3>
              <div className="performance-details">
                <p><span>Exercises Completed</span> <strong style={{ color: "#00d2ff" }}>{currentRoutineIndex + (reps >= targetReps ? 1 : 0)}</strong></p>
                <p><span>Total Sets Completed</span> <strong style={{ color: "#00d2ff" }}>{currentSet - 1 + (reps >= targetReps ? 1 : 0)}</strong></p>
                <p><span>Total Strict Reps</span> <strong style={{ color: "#00d2ff" }}>{globalRepsRef.current}</strong></p>
                <p><span>Average Form</span> <strong style={{ color: averageForm > 85 ? "#00b894" : averageForm > 60 ? "#fdcb6e" : "#ff7675" }}>{averageForm}%</strong></p>
                <p><span>Total Time</span> <strong>{Math.floor(duration / 60)}m {duration % 60}s</strong></p>
              </div>
              <button
                onClick={() => setSessionEnded(false)}
                className="btn-new-session"
              >
                Launch New Protocol
              </button>
            </div>
          )}

          <VirtualCoach state={coachState} text={coachText} />
        </div>
      </div>

      {isAddRoutineModalOpen && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)", zIndex: 1000,
          display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(10px)"
        }}>
          <div style={{
            backgroundColor: "#111520", padding: "40px", borderRadius: "20px", border: "1px solid rgba(0, 210, 255, 0.3)",
            boxShadow: "0 10px 40px rgba(0,210,255,0.1)", width: "100%", maxWidth: "450px", color: "white"
          }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "30px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "15px" }}>Configure Exercise</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "25px", marginBottom: "40px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ opacity: 0.8, fontSize: "0.9rem" }}>EXERCISE</label>
                <select
                  value={modalExerciseId}
                  onChange={(e) => setModalExerciseId(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "rgba(0,0,0,0.5)", color: "white", border: "1px solid rgba(255,255,255,0.2)", outline: "none" }}
                >
                  {Object.values(EXERCISES).map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.icon} {ex.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                  <label style={{ opacity: 0.8, fontSize: "0.9rem" }}>TARGET SETS</label>
                  <input 
                    type="number" min="1" max="10" 
                    value={modalSets} 
                    onChange={e => setModalSets(parseInt(e.target.value) || 1)} 
                    style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "rgba(0,0,0,0.5)", color: "white", border: "1px solid rgba(255,255,255,0.2)", outline: "none", textAlign: "center" }}
                  />
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                  <label style={{ opacity: 0.8, fontSize: "0.9rem" }}>TARGET REPS</label>
                  <input 
                    type="number" min="1" max="100" 
                    value={modalReps} 
                    onChange={e => setModalReps(parseInt(e.target.value) || 1)} 
                    style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "rgba(0,0,0,0.5)", color: "white", border: "1px solid rgba(255,255,255,0.2)", outline: "none", textAlign: "center" }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button 
                onClick={() => setIsAddRoutineModalOpen(false)}
                style={{ flex: 1, padding: "15px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "white", cursor: "pointer", fontWeight: "bold" }}
              >
                CANCEL
              </button>
              <button 
                onClick={addRoutineBlock}
                style={{ flex: 1, padding: "15px", borderRadius: "12px", border: "none", background: "#00d2ff", color: "black", cursor: "pointer", fontWeight: "bold", boxShadow: "0 4px 15px rgba(0, 210, 255, 0.3)" }}
              >
                + ADD TO QUEUE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
