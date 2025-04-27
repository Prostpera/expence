/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Original theme colors
      colors: {
        neon: '#39FF14',
        neonBlue: '#00FFFF',
        cyberPink: '#FF4DA6',
        cyberYellow: '#FFE600',
        cyberPurple: '#9B30FF',
        darkBg: '#0d0d0d',
        // Terminal theme colors
        terminal: {
          green: '#39FF14',
          dark: '#000000',
          glow: 'rgba(57, 255, 20, 0.8)',
        },
      },
      fontFamily: {
        techno: ['Orbitron', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace', 'JetBrains Mono'],
      },
      dropShadow: {
        neon: '0 0 6px #39FF14',
        intense: '0 0 10px #00FFFF',
        cyber: '0 0 8px #FF4DA6',
        terminal: '0 0 5px rgba(57, 255, 20, 0.8)',
      },
      animation: {
        'blink': 'blink 2s ease-in-out infinite',
        'terminal-on': 'terminal-on 1.5s cubic-bezier(0.23, 1, 0.32, 1) forwards',
        'scan': 'scan 4s linear',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '40%': { opacity: '0.8' },
        },
        'terminal-on': {
          '0%': {
            transform: 'scale(1, 0.8)',
            opacity: '0.3',
          },
          '50%': {
            transform: 'scale(1, 1)',
            opacity: '0.7',
          },
          '100%': {
            transform: 'scale(1, 1)',
            filter: 'contrast(1) brightness(1.2)',
            opacity: '1',
          },
        },
        scan: {
          '0%': { backgroundPosition: '0 -100vh' },
          '35%, 100%': { backgroundPosition: '0 100vh' },
        },
      },
    },
  },
  plugins: [],
};