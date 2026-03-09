import { useState } from "react"

export default function ChatInput({ onSend }) {

  const [text, setText] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!text.trim()) return

    onSend(text)   // 🔥 ส่งข้อความไป ChatPage
    setText("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t p-4 flex gap-2"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border rounded px-3 py-2"
        placeholder="พิมพ์ข้อความ..."
      />

      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 rounded"
      >
        Send
      </button>

    </form>
  )
}