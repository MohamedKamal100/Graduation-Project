"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme")
      return savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    }
    return "light"
  })

  const [primaryColor, setPrimaryColor] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("primaryColor") || "purple"
    }
    return "purple"
  })

  // Color palette options
  const colorOptions = {
    purple: {
      primary: "from-purple-600 to-indigo-600",
      button: "bg-purple-600 hover:bg-purple-700",
      text: "text-purple-600",
      border: "border-purple-600",
      light: "bg-purple-100",
      dark: "bg-purple-900/30",
    },
    blue: {
      primary: "from-blue-600 to-cyan-600",
      button: "bg-blue-600 hover:bg-blue-700",
      text: "text-blue-600",
      border: "border-blue-600",
      light: "bg-blue-100",
      dark: "bg-blue-900/30",
    },
    green: {
      primary: "from-emerald-600 to-teal-600",
      button: "bg-emerald-600 hover:bg-emerald-700",
      text: "text-emerald-600",
      border: "border-emerald-600",
      light: "bg-emerald-100",
      dark: "bg-emerald-900/30",
    },
    amber: {
      primary: "from-amber-500 to-orange-600",
      button: "bg-amber-500 hover:bg-amber-600",
      text: "text-amber-500",
      border: "border-amber-500",
      light: "bg-amber-100",
      dark: "bg-amber-900/30",
    },
    rose: {
      primary: "from-rose-600 to-pink-600",
      button: "bg-rose-600 hover:bg-rose-700",
      text: "text-rose-600",
      border: "border-rose-600",
      light: "bg-rose-100",
      dark: "bg-rose-900/30",
    },
  }

  // Get current color scheme
  const colors = colorOptions[primaryColor]

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  // Change primary color
  const changeColor = (color) => {
    if (colorOptions[color]) {
      setPrimaryColor(color)
      localStorage.setItem("primaryColor", color)
    }
  }

  // Apply theme to document
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(theme)
      localStorage.setItem("theme", theme)
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, primaryColor, changeColor, colors }}>
      {children}
    </ThemeContext.Provider>
  )
}
