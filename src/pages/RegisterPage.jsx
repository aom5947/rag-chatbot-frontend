import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        email,
        username: email,
        password,
      });

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.detail || "Register failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-[380px] bg-white p-8 rounded-2xl shadow-lg">

        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold">สมัครสมาชิก</h1>
          <p className="text-sm text-gray-400 mt-1">กรุณากรอกข้อมูลตามนี้เพื่อสมัครสมาชิก</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="อีเมล"
            className="w-full px-4 py-2 mb-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-300 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="username"
            placeholder="ชื่อผู้ใช้"
            className="w-full px-4 py-2 mb-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-300 outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            สมัครสมาชิก
          </button>
        </form>

      </div>
    </div>
  );
}