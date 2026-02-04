import callertune from "../assets/callertune.mp3";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../css/index.css";

export const Loader = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const audio = new Audio(callertune);
    audio.loop = true;
    const timer = setInterval(() => {
      audio.play();
    }, 700);

    return () => {
      clearInterval(timer);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    console.log("🔄 Loader: Starting navigation timer (3 seconds)");
    const timer = setTimeout(() => {
      console.log("✅ Loader: Navigating to /callinginterface");
      try {
        navigate("/callinginterface");
      } catch (error) {
        console.error("❌ Loader: Navigation error:", error);
      }
    }, 3000);

    return () => {
      console.log("🧹 Loader: Cleaning up timer");
      clearTimeout(timer);
    };
  }, [navigate]);
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center gap-1.5 font-bold font-roboto background-app z-[1000] pb-[90px]">
        <div className="spinner" />
        <p>Connecting to Abhay’s AI...</p>
      </div>
    </>
  );
};
