import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (email) => {
    const fakeUser = { email }
    setUser(fakeUser)
    localStorage.setItem("user", JSON.stringify(fakeUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("profile")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}