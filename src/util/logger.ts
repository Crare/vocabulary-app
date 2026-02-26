/**
 * Structured debug logger for the vocabulary app.
 *
 * Inspired by the wide-event / canonical-log-line approach from loggingsucks.com:
 * - Every log is a structured JSON object (not a flat string)
 * - Events carry rich context (high cardinality & dimensionality)
 * - One rich event per action, not scattered console.log noise
 *
 * Logging is enabled when `localStorage.debug === "true"` or when
 * the URL contains `?debug`.  All output goes to the browser console.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEvent {
    timestamp: string;
    level: LogLevel;
    event: string;
    /** Dot-separated module path, e.g. "testing.answer" */
    module: string;
    [key: string]: unknown;
}

function isEnabled(): boolean {
    try {
        if (localStorage.getItem("debug") === "true") return true;
    } catch {
        /* storage may throw in some contexts */
    }
    if (
        typeof window !== "undefined" &&
        window.location?.search?.includes("debug")
    ) {
        return true;
    }
    return false;
}

const CONSOLE_METHODS: Record<LogLevel, (...args: unknown[]) => void> = {
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
};

function emit(
    level: LogLevel,
    module: string,
    event: string,
    data: Record<string, unknown> = {},
): void {
    if (!isEnabled()) return;

    const logEvent: LogEvent = {
        timestamp: new Date().toISOString(),
        level,
        module,
        event,
        ...data,
    };

    const method = CONSOLE_METHODS[level];
    method(`[${module}] ${event}`, logEvent);
}

/**
 * Create a scoped logger for a specific module.
 *
 * Usage:
 * ```ts
 * const log = createLogger("testing");
 * log.info("test_started", { wordCount: 20, testType: "both" });
 * ```
 */
export function createLogger(module: string) {
    return {
        debug: (event: string, data?: Record<string, unknown>) =>
            emit("debug", module, event, data),
        info: (event: string, data?: Record<string, unknown>) =>
            emit("info", module, event, data),
        warn: (event: string, data?: Record<string, unknown>) =>
            emit("warn", module, event, data),
        error: (event: string, data?: Record<string, unknown>) =>
            emit("error", module, event, data),
    };
}

/**
 * Enable debug logging at runtime.  Call from browser console:
 * `window.__enableDebugLogging()`
 */
export function enableDebugLogging(): void {
    localStorage.setItem("debug", "true");
    console.info("[logger] Debug logging enabled. Reload to take full effect.");
}

/**
 * Disable debug logging.
 */
export function disableDebugLogging(): void {
    localStorage.removeItem("debug");
    console.info("[logger] Debug logging disabled.");
}

// Expose toggle helpers on `window` for easy console access
if (typeof window !== "undefined") {
    (window as unknown as Record<string, unknown>).__enableDebugLogging =
        enableDebugLogging;
    (window as unknown as Record<string, unknown>).__disableDebugLogging =
        disableDebugLogging;
}
