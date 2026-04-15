import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return {
        id: decoded.sub,
        username: decoded.name || decoded.preferred_username || "",
        email: decoded.email || "",
        avatar_url: decoded.picture || null,
      };
    } catch {
      localStorage.clear();
      return null;
    }
  });

  // ✅ โหลด user จาก backend ตอนเปิดเว็บ
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      api.get("/auth/me").then(res => {
        setUser(res.data);
      }).catch(() => {
        // ถ้า /auth/me fail แต่มี token ให้ decode และ set user ชั่วคราว
        try {
          const decoded = jwtDecode(token);
          setUser({
            id: decoded.sub,
            username: decoded.name || decoded.preferred_username || "",
            email: decoded.email || "",
            avatar_url: decoded.picture || null,
          });
        } catch {
          localStorage.clear();
          setUser(null);
        }
      });
    }
  }, []);

  // ✅ login (รับ user data จาก backend)
  const login = (userData) => {
    setUser(userData);
  };

 const logout = async () => {
  const refresh = localStorage.getItem("refresh_token");

  try {
    await fetch("http://localhost:8000/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
      },
      body: JSON.stringify({ refresh_token: refresh }),
    });
  } catch (err) {
    console.warn("Logout error:", err);
  }

  // 🔥 เคลียร์ state
  localStorage.clear();
  setUser(null);

  // 🔥 redirect
  window.location.href = "/login";
};

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);