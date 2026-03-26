/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050B18",
        surface: "#0D1B2A",
        primary: "#00D4FF",
        warning: "#FFB800",
        danger: "#FF4560",
        success: "#00E396",
        textPrimary: "#E8F4FD",
        textMuted: "#6B8CAE",
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Syne"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0,212,255,0.15)',
        'neon-warning': '0 0 20px rgba(255,184,0,0.15)',
        'neon-danger': '0 0 20px rgba(255,69,96,0.15)',
      },
    },
  },
  plugins: [],
}
