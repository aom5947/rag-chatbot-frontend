import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

import Sidebar from "../components/layout/Sidebar"
import ChatInput from "../components/chat/ChatInput"
import Message from "../components/chat/Message"
import EditProfileModal from "../components/EditProfileModal"

import { useAuth } from "../context/AuthContext"
import { streamChatMessage } from "../services/api"

export default function ChatPage() {

  const [isOpen, setIsOpen] = useState(true)
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [openProfileModal, setOpenProfileModal] = useState(false)

  const { user } = useAuth()

  const bottomRef = useRef(null)

  // โหลด chat
  useEffect(() => {
    const saved = localStorage.getItem("chats")
    if (saved) {
      const parsed = JSON.parse(saved)
      setChats(parsed)
      setActiveChat(parsed[0]?.id)
    } else {
      const firstChat = { id: Date.now(), title: "New Chat", messages: [] }
      setChats([firstChat])
      setActiveChat(firstChat.id)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats))
  }, [chats])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end"
    })
  }, [chats])

  const createChat = () => {
    const newChat = { id: Date.now(), title: "New Chat", messages: [] }
    setChats(prev => [newChat, ...prev])
    setActiveChat(newChat.id)
  }

  const handleSend = async (text) => {
    if (!activeChat) return

    const userMsg = { role: "user", content: text }

    setChats(prev =>
      prev.map(chat =>
        chat.id === activeChat
          ? {
              ...chat,
              title: chat.messages.length === 0 ? text.slice(0, 20) : chat.title,
              messages: [...chat.messages, userMsg]
            }
          : chat
      )
    )

    const botMsg = { role: "assistant", content: "" }

    setChats(prev =>
      prev.map(chat =>
        chat.id === activeChat
          ? { ...chat, messages: [...chat.messages, botMsg] }
          : chat
      )
    )

    try {
      await streamChatMessage(
        text,
        String(activeChat),
        (token) => {
          setChats(prev =>
            prev.map(chat =>
              chat.id === activeChat
                ? {
                    ...chat,
                    messages: chat.messages.map((msg, i) =>
                      i === chat.messages.length - 1
                        ? { ...msg, content: msg.content + token }
                        : msg
                    )
                  }
                : chat
            )
          )
        },
        () => {}
      )
    } catch (error) {
      setChats(prev =>
        prev.map(chat =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: chat.messages.map((msg, i) =>
                  i === chat.messages.length - 1
                    ? { ...msg, content: `❌ ${error.message}` }
                    : msg
                )
              }
            : chat
        )
      )
    }
  }

  const currentChat = chats.find(c => c.id === activeChat) || { messages: [] }

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">

      {/* Sidebar Animation */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: isOpen ? 0 : -250 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <Sidebar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          chats={chats}
          setActiveChat={setActiveChat}
          createChat={createChat}
          setOpenProfileModal={setOpenProfileModal}
          user={user}
        />
      </motion.div>

      <div className="flex-1 flex flex-col w-full">

        {/* Navbar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-14 flex items-center justify-between px-4 border-b border-gray-200 backdrop-blur bg-white/70"
        >
          <div className="font-medium">Legal Assistant</div>
          {user && (
            <div className="text-sm text-gray-500">
              {user?.name}
            </div>
          )}
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

          {currentChat.messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-24 text-gray-400"
            >
              เริ่มต้นพิมพ์คำถามของคุณ
            </motion.div>
          )}

          <AnimatePresence>
            {currentChat.messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex flex-col"
              >
                <div
                  className={`text-xs mb-1 ${
                    msg.role === "user"
                      ? "text-right"
                      : "text-left text-gray-400"
                  }`}
                >
                  {msg.role === "user" ? "You" : "AI"}
                </div>

                <div
                  className={`max-w-xl px-4 py-3 rounded-2xl shadow-sm ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-white"
                  }`}
                >
                  <Message role={msg.role} content={msg.content} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white/70 backdrop-blur">
          <ChatInput onSend={handleSend} />
        </div>

        {/* Profile Modal */}
        {openProfileModal && (
          <EditProfileModal
            open={openProfileModal}
            onClose={() => setOpenProfileModal(false)}
          />
        )}

      </div>
    </div>
  )
}