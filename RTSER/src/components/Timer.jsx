import { useState, useEffect } from "react";

export default function Timer({ status }) {
  const [counter, setCounter] = useState(0);
  const [timer, setTimer] = useState("00:00");

  useEffect(() => {
    let intervalId;

    if (status == "recording") {
      intervalId = setInterval(() => {
        const secondCounter = counter % 60;
        const minuteCounter = Math.floor(counter / 60);

        let computedSecond =
          String(secondCounter).length === 1
            ? `0${secondCounter}`
            : secondCounter;
        let computedMinute =
          String(minuteCounter).length === 1
            ? `0${minuteCounter}`
            : minuteCounter;

        setTimer(`${computedMinute}:${computedSecond}`);

        setCounter((counter) => counter + 1);
      }, 1000);
    } else {
      setTimer("00:00");
      setCounter(0);
    }

    return () => clearInterval(intervalId);
  }, [status, counter]);

  return <>{timer}</>;
}
