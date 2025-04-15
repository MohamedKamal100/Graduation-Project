const flowbite = require("flowbite-react/tailwind")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
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
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        info: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
          950: "#083344",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background, #ffffff)",
          foreground: "var(--sidebar-foreground, #1f2937)",
          border: "var(--sidebar-border, #e5e7eb)",
          primary: "var(--sidebar-primary, #3b82f6)",
          "primary-foreground": "var(--sidebar-primary-foreground, #ffffff)",
          accent: "var(--sidebar-accent, #f3f4f6)",
          "accent-foreground": "var(--sidebar-accent-foreground, #1f2937)",
          ring: "var(--sidebar-ring, #3b82f6)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        heading: [
          "Poppins",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        slideDown: "slideDown 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bounce: "bounce 1s infinite",
        spin: "spin 1s linear infinite",
        ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        scaleIn: "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": { maxHeight: "0", opacity: "0" },
          "100%": { maxHeight: "500px", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        sidebar: "4px 0 15px -3px rgba(0, 0, 0, 0.1)",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
      gridTemplateColumns: {
        sidebar: "auto 1fr",
        dashboard: "repeat(auto-fit, minmax(250px, 1fr))",
      },
      maxWidth: {
        sidebar: "280px",
        "sidebar-collapsed": "80px",
      },
    },
  },
  plugins: [
    flowbite.plugin(),
    require("tailwindcss-animate"),
    ({ addUtilities }) => {
      const newUtilities = {
        ".line-clamp-1": {
          display: "-webkit-box",
          "-webkit-line-clamp": "1",
          "-webkit-box-orient": "vertical",
          overflow: "hidden",
        },
        ".line-clamp-2": {
          display: "-webkit-box",
          "-webkit-line-clamp": "2",
          "-webkit-box-orient": "vertical",
          overflow: "hidden",
        },
        ".line-clamp-3": {
          display: "-webkit-box",
          "-webkit-line-clamp": "3",
          "-webkit-box-orient": "vertical",
          overflow: "hidden",
        },
        ".text-balance": {
          textWrap: "balance",
        },
        ".text-pretty": {
          textWrap: "pretty",
        },
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".scrollbar-thin": {
          "scrollbar-width": "thin",
          "&::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "rgba(0, 0, 0, 0.4)",
          },
        },
        ".truncate-text": {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
        ".break-anywhere": {
          wordBreak: "break-word",
          overflowWrap: "break-word",
        },
      }
      addUtilities(newUtilities)
    },
    ({ addComponents }) => {
      const components = {
        ".card-hover-effect": {
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
        },
        ".sidebar-item": {
          transition: "background-color 0.2s ease, color 0.2s ease",
          "&:hover": {
            backgroundColor: "var(--sidebar-accent, #f3f4f6)",
            color: "var(--sidebar-accent-foreground, #1f2937)",
          },
          "&.active": {
            backgroundColor: "var(--sidebar-primary, #3b82f6)",
            color: "var(--sidebar-primary-foreground, #ffffff)",
          },
        },
      }
      addComponents(components)
    },
    ({ addBase }) => {
      addBase({
        ":root": {
          "--sidebar-width": "280px",
          "--sidebar-width-collapsed": "80px",
          "--header-height": "64px",
          "--radius": "0.5rem",
          "--sidebar-background": "#ffffff",
          "--sidebar-foreground": "#1f2937",
          "--sidebar-border": "#e5e7eb",
          "--sidebar-primary": "#3b82f6",
          "--sidebar-primary-foreground": "#ffffff",
          "--sidebar-accent": "#f3f4f6",
          "--sidebar-accent-foreground": "#1f2937",
          "--sidebar-ring": "#3b82f6",
        },
        ".dark": {
          "--sidebar-background": "#1f2937",
          "--sidebar-foreground": "#f9fafb",
          "--sidebar-border": "#374151",
          "--sidebar-primary": "#3b82f6",
          "--sidebar-primary-foreground": "#ffffff",
          "--sidebar-accent": "#374151",
          "--sidebar-accent-foreground": "#f9fafb",
          "--sidebar-ring": "#3b82f6",
        },
      })
    },
  ],
}
