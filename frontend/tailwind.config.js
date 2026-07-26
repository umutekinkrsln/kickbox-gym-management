/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#121110",      // ana arka plan - mat, koyu, ring canvasi gibi
        surface: "#1C1B1A",     // kart/panel arka planlari
        surfaceHover: "#262422",
        border: "#2E2C2A",
        accent: "#D62828",      // ring kirmizisi - vurgu rengi
        accentHover: "#B91F1F",
        ink: "#F2F0EC",         // ana metin
        muted: "#9C9691",       // ikincil metin
        active: "#4C9F70",      // aktif uyelik
        warning: "#E0A030",     // uyeligi yakinda bitecek
        expired: "#8A5252",     // suresi dolmus
      },
      fontFamily: {
        display: ["'Bebas Neue'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      letterSpacing: {
        wide2: ".08em",
      },
    },
  },
  plugins: [],
}
