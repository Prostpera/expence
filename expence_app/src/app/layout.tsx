import './globals.css';
import type { Metadata } from 'next';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['500', '700'], // these match the cyberpunk style well
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
        {children}
      </body>
    </html>
  );
}