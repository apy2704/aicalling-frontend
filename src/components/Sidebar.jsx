import { MdCancel } from "react-icons/md";
import { Link } from "react-router-dom";
import "../css/index.css";
import { FaGithub } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { IoCallSharp } from "react-icons/io5";
import { FaLinkedin } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import { FaRobot } from "react-icons/fa6";
import { HiDocumentText } from "react-icons/hi";

export const Sidebar = ({ isClosing, handleClose }) => {
  return (
    <div className={`sidebar-app ${isClosing ? "slide-out" : "slide-in"}`}>
      <button
        className="bg-none border-none text-white text-2xl float-right cursor-pointer"
        onClick={handleClose}
      >
        <MdCancel />
      </button>
      <div className="flex flex-col max-w-fit justify-center items-center text-[20px] p-[5px]">
        <div className="sidebar-content">
          <ul className="flex flex-col gap-[10px] list-none p-1.5 font-bold">
            <li className="flex items-center mt-[10px] font-roboto">
              <Link
                className="flex items-center gap-[7px] justify-start text-white decoration-none"
                to="/"
                onClick={handleClose}
              >
                <FaHome />
                Home
              </Link>
            </li>
            <li className="flex items-center mt-[10px] font-roboto">
              <Link
                className="flex items-center gap-[7px] justify-start text-white decoration-none"
                to="/chat"
                onClick={handleClose}
              >
                <IoChatbubbleEllipses />
                Chat-with-AI
              </Link>
            </li>
            <li className="flex items-center mt-[10px] font-roboto">
              <Link
                className="flex items-center gap-[7px] justify-start text-white decoration-none"
                to="/calling"
                onClick={handleClose}
              >
                <IoCallSharp />
                Voice Call
              </Link>
            </li>
            <li className="flex items-center mt-[10px] font-roboto">
              <a
                className="flex items-center gap-[7px] justify-start text-white decoration-none"
                href="https://github.com/apy2704"
                target="_blank"
                onClick={handleClose}
                rel="noopener noreferrer"
              >
                <FaGithub />
                Github
              </a>
            </li>
            <li className="flex items-center mt-[10px] font-roboto">
              <a
                className="flex items-center gap-[7px] justify-start text-white decoration-none"
                href="https://www.linkedin.com/in/apy2704/"
                target="_blank"
                onClick={handleClose}
                rel="noopener noreferrer"
              >
                <FaLinkedin />
                LinkedIn
              </a>
            </li>
            <li className="flex items-center mt-[10px] font-roboto">
              <a
                className="flex items-center gap-[7px] justify-start text-white decoration-none"
                href="mailto:abhyadav2704@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BiLogoGmail />
                Gmail
              </a>
            </li>
            <li className="flex items-center mt-[10px] font-roboto">
              <Link
                className="flex items-center gap-[7px] justify-start text-white decoration-none"
                to="/aboutproject"
                onClick={handleClose}
              >
                <FaRobot />
                Behind the AI
              </Link>
            </li>
            <li className="flex items-center mt-[10px] font-roboto">
              <a
                className="flex items-center gap-[7px] justify-start text-white decoration-none hover:text-blue-400 transition-colors"
                href="/abhay_ai.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
              >
                <HiDocumentText />
                View Resume
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="absolute bottom-8 w-full text-[0.7rem] text-[#aaa]">
        © 2026 Abhay Pratap Yadav—Made with ❤️
      </div>
    </div>
  );
};
