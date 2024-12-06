import { useDate } from "../hooks/useDate";

export const TimeTaken = () => {
  const { timeTaken } = useDate();
  return <span>{timeTaken}</span>;
};
