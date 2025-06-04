"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons"
import { useTheme } from "./ThemeProvider"

export function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme()

  const handleToggle = () => {
    console.log("Theme toggle clicked, current theme:", theme)
    toggleTheme()
  }

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-110 ${className}`}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <FontAwesomeIcon
        icon={theme === "dark" ? faSun : faMoon}
        className={`w-5 h-5 transition-all duration-300 ${theme === "dark" ? "text-yellow-400 rotate-180" : "text-blue-500"
          }`}
      />
    </button>
  )
}

export default ThemeToggle
