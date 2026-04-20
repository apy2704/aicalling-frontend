import { useLocation } from "react-router-dom";
import avatar1 from "@/assets/thankyourobot.jpeg";

const ThankYou = () => {
  const location = useLocation();
  const time = location.state?.time || "00:00:00";

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-[#0a0f1e]">
      <div className="relative w-full max-w-[448px] min-h-screen flex flex-col overflow-hidden bg-[#0d131f]">
        <div className="flex flex-col items-center justify-center flex-1 w-full text-[#ffffff] text-center p-5 gap-2 font-roboto overflow-y-auto">
          <img
            src={avatar1}
            alt="aBHAY"
            className="h-72 object-contain mb-8"
          />
          <h3 className="text-xl mb-2 text-[#aaaead] ">
            Thankyou for talking with Abhay's AI!
          </h3>
          <p className="text-base text-[#bbbbbb] mt-1">
            🕒 Interaction Time: {time}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
