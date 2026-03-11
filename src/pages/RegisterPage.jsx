import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthDate: ""
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.birthDate
    ) {
      alert("กรุณากรอกข้อมูลให้ครบ")
      return
    }

    const existing = JSON.parse(localStorage.getItem("registeredUsers") || "[]")

    if (existing.some(u => u.email === form.email)) {
      alert("อีเมลนี้ถูกใช้งานแล้ว")
      return
    }

    const newUsers = [...existing, form]
    localStorage.setItem("registeredUsers", JSON.stringify(newUsers))

    // บันทึก profile
    const profile = {
      name: `${form.firstName} ${form.lastName}`,
      username: form.email,
      avatar: null
    }
    localStorage.setItem("profile", JSON.stringify(profile))

    login(form.email)
    navigate("/chat")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      <div className="w-[460px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-indigo-100 dark:border-gray-700 rounded-xl shadow-2xl p-10 transition-all duration-300 hover:shadow-indigo-200 dark:hover:shadow-gray-700">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">⚖️</div>
          <h1 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300">
            สร้างบัญชีผู้ใช้งาน
          </h1>
          <p className="text-sm text-neutral-500 dark:text-gray-400 mt-2">
            ลงทะเบียนเพื่อใช้งานระบบ Legal AI Assistant
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="flex gap-3">
            <input
              type="text"
              name="firstName"
              placeholder="ชื่อ"
              className="w-1/2 px-4 py-3 rounded-lg border border-neutral-200 dark:border-gray-600 bg-neutral-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none transition"
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="นามสกุล"
              className="w-1/2 px-4 py-3 rounded-lg border border-neutral-200 dark:border-gray-600 bg-neutral-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none transition"
              onChange={handleChange}
            />
          </div>

          <input
            type="date"
            name="birthDate"
            className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-gray-600 bg-neutral-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none transition"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="ที่อยู่อีเมล"
            className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-gray-600 bg-neutral-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none transition"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="รหัสผ่าน"
            className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-gray-600 bg-neutral-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-400 outline-none transition"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition transform hover:scale-[1.02]"
          >
            สมัครสมาชิก
          </button>

        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
          >
            มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
          </button>
        </div>

      </div>
    </div>
  )
}