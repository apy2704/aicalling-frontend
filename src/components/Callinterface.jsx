import "../css/index.css";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Lottie from "lottie-react";

import talkinginterface from "../assets/talkanimee.json";
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

const MemoizedLottie = React.memo(({ animationData }) => (
  <Lottie
    className="w-3xs h-64 rounded-full border-none p-2"
    animationData={animationData}
  />
));

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
  const greetedRef = useRef(false);
  const currentUtteranceRef = useRef(null);

  const resetElapsedTime = useResetRecoilState(elapsedTimeAtom);
  const API_URL = `${import.meta.env.VITE_EC2_URL}/chat`;

  const stopListening = () => {
    recognitionRef.current?.stop?.();
    setListening(false);
  };

  useEffect(() => {
    const isDevelopment = import.meta.env.DEV;
    console.log("🚀 Callinterface: Component mounted");

    // Stop any existing speech and recognition
    speechSynthesis.cancel();
    recognitionRef.current?.abort?.();
    recognitionRef.current = null;
    greetedRef.current = false;

    const greetAndStart = () => {
      const greeting =
        "Hi, I am Abhay's AI. You can ask me anything about his portfolio. Tap the mic button below when you're ready to speak.";

      const greetSpeech = new SpeechSynthesisUtterance(greeting);
      greetSpeech.lang = "en-US";
      greetSpeech.pitch = 1.0;
      greetSpeech.rate = 1.8; // Faster speed (1.0 = normal, 1.6 = 60% faster)

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

      if (isDevelopment) {
        console.log("🔊 Starting greeting speech");
      }
      try {
        speechSynthesis.speak(greetSpeech);
      } catch (error) {
        console.error("❌ Error starting speech:", error);
        clearTimeout(safetyTimeout);
        setIsGreeting(false);
        setStatusMessage("🎤 Tap to talk");
      }
    };

    greetAndStart();

    return () => {
      speechSynthesis.cancel();
      stopListening();
      stopSpeaking();
      resetElapsedTime();
    };
  }, [resetElapsedTime]);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      setStatusMessage("❌ Browser not supported. Please use Chrome.");
      return;
    }

    // Step 1: Guard with mic permission check
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        let micTimeout;
        let manualStop = false;

        recognition.onstart = () => {
          setListening(true);
          setStatusMessage("🎧 Listening...");
          micTimeout = setTimeout(() => {
            manualStop = true;
            recognition.stop();
            setListening(false);
            setStatusMessage("Mic timed out. Tap to talk again.");
          }, 7000);
        };

        recognition.onresult = async (event) => {
          clearTimeout(micTimeout);
          manualStop = true;
          const userText = event.results[0][0].transcript;
          setTranscript(userText);
          recognition.stop();
          setListening(false);
          setLoading(true);
          setStatusMessage("Connecting to the backend...");

          // Log speech recognition result
          const requestId = Date.now();
          const timestamp = new Date().toISOString();
          console.log("\n" + "=".repeat(80));
          console.log(`🎤 [${timestamp}] SPEECH RECOGNITION RESULT #${requestId}`);
          console.log("=".repeat(80));
          console.log("💬 User Transcript:", userText);
          console.log("📏 Transcript Length:", userText.length, "characters");
          console.log("📊 Confidence:", event.results[0][0].confidence || "N/A");

          try {
            // Log API request
            const apiStartTime = Date.now();
            console.log("\n📤 [REQUEST #" + requestId + "] SENDING API REQUEST");
            console.log("🌐 API URL:", API_URL);
            console.log(
              "📦 Request Payload:",
              JSON.stringify({ userMessage: userText }, null, 2)
            );
            console.log("⏱️  Request Time:", new Date().toISOString());

            const res = await axios.post(API_URL, { userMessage: userText });

            const apiEndTime = Date.now();
            const apiDuration = apiEndTime - apiStartTime;
            const data = res.data;
            const aiResponse = data.response;

            // Log API response
            console.log("\n✅ [REQUEST #" + requestId + "] API RESPONSE RECEIVED");
            console.log("⏱️  API Duration:", apiDuration + "ms");
            console.log("📊 Response Status:", res.status, res.statusText);
            console.log(
              "📦 Response Headers:",
              JSON.stringify(res.headers, null, 2)
            );
            console.log("📦 Response Data:", JSON.stringify(data, null, 2));
            console.log("🤖 AI Response Text:", aiResponse);
            console.log("📏 Response Length:", aiResponse.length, "characters");
            console.log("=".repeat(80) + "\n");

            setResponse(aiResponse);
            setApiError(null);

            // Use default Web Speech API to speak the Groq API response
            console.log("🔊 Starting Text-to-Speech for AI response");
            speak(aiResponse);
          } catch (err) {
            // Log API error
            console.error("\n" + "=".repeat(80));
            console.error(
              `❌ [${new Date().toISOString()}] API ERROR #${requestId}`
            );
            console.error("=".repeat(80));
            console.error("🔴 Error Type:", err.constructor.name);
            console.error("📝 Error Message:", err.message);

            if (err.response) {
              console.error("📡 Response Status:", err.response.status);
              console.error(
                "📡 Response Data:",
                JSON.stringify(err.response.data, null, 2)
              );
              console.error(
                "📡 Response Headers:",
                JSON.stringify(err.response.headers, null, 2)
              );
            } else if (err.request) {
              console.error("📡 Request Error:", err.request);
              console.error("⚠️  No response received from server");
            } else {
              console.error("📡 Error Config:", err.config);
            }
            console.error("=".repeat(80) + "\n");

            setApiError(
              "Unable to connect to the backend. Please try again later."
            );
            setResponse("Something went wrong while fetching the response.");
            setStatusMessage("⚠️ Failed to fetch response");
          }

          setLoading(false);
        };

        // Step 2: Improved error handling
        recognition.onerror = (event) => {
          clearTimeout(micTimeout);
          setListening(false);
          if (event.error === "not-allowed") {
            setStatusMessage("Mic access denied. Please allow microphone.");
          } else if (event.error === "no-speech") {
            setStatusMessage("No speech detected. Tap mic to try again.");
          } else if (event.error === "network") {
            setStatusMessage("Network error. Check your internet connection.");
          } else {
            setStatusMessage("Voice error. Tap mic to try again.");
          }
        };

        recognition.onend = () => {
          clearTimeout(micTimeout);
          if (!manualStop) {
            // Restart recognition automatically if not manually stopped
            try {
              recognition.start();
            } catch (e) {
              console.warn("Could not restart recognition:", e);
              setListening(false);
            }
          } else {
            setListening(false);
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      })
      .catch((err) => {
        console.error("Mic error:", err);
        setStatusMessage("Microphone access denied. Please allow mic permission.");
      });
  };

  const stopSpeaking = () => {
    console.log("⏸️ Stopping speech");
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setListening(false);
    setStatusMessage("🎤 Tap to talk");
    currentUtteranceRef.current = null;
  };

  const speak = (text) => {
    // Step 3: Cancel any ongoing speech first
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-IN";
    utter.rate = 1;
    utter.pitch = 1;

    setStatusMessage("🔊 Speaking...");
    setListening(true); // mic off during AI speech
    setIsSpeaking(true);
    currentUtteranceRef.current = utter;

    utter.onstart = () => {
      console.log("🔊 Speech started");
      setIsSpeaking(true);
    };

    utter.onend = () => {
      console.log("✅ AI response speech completed");
      setIsSpeaking(false);
      setListening(false);
      setStatusMessage("🎤 Tap to talk");
      currentUtteranceRef.current = null;
    };

    utter.onerror = (e) => {
      console.error("Speech error:", e);
      setIsSpeaking(false);
      setListening(false);
      setStatusMessage("🎤 Tap to talk");
      currentUtteranceRef.current = null;
    };

    console.log("🔊 Speaking AI response");
    window.speechSynthesis.speak(utter);
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
    <div className="relative flex flex-col justify-between items-center min-h-screen w-full max-w-md mx-auto overflow-hidden border-app">
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
                speechSynthesis.cancel();
                stopListening();
                navigate("/thankyou", {
                  state: { time: document.querySelector("#timer").textContent },
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
