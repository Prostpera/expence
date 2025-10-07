export type LevelState = {
  level: number;
  xp: number;
  totalXp?: number;
};

export type LevelProgress = LevelState & {
  nextLevelXp: number;
  progress: number;
};

export type XPCurve = {
  base: number;
  factor: number;
  mode: "linear" | "quadratic" | "exponential";
  growth?: number;
  maxLevel?: number;
};

export const DEFAULT_CURVE: XPCurve = {
  base: 100,
  factor: 50,
  mode: "quadratic",
  growth: 1.15,
};

export function xpNeededForNext(level: number, curve: XPCurve = DEFAULT_CURVE): number {
  if (curve.maxLevel && level >= curve.maxLevel) return Infinity;
  switch (curve.mode) {
    case "linear":
      return curve.base + curve.factor * (level - 1);
    case "exponential":
      return curve.base * Math.pow(curve.growth ?? 1.1, level - 1);
    default:
      return curve.base + curve.factor * Math.pow(level - 1, 2);
  }
}

export function addXp(prev: LevelState, amount: number, curve: XPCurve = DEFAULT_CURVE) {
  let level = prev.level;
  let xp = prev.xp + amount;
  let gained = 0;

  while (xp >= xpNeededForNext(level, curve) && (!curve.maxLevel || level < curve.maxLevel)) {
    xp -= xpNeededForNext(level, curve);
    level++;
    gained++;
  }

  return { state: { level, xp, totalXp: (prev.totalXp ?? 0) + amount }, gained };
}

export function toProgress(state: LevelState, curve: XPCurve = DEFAULT_CURVE): LevelProgress {
  const next = xpNeededForNext(state.level, curve);
  const progress = Math.min(1, state.xp / next);
  return { ...state, nextLevelXp: next, progress };
}

export function questXp(quest: any): number {
  return quest?.expReward ?? quest?.xpReward ?? quest?.xp ?? 0;
}

export function applyQuestReward(prev: LevelState, quest: any, curve: XPCurve = DEFAULT_CURVE) {
  return addXp(prev, questXp(quest), curve);
}
