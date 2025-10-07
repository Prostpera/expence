'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { addXp, applyQuestReward, toProgress, DEFAULT_CURVE, type LevelState } from '@/types/expsys';

/** Change this if/when you have auth: e.g., `EXP_USER_PROGRESS_${userId}` */
const STORAGE_KEY = (userId?: string) => `EXP_USER_PROGRESS_${userId ?? 'anon'}`;

type Ctx = {
  state: LevelState;
  progress: ReturnType<typeof toProgress>;
  awardRawXp: (amount: number) => void;
  awardQuestXp: (quest: any) => void;
  reset: (opts?: { forget?: boolean }) => void;
  /** optionally set userId to separate per-account storage */
  setUserId: (id: string | undefined) => void;
  userId?: string;
};

const C = createContext<Ctx | null>(null);

const INITIAL: LevelState = { level: 1, xp: 0, totalXp: 0 };

export function UserProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LevelState>(INITIAL);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const loadedRef = useRef(false);
  const saveTimer = useRef<number | null>(null);

  // Load from localStorage once (or when userId changes)
  useEffect(() => {
    const key = STORAGE_KEY(userId);
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        // minimally validate shape
        if (
          typeof parsed?.level === 'number' &&
          typeof parsed?.xp === 'number' &&
          (typeof parsed?.totalXp === 'number' || typeof parsed?.totalXp === 'undefined')
        ) {
          setState({
            level: parsed.level,
            xp: parsed.xp,
            totalXp: parsed.totalXp ?? parsed.level * 0 + parsed.xp, // fallback
          });
        }
      }
    } catch (_) {
      // ignore corrupt storage
    }
    loadedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Debounced save to localStorage whenever state changes
  useEffect(() => {
    if (!loadedRef.current) return; // don’t save initial before load
    const key = STORAGE_KEY(userId);
    // small debounce so rapid updates don’t spam storage
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(
          key,
          JSON.stringify({ level: state.level, xp: state.xp, totalXp: state.totalXp ?? 0 })
        );
      } catch (_) {
        // storage quota or private mode—ignore silently
      }
    }, 150);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [state, userId]);

  // Public API
  const awardRawXp = (amount: number) => {
    const res = addXp(state, amount, DEFAULT_CURVE);
    setState(res.state);
  };

  const awardQuestXp = (quest: any) => {
    const res = applyQuestReward(state, quest, DEFAULT_CURVE);
    setState(res.state);
  };

  const reset = (opts?: { forget?: boolean }) => {
    setState(INITIAL);
    if (opts?.forget) {
      try {
        localStorage.removeItem(STORAGE_KEY(userId));
      } catch (_) {}
    }
  };

  const progress = useMemo(() => toProgress(state, DEFAULT_CURVE), [state]);

  return (
    <C.Provider value={{ state, progress, awardRawXp, awardQuestXp, reset, setUserId, userId }}>
      {children}
    </C.Provider>
  );
}

export function useUserProgress() {
  const ctx = useContext(C);
  if (!ctx) throw new Error('useUserProgress must be used within UserProgressProvider');
  return ctx;
}
