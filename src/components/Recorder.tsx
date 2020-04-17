import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { start, selectDateStart, stop } from "../redux/recorder";
import addZero from "../utils/addZero";
import { createUserEvent } from "../redux/user-events";
import classNames from "../utils/classNames";

const Recorder: React.FC = () => {
  const dispatch = useDispatch();
  const dateStart = useSelector(selectDateStart);

  const started = dateStart !== "";

  let interval = useRef<number>(0);
  const [, setCount] = useState<number>(0);

  const handleRecord = () => {
    if (started) {
      window.clearInterval(interval.current);
      dispatch(createUserEvent());
      dispatch(stop());
      return;
    }

    dispatch(start());
    interval.current = window.setInterval(() => {
      setCount((count) => count + 1);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      window.clearInterval(interval.current);
    };
  }, []);

  let seconds = started
    ? Math.floor((Date.now() - new Date(dateStart).getTime()) / 1000)
    : 0;
  const hours = seconds ? Math.floor(seconds / 60 / 60) : 0;

  seconds -= hours * 60 * 60;

  const minutes = seconds ? Math.floor(seconds / 60) : 0;

  seconds -= minutes * 60;

  return (
    <div className="flex items-center justify-between w-64 pb-20">
      <div className="w-16 h-16 bg-blue-200 rounded-full flex justify-center items-center cursor-pointer outline-none">
        <button
          onClick={handleRecord}
          className={classNames(
            "w-6 h-6 rounded-full",
            started ? "bg-green-500" : "bg-red-500"
          )}
        ></button>
      </div>
      <div className="font-digital text-3xl text-gray-200">
        {addZero(hours)}:{addZero(minutes)}:{addZero(seconds)}
      </div>
    </div>
  );
};

export default Recorder;
