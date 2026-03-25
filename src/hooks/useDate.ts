import { useEffect, useState } from "react";

export const getTimeBetweenDates = (startDate: Date, endDate: Date) => {
  const totalSeconds = Math.max(
    0,
    Math.floor((endDate.getTime() - startDate.getTime()) / 1000),
  );
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { seconds, minutes, hours, days };
};

export const calcTimeTakenText = (start: Date, end: Date): string => {
  const takenTime = getTimeBetweenDates(start, end);
  const parts: string[] = [];

  if (takenTime.days > 0) {
    parts.push(`${takenTime.days}d`);
  }
  if (takenTime.hours > 0) {
    parts.push(`${takenTime.hours}h`);
  }
  if (takenTime.minutes > 0) {
    parts.push(`${takenTime.minutes}min`);
  }
  if (takenTime.seconds > 0) {
    parts.push(`${takenTime.seconds}s`);
  }

  return parts.join(" ");
};

export const useDate = () => {
  const locale = "en";
  const [start] = useState(new Date());
  const [now, setDate] = useState(new Date());
  const [timeTaken, setTimeTaken] = useState<string>("");

  const calcTimeTaken = () => {
    var takenTime = calcTimeTakenText(start, new Date());
    setTimeTaken(takenTime);
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
