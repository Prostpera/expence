'use client';

import { useFeatureFlags } from '@/contexts/FeatureFlagsContext';

export default function RequireCompletionToggle() {
  const { requireCompletion, setRequireCompletion } = useFeatureFlags();

  return (
    <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
      <input
        type="checkbox"
        checked={requireCompletion}
        onChange={(e) => setRequireCompletion(e.target.checked)}
        className="peer sr-only"
      />
      <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-700 peer-checked:bg-cyan-500 transition-colors">
        <span className="inline-block h-4 w-4 translate-x-0 peer-checked:translate-x-4 transform rounded-full bg-white transition-transform" />
      </span>
      <span>Require task completion</span>
    </label>
  );
}
