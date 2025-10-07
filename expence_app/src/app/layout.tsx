import './globals.css';
import type { Metadata } from 'next';
import { Orbitron } from 'next/font/google';
import { UserProgressProvider } from '@/contexts/UserProgressContext';
import { FeatureFlagsProvider } from '@/contexts/FeatureFlagsContext';
import LevelBadge from '@/components/LevelBadge';
import RequireCompletionToggle from '@/components/RequireCompletionToggle';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: 'Expence App',
  description: 'Track your expenses easily',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} dark`}>
      <body className="min-h-screen bg-gray-950 text-gray-100 font-techno">
        <FeatureFlagsProvider>
          <UserProgressProvider>
            {/* top bar */}
            <div className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-white/10 bg-gray-900/70 backdrop-blur px-4 py-2">
              <LevelBadge />
              <RequireCompletionToggle />
            </div>
            {children}
          </UserProgressProvider>
        </FeatureFlagsProvider>
      </body>
    </html>
  );
}
