import "./css/index.css";
import tanupic from "./assets/tanuai.png";
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

          <p className="text-xl sm:text-2xl p-1.5 bg-[#3a3a3ab3] rounded-xl text-white">
            Tanishk AI
          </p>

          <div className="w-10 flex items-center justify-center">
            <div className="w-[35px] h-[35px]">
              <img
                className="w-full h-full object-cover rounded-full cursor-pointer"
                src={tanupic}
                alt="profilepic"
                loading="lazy"
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
    </div>
  );
};

export default App;
