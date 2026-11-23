import { ReactNode } from "react";
import { Card } from "@mui/material";

interface QuestionCardProps {
  label: string;
  children: ReactNode;
}

/** White card that holds the question; grows to fill the space above the panel. */
export const QuestionCard = ({ label, children }: QuestionCardProps) => (
  <Card
    component="section"
    aria-label={label}
    sx={{
      flex: 1,
      p: { xs: 3, md: 5 },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 1.25,
      textAlign: "center",
      "&:hover": { boxShadow: undefined },
    }}
  >
    {children}
  </Card>
);
