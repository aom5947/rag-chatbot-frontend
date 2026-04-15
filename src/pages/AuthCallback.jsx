import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/axios";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const called = useRef(false); // 🔥 กันยิงซ้ำ

  useEffect(() => {
    if (called.current) return;   // 🔥 กัน run รอบที่ 2
    called.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      navigate("/login");
      return;
    }

    api.post("/auth/exchange", { code })
      .then(res => {
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);
        return api.get("/auth/me");
      })
      .then(res => {
        login(res.data);

        window.history.replaceState({}, document.title, "/oauth-callback");

        navigate("/chat");
      })
      .catch(err => {
        console.error("OAuth error:", err);
        navigate("/login");
      });

  }, []);

  return <p className="text-center mt-10">Logging in...</p>;
}