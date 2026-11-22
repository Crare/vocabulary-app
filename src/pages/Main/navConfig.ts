export type NavView = "wordlists" | "settings" | "history" | "credits";

/** Media query below which the phone layout (bottom tab bar + options sheet) is used. */
export const PHONE_NAV_QUERY = "(max-width: 899.95px)";

/** Height of the phone bottom tab bar, excluding the device safe-area inset. */
export const BOTTOM_NAV_HEIGHT = 64;

/** Fallback volume used when un-muting and no earlier non-zero volume is known. */
const DEFAULT_UNMUTE_VOLUME = 0.5;

/**
 * Returns the volume to switch to when the mute button is pressed.
 * Muting goes to 0; un-muting restores the last non-zero volume.
 */
export const nextMuteVolume = (
  volume: number,
  lastAudibleVolume: number | null,
): number => {
  if (volume > 0) return 0;
  if (lastAudibleVolume !== null && lastAudibleVolume > 0) {
    return Math.min(lastAudibleVolume, 1);
  }
  return DEFAULT_UNMUTE_VOLUME;
};

/** Builds the URL shown in the QR code, tagging it so visits from QR scans can be told apart. */
export const buildQrUrl = (href: string): string => {
  const url = new URL(href);
  if (!url.searchParams.has("ref")) url.searchParams.set("ref", "qr");
  return url.toString();
};
