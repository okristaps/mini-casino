import { Phases } from "@types";

export const getBgColor = (phase: string, bet: number, multiplier: number): string => {
  return phase === Phases.gameResult
    ? bet > 0 && multiplier
      ? "#00ff00"
      : bet === 0 && multiplier
      ? "#ff0000"
      : "transparent"
    : bet > 0
    ? "#808080"
    : "transparent";
};
