import { useRecoilValue } from "recoil";
import { elapsedTimeAtom } from "../states/atoms";

const FormatTime = () => {
  const elapsedTime = useRecoilValue(elapsedTimeAtom);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const pad = (num) => String(num).padStart(2, "0");

    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  };

  return <span>{formatTime(elapsedTime)}</span>;
};

export default FormatTime;
