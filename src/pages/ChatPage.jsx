import { useState } from "react"
import Sidebar from "../components/layout/Sidebar"
import Message from "../components/chat/Message"
import ChatInput from "../components/chat/ChatInput"

export default function ChatPage() {
  const [isOpen, setIsOpen] = useState(true)
  const [messages, setMessages] = useState([])

  const handleSend = (text) => {
    const newMessage = { role: "user", content: text }

    setMessages((prev) => [...prev, newMessage])

    // 🔥 mock bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "กำลังประมวลผลคำตอบทางกฎหมาย..." }
      ])
    }, 800)
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-indigo-50 via-white to-indigo-100">

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <div className="h-14 bg-white/80 backdrop-blur-md border-b border-indigo-100 flex items-center px-6 shadow-sm">
          <h1 className="font-medium text-indigo-700">
            Legal Chat Assistant
          </h1>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <p className="text-neutral-400 text-center mt-20">
              เริ่มต้นสนทนาเกี่ยวกับข้อกฎหมายได้เลย...
            </p>
          ) : (
            messages.map((msg, index) => (
              <Message
                key={index}
                role={msg.role}
                content={msg.content}
              />
            ))
          )}
        </div>

        {/* Chat Input */}
        <ChatInput onSend={handleSend} />

      </div>
    </div>
  )
}