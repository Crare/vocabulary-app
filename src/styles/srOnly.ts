/**
 * Visually hidden but read by screen readers. Sizes are strings on purpose:
 * in `sx` a bare 1 means 100%, not 1px.
 */
export const srOnly = {
  position: "absolute",
  left: 0,
  top: 0,
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
} as const;
