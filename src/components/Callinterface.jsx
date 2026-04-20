import "../css/index.css";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import avatar1 from "@/assets/callpic.jpeg";
import { HiSpeakerWave } from "react-icons/hi2";
import { MdCallEnd, MdErrorOutline, MdPause } from "react-icons/md";
import { FaMicrophone } from "react-icons/fa6";
import { RiSpeakFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Timer from "../components/Timer.jsx";
import FormatTime from "../components/Formattime.jsx";
import { useResetRecoilState } from "recoil";
import { elapsedTimeAtom } from "../states/atoms";

const CallingInterface = () => {
  const [isGreeting, setIsGreeting] = useState(true);
  const [isspeakerOn, setSpeaker] = useState(false);
  const [isListening, setListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userTranscript, setTranscript] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [responseFromAI, setResponse] = useState("");
  const [apiError, setApiError] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Initializing...");
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const currentUtteranceRef = useRef(null);
  const resumeIntervalRef = useRef(null);

  const resetElapsedTime = useResetRecoilState(elapsedTimeAtom);
  const API_URL = `${import.meta.env.VITE_EC2_URL}/chat`;

  const stopListening = () => {
    window.manualStop = true;
    recognitionRef.current?.stop?.();
    setListening(false);
  };

  // PART 4 — Mic permission on page load + greeting
  useEffect(() => {
    console.log("🚀 Callinterface: Component mounted");

    // Stop any existing speech and recognition
    window.speechSynthesis.cancel();
    recognitionRef.current?.abort?.();
    recognitionRef.current = null;

    const greetAndStart = () => {
      const greeting =
        "Hi, I am Abhay's AI. You can ask me anything about his portfolio. Tap the mic button below when you're ready to speak.";

      window.speechSynthesis.cancel();
      const greetSpeech = new SpeechSynthesisUtterance(greeting);
      greetSpeech.lang = "en-IN";
      greetSpeech.pitch = 1;
      greetSpeech.rate = 0.95;

      setIsGreeting(true);
      setStatusMessage("Speaking...");

      // Safety timeout - if speech doesn't complete in 10 seconds, proceed anyway
      const safetyTimeout = setTimeout(() => {
        console.warn("⚠️ Greeting speech timeout - proceeding anyway");
        setIsGreeting(false);
        setIsSpeaking(false);
        setStatusMessage("🎤 Tap to talk");
      }, 10000);

      greetSpeech.onstart = () => {
        setIsSpeaking(true);
      };

      greetSpeech.onend = () => {
        console.log("✅ Greeting speech completed");
        clearTimeout(safetyTimeout);
        setIsGreeting(false);
        setIsSpeaking(false);
        setStatusMessage("🎤 Tap to talk");
      };

      greetSpeech.onerror = (error) => {
        console.error("❌ Greeting speech error:", error);
        clearTimeout(safetyTimeout);
        setIsGreeting(false);
        setIsSpeaking(false);
        setStatusMessage("🎤 Tap to talk");
      };

      try {
        window.speechSynthesis.speak(greetSpeech);
      } catch (error) {
        console.error("❌ Error starting speech:", error);
        clearTimeout(safetyTimeout);
        setIsGreeting(false);
        setStatusMessage("🎤 Tap to talk");
      }
    };

    // Request mic permission on mount, then greet
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        greetAndStart();
      })
      .catch(() => {
        setStatusMessage(
          "❌ Mic access denied. Please allow microphone and reload."
        );
        setIsGreeting(false);
      });

    return () => {
      window.speechSynthesis.cancel();
      if (resumeIntervalRef.current) clearInterval(resumeIntervalRef.current);
      stopListening();
      stopSpeaking();
      resetElapsedTime();
    };
  }, [resetElapsedTime]);

  // PART 2 — Microphone / Speech Recognition
  const startListening = () => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setStatusMessage(
          "Speech recognition not supported in this browser. Use Chrome."
        );
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setListening(true);
        setStatusMessage("🎧 Listening...");
      };

      recognition.onresult = async (event) => {
        window.manualStop = true;
        const userText = event.results[0][0].transcript;
        setTranscript(userText);
        setListening(false);
        setLoading(true);
        setStatusMessage("Connecting to the backend...");

        const requestId = Date.now();
        console.log(`🎤 SPEECH RESULT #${requestId}: "${userText}"`);

        try {
          const res = await axios.post(API_URL, { userMessage: userText });
          const aiResponse = res.data.response;
          console.log(`🤖 AI Response #${requestId}:`, aiResponse);

          setResponse(aiResponse);
          setApiError(null);
          setLoading(false);

          // PART 3 — Speak the response
          speakResponse(aiResponse);
        } catch (err) {
          console.error("❌ API Error:", err.message);
          setApiError(
            "Unable to connect to the backend. Please try again later."
          );
          setResponse("Something went wrong while fetching the response.");
          setStatusMessage("⚠️ Failed to fetch response");
          setLoading(false);
        }
      };

      recognition.onerror = (event) => {
        setListening(false);
        if (event.error === "not-allowed") {
          setStatusMessage(
            "❌ Mic access denied. Please allow microphone in browser settings."
          );
        } else if (event.error === "no-speech") {
          setStatusMessage("No speech detected. Tap mic to try again.");
        } else if (event.error === "network") {
          setStatusMessage("Network error. Check your internet connection.");
        } else {
          setStatusMessage("Voice error. Tap mic to try again.");
        }
      };

      recognition.onend = () => {
        if (!window.manualStop) {
          setStatusMessage("Tap mic to speak again.");
        }
        setListening(false);
      };

      window.manualStop = false;
      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setStatusMessage("Mic error: " + err.message);
    }
  };

  const stopSpeaking = () => {
    console.log("⏸️ Stopping speech");
    window.speechSynthesis.cancel();
    if (resumeIntervalRef.current) {
      clearInterval(resumeIntervalRef.current);
      resumeIntervalRef.current = null;
    }
    setIsSpeaking(false);
    setListening(false);
    setStatusMessage("🎤 Tap to talk");
    currentUtteranceRef.current = null;
  };

  // PART 3 — Speech Synthesis with Chrome 15-second fix
  const speakResponse = (text) => {
    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-IN";
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      setStatusMessage("🔊 Speaking...");
      setListening(true); // mic off during AI speech
      setIsSpeaking(true);
      currentUtteranceRef.current = utterance;

      // Fix Chrome bug where speech stops after 15 seconds
      const resumeInfinity = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(resumeInfinity);
        } else {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000);
      resumeIntervalRef.current = resumeInfinity;

      utterance.onstart = () => {
        console.log("🔊 Speech started");
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        console.log("✅ AI response speech completed");
        clearInterval(resumeInfinity);
        resumeIntervalRef.current = null;
        setIsSpeaking(false);
        setListening(false);
        setStatusMessage("🎤 Tap to talk");
        currentUtteranceRef.current = null;
      };

      utterance.onerror = (e) => {
        console.error("Speech error:", e);
        clearInterval(resumeInfinity);
        resumeIntervalRef.current = null;
        setIsSpeaking(false);
        setListening(false);
        setStatusMessage("Speaking error. Tap mic to continue.");
        currentUtteranceRef.current = null;
      };

      console.log("🔊 Speaking AI response");
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("TTS error:", err);
    }
  };

  const handleclick = () => {
    setSpeaker((prev) => !prev);
  };

  useEffect(() => {
    if (apiError !== null) {
      const timer = setTimeout(() => setApiError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [apiError]);

  useEffect(() => {
    if (isspeakerOn) {
      const timer = setTimeout(() => setSpeaker(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isspeakerOn]);

  return (
    // PART 1 — Desktop layout wrapper
    <div className="min-h-screen w-full flex justify-center items-center bg-[#0a0f1e]">
      <div className="relative w-full max-w-[448px] min-h-screen flex flex-col overflow-hidden bg-[#0d131f]">
        <div className="flex flex-col items-center justify-center flex-1 w-full p-[30px] background-app relative overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center w-2xs h-64 text-3xl text-[#c6cac9] font-bold p-[7px]">
              <p>🤖 Thinking...</p>
              <span className="spinner"></span>
            </div>
          ) : (
            <img
              src={avatar1}
              alt="AI avatar"
              className="w-72 max-h-80 object-contain"
            />
          )}

          <Timer />
          <div className="flex items-center p-1.5 text-[20px] mb-8">
            <div className="font-medium p-1" id="timer">
              <FormatTime />
            </div>
          </div>

          <div className="text-center text-sm text-[#9ca3af] font-medium mb-4">
            {statusMessage}
          </div>

          <div className="relative w-fit mt-2">
            {apiError && (
              <div className="flex items-center justify-center mt-2 p-2 bg-[#1a1a1f] text-[#f9264d] rounded-b-lg gap-[5px] text-[12px]">
                <MdErrorOutline className="text-2xl" />
                <p>{apiError}</p>
              </div>
            )}

            <div className="flex justify-around items-center gap-[50px] p-3">
              {/* Pause/Stop Speech Button - Shows when AI is speaking */}
              {isSpeaking ? (
                <button
                  className="bg-[#0d131f] text-[#ff6b6b] w-14 h-14 rounded-full flex items-center justify-center hover:bg-[#1a1a1f] transition-colors"
                  onClick={stopSpeaking}
                  title="Stop AI speech"
                >
                  <MdPause className="text-2xl" />
                </button>
              ) : (
                <button
                  className="bg-[#0d131f] text-[#87cfd5] w-14 h-14 rounded-full flex items-center justify-center"
                  onClick={handleclick}
                  title="Speaker info"
                >
                  <HiSpeakerWave className="text-2xl" />
                </button>
              )}

              <button
                className="w-14 h-14"
                onClick={() => {
                  window.speechSynthesis.cancel();
                  stopListening();
                  navigate("/thankyou", {
                    state: {
                      time: document.querySelector("#timer").textContent,
                    },
                  });
                }}
              >
                <MdCallEnd className="bg-[#e31e13] mt-5 text-white text-6xl rounded-full p-2" />
              </button>

              <button
                disabled={isListening || isGreeting || isSpeaking}
                onClick={() => {
                  if (!isListening && !isGreeting && !isSpeaking) {
                    startListening();
                  }
                }}
                className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  isListening || isGreeting || isSpeaking
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isListening ? (
                  <RiSpeakFill className="bg-[#0d131f] text-white text-2xl" />
                ) : (
                  <FaMicrophone className="bg-[#0d131f] text-white text-2xl" />
                )}
              </button>
            </div>

            {isspeakerOn && <SpeakerError />}
          </div>
        </div>
      </div>
    </div>
  );
};

const SpeakerError = () => (
  <div className="absolute -bottom-15 left-[3%] bg-[#1a1a1f] p-4 rounded-2xl text-[#c5c7c9] font-roboto flex items-center gap-2 z-10 text-[13px] w-fit">
    <MdErrorOutline />
    <p className="font-bold text-[#a6a8a9]">
      Speaker mode is always on by default!
    </p>
  </div>
);

export default CallingInterface;
