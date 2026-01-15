import "./css/index.css";
import tanupic from "./assets/tanishk.jpeg";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { BsLayoutSidebar } from "react-icons/bs";
import { RecoilRoot, useRecoilState } from "recoil";
import { toggleAtomstate } from "./states/atoms";
import CallingApp from "./components/Call";
import CallingInterface from "./components/Callinterface";
import ThankYou from "./components/Thankyou";
import { Aboutproject } from "./components/About";
import Chatinterface from "./components/Chatinterface";
import { Sidebar } from "./components/Sidebar";
import { Loader } from "./components/Loader";
import { useState } from "react";
import { useEffect } from "react";
import { Fallback } from "./components/Fallback";

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<CallingApp />} />
            <Route path="/calling" element={<Loader />} />
            <Route path="/callinginterface" element={<CallingInterface />} />
            <Route path="/chat" element={<Chatinterface />} />
            <Route path="/thankyou" element={<ThankYou />} />
            <Route path="/aboutproject" element={<Aboutproject />} />
            <Route path="*" element={<Fallback />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export const Layout = () => {
  const [isSidebarOpen, setToggleSidebar] = useRecoilState(toggleAtomstate); //false
  const [isClosing, setIsClosing] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleCloseWithAnimation = () => {
    setIsClosing(true);
  };

  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        setToggleSidebar(false);
        setIsClosing(false); // reset for future transitions
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isClosing, setToggleSidebar]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  // Prevent body scroll when profile modal is open
  useEffect(() => {
    if (isProfileModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isProfileModalOpen]);

  return (
    <div className="w-full min-w-[320px] max-w-full mx-auto h-screen overflow-hidden relative bg-[#0d131f] md:max-w-lg md:rounded-[15px] md:border-[10px] md:border-[#222] shadow-purple md:border-solid">
      <div className="flex flex-col h-full w-full relative">
        {/* Fixed Header */}
        <div className="relative z-[1001] flex-shrink-0 h-[60px] background-app flex items-center justify-between border-app border-b p-3">
          <div className="w-10 flex items-center justify-center">
            {!isSidebarOpen && (
              <button
                className="bg-none border-none text-2xl cursor-pointer text-white hover:opacity-80 transition-opacity"
                onClick={() => setToggleSidebar(true)}
                aria-label="Open sidebar"
              >
                <BsLayoutSidebar />
              </button>
            )}
          </div>

          <button
            onClick={() => {
              const link = document.createElement("a");
              link.href = "/Tanishk_Khare_Resume.pdf";
              link.download = "Tanishk_Khare_Resume.pdf";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="text-xl sm:text-2xl p-1.5 bg-[#3a3a3ab3] rounded-xl text-white hover:bg-[#4a4a4ab3] hover:text-blue-400 transition-all cursor-pointer"
            aria-label="Download Resume"
          >
            Tanishk AI
          </button>

          <div className="w-10 flex items-center justify-center">
            <div className="w-[35px] h-[35px]">
              <img
                className="w-full h-full object-cover rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500/50 transition-all hover:scale-110"
                src={tanupic}
                alt="profilepic"
                loading="lazy"
                onClick={() => setIsProfileModalOpen(true)}
              />
            </div>
          </div>
        </div>

        {/* Sidebar - Fixed position, doesn't scroll */}
        {isSidebarOpen && (
          <>
            <Sidebar
              isClosing={isClosing}
              handleClose={handleCloseWithAnimation}
            />
            <div
              className="overlay-app"
              onClick={handleCloseWithAnimation}
            ></div>
          </>
        )}

        {/* Content Area - Takes remaining height */}
        <div className="flex-1 min-h-0 w-full relative overflow-hidden">
          <Outlet />
        </div>
      </div>

      {/* Profile Photo Modal */}
      {isProfileModalOpen && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
          onClick={() => setIsProfileModalOpen(false)}
        >
          {/* Blur Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl animate-fade-in"></div>

          {/* Close Button */}
          <button
            className="absolute top-6 right-6 z-[2002] text-white/90 hover:text-white transition-all bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/20 border border-white/20"
            onClick={() => setIsProfileModalOpen(false)}
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Circular Profile Image with Glass Effect */}
          <div
            className="relative z-[2001] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glass Effect Container */}
            <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px]">
              {/* Glass Background Circle */}
              <div className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl"></div>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30 blur-2xl opacity-50"></div>

              {/* Profile Image - Circular */}
              <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-white/10 shadow-2xl">
                <img
                  className="w-full h-full object-cover"
                  src={tanupic}
                  alt="Tanishk AI Profile"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
