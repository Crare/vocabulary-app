import { Component, ErrorInfo, ReactNode } from "react";
import { Box, Button, Typography } from "@mui/material";
import { createLogger } from "../util/logger";

const log = createLogger("view-error");

interface ViewErrorBoundaryProps {
  children: ReactNode;
}

interface ViewErrorBoundaryState {
  failed: boolean;
}

/**
 * Catches a page that fails to render, most often a lazily loaded page whose
 * file is gone after a new version was deployed. Shows a reload button
 * instead of a blank screen. Give it `key={view}` so moving to another page
 * clears the error.
 *
 * React only supports error boundaries as class components — the one
 * exception to this project's function-components rule.
 */
export class ViewErrorBoundary extends Component<
  ViewErrorBoundaryProps,
  ViewErrorBoundaryState
> {
  state: ViewErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): ViewErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    log.error("view_failed", {
      error: error.message,
      componentStack: info.componentStack ?? undefined,
    });
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <Box role="alert" sx={{ textAlign: "center", py: 6, px: 2 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          This page could not be loaded
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          The app may have been updated. Reloading gets the latest version;
          your word lists and history are kept.
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Reload
        </Button>
      </Box>
    );
  }
}
