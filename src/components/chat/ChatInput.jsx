import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Send } from "lucide-react"
import SelectModel from "./SelectModel"
import { toast } from "sonner"

export default function ChatInput({ onSend }) {

  const [text, setText] = useState("")
  const [model, setModel] = useState("")
  const textareaRef = useRef(null)

  const handleModelChange = (newModel) => {
    if (newModel && newModel !== model) {
      toast.success(`เลือกโมเดล ${newModel} แล้ว`)
    }
    setModel(newModel)
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (!text.trim()) return


    if (!model) {
      toast.error("กรุณาเลือกโมเดลก่อนส่งข้อความ")
      // alert("กรุณาเลือกโมเดลก่อนส่งข้อความ")
      return
    }
  

    onSend(text, model)
    setText("")
    textareaRef.current.style.height = "auto"
  }

  const handleInput = (e) => {
    setText(e.target.value)
    textareaRef.current.style.height = "auto"
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t bg-white/70 backdrop-blur p-4"
    >
      <div className="flex items-center gap-3 max-w-4xl mx-auto">

        {/* textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="พิมพ์ข้อความ..."
          className="
            flex-1
            resize-none
            bg-gray-100
            border border-gray-200
            rounded-md
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

        <SelectModel value={model} onChange={handleModelChange} />
      </div>
    </form>
  )
}