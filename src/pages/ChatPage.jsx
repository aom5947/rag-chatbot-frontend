import { useState, useEffect, useRef } from "react"
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

  const { user, login } = useAuth()
  const [openLoginModal, setOpenLoginModal] = useState(!user)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const displayUser = typeof user === "object" ? user?.email : user
  const bottomRef = useRef(null)

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
    setOpenLoginModal(!user)
  }, [user])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chats])

  const createChat = () => {
    const newChat = { id: Date.now(), title: "New Chat", messages: [] }
    setChats(prev => [newChat, ...prev])
    setActiveChat(newChat.id)
  }

  const handleSend = async (text) => {
    if (!user) {
      setOpenLoginModal(true)
      return
    }

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
    <div className="h-screen flex bg-white text-gray-900">

      {/* animation styles */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.25s ease-out; }
      `}</style>

      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        chats={chats}
        setActiveChat={setActiveChat}
        createChat={createChat}
        setOpenProfileModal={setOpenProfileModal}
        user={user}
        setOpenLoginModal={setOpenLoginModal}
      />

      <div className="flex-1 flex flex-col w-full">

        {/* Navbar */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="font-medium">Legal Assistant</div>
          {user && <div className="text-sm text-gray-400">{displayUser}</div>}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

          {currentChat.messages.length === 0 && (
            <div className="text-center mt-24 text-gray-400">
              เริ่มต้นพิมพ์คำถามของคุณ
            </div>
          )}

          {currentChat.messages.map((msg, i) => (
            <div key={i} className="flex flex-col fade-in-up">
              <div className={`text-xs mb-1 ${msg.role === "user" ? "text-right" : "text-left text-gray-400"}`}>
                {msg.role === "user" ? "You" : "AI"}
              </div>

              {msg.content ? (
                <Message role={msg.role} content={msg.content} />
              ) : (
                <div className="px-4 py-3 rounded-xl whitespace-pre-wrap transition-all duration-150 bg-white border border-gray-200">
                  <span className="flex gap-1">
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  </span>
                </div>
              )}
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <ChatInput onSend={handleSend} />
        </div>

        {openProfileModal && (
          <EditProfileModal
            open={openProfileModal}
            onClose={() => setOpenProfileModal(false)}
          />
        )}

        {/* Login */}
        {openLoginModal && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-80 border fade-in-up">

              <h2 className="text-lg mb-4">เข้าสู่ระบบ</h2>

              <form onSubmit={(e) => {
                e.preventDefault()
                if (!loginEmail || !loginPassword) return

                const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
                const user = users.find(u => u.email === loginEmail && u.password === loginPassword)

                if (!user) {
                  alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
                  return
                }

                login(loginEmail)

                const profile = {
                  name: `${user.firstName} ${user.lastName}`,
                  username: user.email,
                  avatar: null
                }
                localStorage.setItem("profile", JSON.stringify(profile))

                setOpenLoginModal(false)
                setLoginEmail("")
                setLoginPassword("")
              }}>

                <input
                  type="email"
                  placeholder="อีเมล"
                  className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="รหัสผ่าน"
                  className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />

                <button className="w-full border py-2 rounded hover:bg-gray-100 transition active:scale-95">
                  เข้าสู่ระบบ
                </button>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}
