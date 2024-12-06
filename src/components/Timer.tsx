import { useDate } from "../hooks/useDate";

export const Timer = () => {
  const { timeTaken } = useDate();
  return <span>{timeTaken}</span>;
};
