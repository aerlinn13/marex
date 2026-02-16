import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        marex: {
          purple: "#793690",
          navy: "#1C1B4A",
          gray: "#505068",
          light: "#F5F5F8",
          bg: {
            deepest: "#0d0d1a",
            panel: "#141428",
            card: "#1a1a33",
            elevated: "#252540",
            hover: "#2a2a4a",
          },
          border: {
            subtle: "#333355",
            prominent: "#444477",
          },
          text: {
            primary: "#e0e0f0",
            secondary: "#c8c8e0",
            muted: "#a8a8cc",
          },
          accent: {
            pink: "#e91e8c",
            purple: "#7b42f6",
          },
          sell: "#ff4466",
          buy: "#4488ff",
          buyAlt: "#8866ff",
          positive: "#22cc66",
          warning: "#ff8800",
          tabActive: "#2d1f5e",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "flash-green": {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "#22c55e" },
        },
        "flash-red": {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "#ef4444" },
        },
        "ticker-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "price-flash-up": {
          "0%, 100%": { backgroundColor: "transparent" },
          "50%": { backgroundColor: "rgba(34, 204, 102, 0.15)" },
        },
        "price-flash-down": {
          "0%, 100%": { backgroundColor: "transparent" },
          "50%": { backgroundColor: "rgba(255, 68, 102, 0.15)" },
        },
      },
      animation: {
        "gradient-shift": "gradient-shift 3s ease infinite",
        "flash-green": "flash-green 0.6s ease-in-out",
        "flash-red": "flash-red 0.6s ease-in-out",
        "ticker-scroll": "ticker-scroll 30s linear infinite",
        "price-flash-up": "price-flash-up 0.5s ease-in-out",
        "price-flash-down": "price-flash-down 0.5s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
