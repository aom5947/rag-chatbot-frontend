import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) return

    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
      return
    }

    login(email)
    
    // บันทึก profile จากข้อมูลสมัครสมาชิก
    const profile = {
      name: `${user.firstName} ${user.lastName}`,
      username: user.email,
      avatar: null
    }
    localStorage.setItem("profile", JSON.stringify(profile))
    
    navigate("/chat")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      <div className="w-[420px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-indigo-100 dark:border-gray-700 rounded-xl shadow-2xl p-10 transition-all duration-300 hover:shadow-indigo-200 dark:hover:shadow-gray-700">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">⚖️</div>
          <h1 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300">
            Legal AI Assistant
          </h1>
          <p className="text-sm text-neutral-500 dark:text-gray-400 mt-2">
            ระบบผู้ช่วยตอบคำถามด้านกฎหมายอัจฉริยะ
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-neutral-600 dark:text-gray-400 mb-1">
              อีเมล
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-gray-600 bg-neutral-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm text-neutral-600 dark:text-gray-400 mb-1">
              รหัสผ่าน
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-gray-600 bg-neutral-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition transform hover:scale-[1.02]"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/register")}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
          >
            สมัครสมาชิก
          </button>
        </div>

      </div>
    </div>
  )
}