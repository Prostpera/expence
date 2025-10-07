'use client';
import { useUserProgress } from '@/contexts/UserProgressContext';

export default function LevelBadge() {
  const { progress } = useUserProgress();

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-300">Level {progress.level}</span>
      <div className="w-40 bg-gray-800 h-2 rounded">
        <div
          className="h-2 bg-emerald-500 rounded"
          style={{ width: `${Math.round(progress.progress * 100)}%` }}
        />
      </div>
      <span className="text-xs text-gray-400">
        {progress.xp}/{progress.nextLevelXp} XP
      </span>
    </div>
  );
}
