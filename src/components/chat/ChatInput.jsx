import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send } from "lucide-react"

export default function ChatInput({ onSend }) {

  const [text, setText] = useState("")
  const textareaRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return

    onSend(text)
    setText("")
    textareaRef.current.style.height = "auto"
  }

  const handleInput = (e) => {
    setText(e.target.value)
    textareaRef.current.style.height = "auto"
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t bg-white/70 backdrop-blur p-4"
    >
      <div className="flex items-end gap-3 max-w-4xl mx-auto">

        {/* textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleInput}
          placeholder="พิมพ์ข้อความ..."
          className="
            flex-1
            resize-none
            bg-gray-100
            border border-gray-200
            rounded-2xl
            px-4 py-3
            outline-none
            focus:ring-2 focus:ring-blue-500
            transition
            max-h-40
            overflow-y-auto
          "
        />

        {/* send button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.1 }}
          type="submit"
          className="
            bg-blue-500
            hover:bg-blue-600
            text-white
            p-3
            rounded-full
            shadow-md
          "
        >
          <Send size={18} />
        </motion.button>

      </div>
    </form>
  )
}