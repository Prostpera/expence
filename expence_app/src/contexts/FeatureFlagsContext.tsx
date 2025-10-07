'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Flags = {
  requireCompletion: boolean;
  setRequireCompletion: (v: boolean) => void;
};

const Ctx = createContext<Flags | null>(null);
const KEY = 'exp_flags_require_completion';

export function FeatureFlagsProvider({ children }: { children: React.ReactNode }) {
  const [requireCompletion, setRequireCompletion] = useState<boolean>(true);

  // load once
  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw !== null) setRequireCompletion(raw === 'true');
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(KEY, String(requireCompletion));
  }, [requireCompletion]);

  const value = useMemo(() => ({ requireCompletion, setRequireCompletion }), [requireCompletion]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFeatureFlags() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useFeatureFlags must be used within FeatureFlagsProvider');
  return v;
}
