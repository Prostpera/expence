// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: '#39FF14',
        neonBlue: '#00FFFF',
        cyberPink: '#FF4DA6',
        cyberYellow: '#FFE600',
        cyberPurple: '#9B30FF',
        darkBg: '#0d0d0d',
      },
      fontFamily: {
        techno: ['Orbitron', 'sans-serif'],
      },
      dropShadow: {
        neon: '0 0 6px #39FF14',
        intense: '0 0 10px #00FFFF',
        cyber: '0 0 8px #FF4DA6',
      },
    },
  },
  plugins: [],
}