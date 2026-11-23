import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Feedback } from "./feedback";


export const ToneIcon = ({ feedback }: { feedback: Feedback }) => {
  if (feedback.tone === "revealed")
    return <VisibilityOutlinedIcon fontSize="small" />;
  if (feedback.tone === "wrong" || feedback.crossIcon)
    return <CloseIcon fontSize="small" />;
  return <CheckIcon fontSize="small" />;
};
