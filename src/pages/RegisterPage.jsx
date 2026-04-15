import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", {
        email,
        username: email,
        password,
      });

      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);

      // ดึง user data
      api.get("/auth/me").then(userRes => {
        login(userRes.data);
        navigate("/chat");
      }).catch(err => {
        alert("Failed to get user data");
        navigate("/login");
      });
    } catch (err) {
      alert(err.response?.data?.detail || "Register failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSubmit}>Register</button>
    </div>
  );
}