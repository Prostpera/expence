import './globals.css';
import type { Metadata } from 'next';
import { Orbitron } from 'next/font/google';
import { QuestWrapper } from '@/components/QuestWrapper';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: 'Expence App',
  description: 'Track your expenses easily',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} dark`}>
      <body className="min-h-screen bg-gray-950 text-gray-100 font-techno">
        <QuestWrapper>
          {children}
        </QuestWrapper>
      </body>
    </html>
  );
}