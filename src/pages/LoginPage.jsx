import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        username: email,
        password,
      });

      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);

      // ดึง user data
      api.get("/users/me").then(userRes => {
        login(userRes.data);
        navigate("/chat");
      }).catch(err => {
        alert("Failed to get user data");
        navigate("/login");
      });
    } catch (err) {
      alert(err.response?.data?.detail || "Login failed");
    }
  };

  const handleGoogle = () => {
    window.location.href = "http://localhost:8000/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="w-[380px] bg-white p-8 rounded-2xl shadow-lg">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold">เข้าสู่ระบบ</h1>
          <p className="text-sm text-gray-400 mt-1">Legal AI Assistant</p>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition"
        >
          {/* Google Icon */}
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.72 1.22 9.22 3.6l6.85-6.85C35.68 2.43 30.2 0 24 0 14.64 0 6.58 5.38 2.56 13.22l7.98 6.2C12.3 13.3 17.66 9.5 24 9.5z"/>
            <path fill="#34A853" d="M46.5 24.5c0-1.64-.14-3.22-.4-4.75H24v9h12.7c-.55 2.96-2.2 5.47-4.68 7.17l7.2 5.6C43.9 37.5 46.5 31.5 46.5 24.5z"/>
            <path fill="#4A90E2" d="M10.54 28.42A14.5 14.5 0 019.5 24c0-1.54.27-3.02.76-4.42l-7.98-6.2A24 24 0 000 24c0 3.9.94 7.58 2.56 10.78l7.98-6.36z"/>
            <path fill="#FBBC05" d="M24 48c6.48 0 11.92-2.14 15.9-5.82l-7.2-5.6c-2 1.34-4.56 2.12-8.7 2.12-6.34 0-11.7-3.8-13.46-9.42l-7.98 6.36C6.58 42.62 14.64 48 24 48z"/>
          </svg>

          <span className="text-sm">เข้าสู่ระบบด้วย Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400">หรือ</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="อีเมล"
            className="w-full px-4 py-2 mb-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-300 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="รหัสผ่าน"
            className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-300 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2.5 rounded-lg hover:opacity-90 transition"
          >
            เข้าสู่ระบบ
          </button>

        </form>

        {/* Register */}
        <div className="text-center mt-5 text-sm text-gray-500">
          ยังไม่มีบัญชี?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-black font-medium hover:underline"
          >
            สมัครสมาชิก
          </button>
        </div>

      </div>
    </div>
  );
}