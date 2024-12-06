import { useEffect, useState } from "react";

export const useDate = () => {
  const locale = "en";
  const [start] = useState(new Date());
  const [now, setDate] = useState(new Date());
  const [timeTaken, setTimeTaken] = useState<string>("");

  const getTimeBetweenDates = (startDate: Date, endDate: Date) => {
    const seconds = Math.floor(
      (endDate.getTime() - startDate.getTime()) / 1000
    );
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    return { seconds, minutes, hours, days };
  };

  const calcTimeTaken = () => {
    var takenTime = getTimeBetweenDates(start, new Date());
    var timeText = "";
    if (takenTime.days > 0) {
      timeText += `${takenTime.days}days `;
    }
    if (takenTime.hours > 0) {
      timeText += `${takenTime.hours}h `;
    }
    if (takenTime.minutes > 0) {
      timeText += `${takenTime.minutes}min `;
    }
    if (takenTime.seconds > 0) {
      timeText += `${takenTime.seconds}s`;
    }
    setTimeTaken(timeText);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
      calcTimeTaken();
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const day = now.toLocaleDateString(locale, { weekday: "long" });
  const date = `${day}, ${now.getDate()} ${now.toLocaleDateString(locale, {
    month: "long",
  })}\n\n`;

  const time = now.toLocaleTimeString(locale, {
    hour: "numeric",
    hour12: false,
    minute: "numeric",
    second: "numeric",
  });

  return {
    date,
    time,
    timeTaken,
  };
};
