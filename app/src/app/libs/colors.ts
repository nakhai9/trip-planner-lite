/** Bảng màu Trip Builder — chỉ dùng hex (không dùng rgb/rgba trong mã nguồn). */
export const TB_COLORS = {
  primary: "#d97706",
  primaryDark: "#b45309",
  primaryLight: "#fbbf24",
  secondary: "#f59e0b",
  secondaryLight: "#fcd34d",
  warningLight: "#fef3c6",
  white: "#ffffff",
  black: "#000000",
  backgroundDefault: "#faf8f5",
  backgroundPaper: "#fffefb",
  grey900: "#171717",
} as const;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Nhận #RRGGBB hoặc #RGB và độ trong suốt 0..1 → #RRGGBBAA (8 ký tự hex).
 */
export function hexWithAlpha(hexColor: string, alpha: number): string {
  let hex = hexColor.trim().replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (hex.length !== 6) {
    return hexColor;
  }
  const a = Math.round(clamp(alpha, 0, 1) * 255);
  return `#${hex}${a.toString(16).padStart(2, "0")}`;
}
