import { useEffect, useState } from "react";
import avatar2 from "@/assets/thankyourobot.jpeg";
import "../css/index.css";
import { IoCallSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { micPermissionAtom } from "../states/atoms";
import { motion, AnimatePresence } from "framer-motion";
import { GradientBackground } from "./ui/gradient-background-4";

const CallingApp = () => {
  return <CallerTab />;
};

export const CallerTab = () => {
  const setMicStatus = useSetRecoilState(micPermissionAtom);
  const micStatus = useRecoilValue(micPermissionAtom);

  const [micStep, setMicStep] = useState("");
  const [readyToCall, setReadyToCall] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    navigator.permissions
      .query({ name: "microphone" })
      .then((permissionStatus) => {
        if (permissionStatus.state === "granted") {
          setMicStatus(true);
          localStorage.setItem("mic-access", "true");
          setMicStep("✅ Microphone permission already granted.");

          setTimeout(() => {
            setMicStep("");
            setReadyToCall(true);
          }, 1500);
        } else {
          setMicStatus(false);
          localStorage.setItem("mic-access", "false");
        }
      })
      .catch((err) => {
        console.warn("Permissions API not supported or failed:", err);
      });
  }, []);

  const handleMicPermission = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        setMicStatus(true);
        localStorage.setItem("mic-access", "true");

        // Step-by-step animation with longer, more immersive delays
        setMicStep("🎙️ Initializing microphone access...");
        setTimeout(
          () => setMicStep("🔍 Scanning for microphone exceptions..."),
          2000
        );
        setTimeout(
          () => setMicStep("🛠️ Configuring audio input settings..."),
          4000
        );
        setTimeout(() => {
          setMicStep("✅ Microphone access successfully granted!");
          setTimeout(() => {
            setMicStep("");
            setReadyToCall(true);
          }, 2000);
        }, 5000);
      })
      .catch((err) => {
        console.log(err);
        setMicStatus(false);
        localStorage.setItem("mic-access", "false");
        setMicStep("❌ Failed to access mic. Please allow permission.");
      });
  };

  const handleclick = () => {
    if (!micStatus) return;
    navigate("/calling");
  };

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen w-full max-w-md mx-auto p-2 background-app border-app overflow-hidden">
      <GradientBackground />
      <img
        src={avatar2}
        alt="callpic"
        className="border-none max-w-[300px] overflow-hidden relative -top-7"
      />

      {/* Mic Permission Button */}
      {!micStatus && !readyToCall && (
        <button
          className="call-button font-roboto hover:call-button active:call-button mt-4 relative -top-11"
          onClick={handleMicPermission}
        >
          🎙️Allow Microphone Access
        </button>
      )}

      <div className="flex flex-col items-center mt-4 space-y-3 min-h-[80px]">
        <AnimatePresence mode="wait">
          {micStep && (
            <motion.p
              key={micStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-sm font-semibold text-center max-w-sm  relative -top-10"
            >
              {micStep}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {readyToCall && micStatus && !micStep && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="call-button font-roboto hover:call-button active:call-button relative -top-11"
              onClick={handleclick}
            >
              <IoCallSharp className="inline-block mr-1  " /> Start Call
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CallingApp;
