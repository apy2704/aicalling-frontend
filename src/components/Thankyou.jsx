import { useLocation } from "react-router-dom";
import thankyoupic from "../assets/thankyourobot.jpg";

const ThankYou = () => {
  const location = useLocation();
  const time = location.state?.time || "00:00:00";

  return (
    <>
      <div className="flex flex-col items-center justify-center h-full w-full bg-[#0d131f] text-[#ffffff] text-center p-5 gap-2 border-[0.1px] border-solid border-[#b6b3b3] font-roboto overflow-y-auto">
        <img
          src={thankyoupic}
          alt="aBHAY"
          className="w-63 max-w-[80%] rounded-[50%] mb-8 shadow-neon "
        />
        <h3 className="text-xl mb-2 text-[#aaaead] ">
          Thankyou for talking with Abhay's AI!
        </h3>
        <p className="text-base text-[#bbbbbb] mt-1">
          🕒 Interaction Time: {time}
        </p>
      </div>
    </>
  );
};

export default ThankYou;
