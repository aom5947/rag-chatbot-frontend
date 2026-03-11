import { createContext, useContext, useState, useEffect } from "react"

const DarkModeContext = createContext()

export function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"
  })

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem("darkMode", newMode.toString())
  }

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error("useDarkMode must be used within DarkModeProvider")
  }
  return context
}