import { useState } from "react"

export default function ChatInput({ onSend }) {
  const [message, setMessage] = useState("")

  const handleSend = () => {
    if (!message.trim()) return
    onSend(message)
    setMessage("")
  }

  return (
    <div className="border-t border-indigo-100 bg-white/80 backdrop-blur-md p-4 flex gap-3">
      <input
        type="text"
        placeholder="พิมพ์คำถามด้านกฎหมาย..."
        className="flex-1 px-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-indigo-400 outline-none"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />

      <button
        onClick={handleSend}
        className="bg-indigo-600 text-white px-5 rounded-lg hover:bg-indigo-700 transition"
      >
        ส่ง
      </button>
    </div>
  )
}