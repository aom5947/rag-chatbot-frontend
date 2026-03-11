import { useState } from "react"

export default function ChatInput({ onSend }) {

  const [text, setText] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!text.trim()) return

    onSend(text)
    setText("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t bg-white dark:bg-gray-900 p-4"
    >
      <div className="flex items-center gap-3 max-w-4xl mx-auto">

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="พิมพ์ข้อความ..."
          className="
            flex-1
            border
            border-gray-300
            dark:border-gray-700
            bg-gray-50
            dark:bg-gray-800
            rounded-full
            px-4
            py-2
            outline-none
            focus:ring-2
            focus:ring-indigo-500
            transition
          "
        />

        <button
          type="submit"
          className="
            bg-indigo-600
            hover:bg-indigo-700
            text-white
            px-5
            py-2
            rounded-full
            font-medium
            transition
            shadow-sm
          "
        >
          Send
        </button>

      </div>
    </form>
  )
}