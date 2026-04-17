import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

import Sidebar from "../components/layout/Sidebar"
import ChatInput from "../components/chat/ChatInput"
import Message from "../components/chat/Message"
import EditProfileModal from "../components/EditProfileModal"

import { useAuth } from "../context/AuthContext"
import { streamChatMessage, fetchSessions, fetchSessionHistory, deleteSession } from "../services/api"

export default function ChatPage() {

  const [isOpen, setIsOpen] = useState(true)
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [openProfileModal, setOpenProfileModal] = useState(false)

  const { user } = useAuth()
  const bottomRef = useRef(null)

  // Fetch session list on mount
  useEffect(() => {
    fetchSessions()
      .then(({ items }) => {
        if (items.length === 0) {
          const newChat = { id: String(Date.now()), title: "New Chat", messages: [], loaded: true }
          setChats([newChat])
          setActiveChat(newChat.id)
        } else {
          const list = items.map(s => ({
            id: s.id,
            title: new Date(s.last_active).toLocaleDateString("th-TH", { dateStyle: "medium" }),
            messages: [],
            loaded: false,
          }))
          setChats(list)
          setActiveChat(list[0].id)
        }
      })
      .catch(() => {
        const newChat = { id: String(Date.now()), title: "New Chat", messages: [], loaded: true }
        setChats([newChat])
        setActiveChat(newChat.id)
      })
      .finally(() => setSessionLoading(false))
  }, [])

  // Lazy-load history when switching to an unloaded session
  useEffect(() => {
    if (!activeChat) return
    const chat = chats.find(c => c.id === activeChat)
    if (!chat || chat.loaded) return

    setHistoryLoading(true)
    fetchSessionHistory(activeChat)
      .then(history => {
        const messages = history.map(m => ({ role: m.role, content: m.content }))
        const firstUserMsg = history.find(m => m.role === "user")?.content
        setChats(prev => prev.map(c =>
          c.id === activeChat
            ? { ...c, messages, title: firstUserMsg?.slice(0, 30) || c.title, loaded: true }
            : c
        ))
      })
      .catch(() => {
        setChats(prev => prev.map(c =>
          c.id === activeChat ? { ...c, loaded: true } : c
        ))
      })
      .finally(() => setHistoryLoading(false))
  }, [activeChat])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [chats])

  const createChat = () => {
    const newChat = { id: String(Date.now()), title: "New Chat", messages: [], loaded: true }
    setChats(prev => [newChat, ...prev])
    setActiveChat(newChat.id)
  }

  const deleteChat = async (chatId) => {
    try { await deleteSession(chatId) } catch (e) {
      if (e?.response?.status !== 404) console.error("deleteSession failed:", e)
    }
    setChats(prev => {
      const next = prev.filter(c => c.id !== chatId)
      if (activeChat === chatId) {
        if (next.length > 0) {
          setActiveChat(next[0].id)
        } else {
          const newChat = { id: String(Date.now()), title: "New Chat", messages: [], loaded: true }
          setChats([newChat])
          setActiveChat(newChat.id)
          return [newChat]
        }
      }
      return next
    })
  }

  const handleSend = async (text, model) => {
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
        () => {},
        model
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
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          createChat={createChat}
          deleteChat={deleteChat}
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

          {(sessionLoading || historyLoading) && (
            <div className="flex justify-center mt-24">
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}

          {!sessionLoading && !historyLoading && currentChat.messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-24 text-gray-400"
            >
              เริ่มต้นพิมพ์คำถามของคุณ  <br />
              ตัวอย่างการถาม:
              "ต่อใบขับขี่ต้องใช้เอกสารอะไร?" <br />
              "ฝ่าไฟแดงแล้วผิดไหม?" <br />
              "ขับรถไม่มีใบขับขี่ได้ไหม?"
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