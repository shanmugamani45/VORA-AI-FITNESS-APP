import { useAvatarStore } from "../store/useAvatarStore";

let lastMessage = "";
let lastTime = 0;

export function speak(message, cooldown = 1500, overrideVerbosityCheck = false) {
  if (!window.speechSynthesis) return;

  const store = useAvatarStore.getState();
  
  // Verbosity check
  // If we're in quiet mode, and this isn't a manual override (like initial welcome or critical form), we skip non-essential chatter.
  if (!overrideVerbosityCheck && store.verbosity === "quiet") {
    // In actual implementation, we might pass a 'type' of message to distinguish critical vs chatter.
    // For now, if quiet, we increase the cooldown vastly so they speak much less often.
    cooldown = 10000; 
  }

  const now = Date.now();
  if (message === lastMessage && now - lastTime < cooldown) return;

  // Personality Filter
  let finalMessage = message;
  if (store.personality === "drill_sergeant") {
    if (message.includes("Good") || message.includes("Great")) {
      finalMessage = message.toUpperCase() + " BUT I STILL WANT ONE MORE REP!";
    } else {
      finalMessage = "LISTEN UP: " + message;
    }
  } else if (store.personality === "analytical") {
    finalMessage = "Analysis: " + message;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(finalMessage);
  
  // Apply preferred attributes
  utterance.rate = store.personality === "drill_sergeant" ? 1.2 : 1.0;
  utterance.pitch = store.personality === "drill_sergeant" ? 0.9 : 1.0;
  utterance.volume = 1;

  // Bind Voice if custom selected
  if (store.voiceURI) {
    const voices = window.speechSynthesis.getVoices();
    const targetedVoice = voices.find(v => v.voiceURI === store.voiceURI);
    if (targetedVoice) {
      utterance.voice = targetedVoice;
    }
  }

  // Dispatch events for UI synchronization (Lip sync / Gestures)
  utterance.onstart = () => {
    window.dispatchEvent(new CustomEvent("speech-start", { detail: { message: finalMessage } }));
  };
  
  utterance.onend = () => {
    window.dispatchEvent(new CustomEvent("speech-end"));
  };

  utterance.onerror = () => {
    window.dispatchEvent(new CustomEvent("speech-end"));
  };

  window.speechSynthesis.speak(utterance);

  lastMessage = message;
  lastTime = now;
}
