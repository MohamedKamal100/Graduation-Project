// "use client"

// import { createContext, useContext, useEffect, useState } from "react"

// const ThemeContext = createContext({
//   theme: "light",
//   toggleTheme: () => { },
//   setTheme: (theme) => { },
// })

// export const useTheme = () => {
//   const context = useContext(ThemeContext)
//   if (!context) {
//     throw new Error("useTheme must be used within a ThemeProvider")
//   }
//   return context
// }

// export function ThemeProvider({ children }) {
//   // Initialize theme from localStorage or system preference
//   const [theme, setTheme] = useState(() => {
//     if (typeof window !== "undefined") {
//       const savedTheme = localStorage.getItem("theme")
//       if (savedTheme) {
//         return savedTheme
//       }

//       // Check system preference
//       if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
//         return "dark"
//       }
//     }
//     return "light"
//   })

//   // Update document class when theme changes
//   useEffect(() => {
//     const root = window.document.documentElement
//     root.classList.remove("light", "dark")
//     root.classList.add(theme)
//     localStorage.setItem("theme", theme)
//   }, [theme])

//   // Listen for system preference changes
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

//       const handleChange = (e) => {
//         if (!localStorage.getItem("theme")) {
//           setTheme(e.matches ? "dark" : "light")
//         }
//       }

//       mediaQuery.addEventListener("change", handleChange)
//       return () => mediaQuery.removeEventListener("change", handleChange)
//     }
//   }, [])

//   const toggleTheme = () => {
//     setTheme(theme === "light" ? "dark" : "light")
//   }

//   return <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>
// }

// export default ThemeProvider
"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => { },
  setTheme: (theme) => { },
})

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export function ThemeProvider({ children }) {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme")
      if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
        return savedTheme
      }

      // Check system preference
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark"
      }
    }
    return "light"
  })

  // Update document class when theme changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Applying theme:", theme)
      const root = window.document.documentElement
      const body = window.document.body

      // Remove existing theme classes
      root.classList.remove("light", "dark")
      body.classList.remove("light", "dark")

      // Add new theme class to both html and body
      root.classList.add(theme)
      body.classList.add(theme)

      // Save to localStorage
      localStorage.setItem("theme", theme)

      // Also set data attribute for better CSS targeting
      root.setAttribute("data-theme", theme)
      body.setAttribute("data-theme", theme)

      // Force a style recalculation
      root.style.colorScheme = theme

      console.log("Theme applied successfully:", theme)
    }
  }, [theme])

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

      const handleChange = (e) => {
        // Only auto-switch if user hasn't manually set a preference
        const savedTheme = localStorage.getItem("theme")
        if (!savedTheme) {
          setTheme(e.matches ? "dark" : "light")
        }
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    console.log("Toggling theme from", theme, "to", newTheme)
    setTheme(newTheme)
  }

  const value = {
    theme,
    toggleTheme,
    setTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
