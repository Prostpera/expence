'use client';

import Link from 'next/link';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { useUserProgress } from '@/contexts/UserProgressContext'; // ← add

export default function Header() {
  const { progress } = useUserProgress(); // ← read current level

  return (
    <header className="bg-gray-900 shadow-md relative z-20 border-b border-purple-900">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600"></div>

      <div className="mx-auto w-full px-4 py-3 flex items-center justify-between">
        {/* User Info */}
        <div className="flex flex-col">
          <div className="text-white font-medium text-sm">USER_42X</div>
          <div className="text-xs text-cyan-400">LEVEL {progress.level}</div>{/* ← replaced */}
        </div>

        {/* Bread Currency */}
        <div className="cyber-border cyber-border-yellow flex items-center bg-gray-800 bg-opacity-80 px-2 py-1 border border-yellow-700 relative">
          <span className="text-yellow-400 font-bold mr-1">🍞</span>
          <span className="text-yellow-400 font-medium">1,240</span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-2">
          {/* Dashboard Button */}
          <Link href="/dashboard" className="relative px-3 py-1 text-purple-400 group overflow-hidden bg-purple-500 border border-purple-900 bg-opacity-15 hover:bg-opacity-50">
            <div className="relative flex items-center">
              <LayoutDashboard size={14} className="mr-1" />
              <span className="text-xs">DASH</span>
            </div>
          </Link>

          {/* Exit Button */}
          <Link href="/" className="relative px-3 py-1 text-red-400 group overflow-hidden bg-gray-800 border border-red-900">
            <div className="absolute bottom-0 left-0 w-5 h-1 bg-red-500 group-hover:w-full transition-all duration-300"></div>
            <div className="relative flex items-center">
              <LogOut size={14} className="mr-1" />
              <span className="text-xs">EXIT</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
