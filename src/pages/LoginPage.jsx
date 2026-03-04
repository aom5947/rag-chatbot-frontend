import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    login(email)
    navigate("/chat")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 relative">

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

      {/* Modal */}
      <div className="relative bg-white w-[420px] rounded-2xl shadow-xl border border-neutral-200 p-8">

        <h2 className="text-2xl font-semibold text-center text-neutral-900 mb-2">
          ลงชื่อเข้าใช้หรือสร้างบัญชี
        </h2>

        <p className="text-sm text-neutral-500 text-center mb-6">
          คุณจะได้รับคำตอบที่ฉลาดขึ้นและสามารถอัปโหลดไฟล์ได้
        </p>

        {/* Social Buttons */}
        <button className="w-full mb-3 py-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 transition">
          ดำเนินการต่อด้วย Google
        </button>

        <button className="w-full mb-3 py-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 transition">
          ดำเนินการต่อด้วย Apple
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-neutral-200"></div>
          <span className="px-3 text-sm text-neutral-400">หรือ</span>
          <div className="flex-1 h-px bg-neutral-200"></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="ที่อยู่อีเมล"
            className="w-full mb-4 px-4 py-3 rounded-xl bg-neutral-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-neutral-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-neutral-900 text-white py-3 rounded-xl hover:opacity-90 transition"
          >
            ดำเนินการต่อ
          </button>
        </form>

      </div>
    </div>
  )
}