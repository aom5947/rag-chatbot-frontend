import { useState, useEffect } from "react"
import Sidebar from "../components/layout/Sidebar"
import Message from "../components/chat/Message"
import ChatInput from "../components/chat/ChatInput"
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

  // โหลด chat จาก localStorage
  useEffect(() => {

    const saved = localStorage.getItem("chats")

    if (saved) {

      const parsed = JSON.parse(saved)

      setChats(parsed)
      setActiveChat(parsed[0]?.id)

    } else {

      const firstChat = {
        id: Date.now(),
        title: "New Chat",
        messages: []
      }

      setChats([firstChat])
      setActiveChat(firstChat.id)

    }

  }, [])

  // บันทึก chats
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats))
  }, [chats])

  useEffect(() => {
    setOpenLoginModal(!user)
  }, [user])


  // สร้าง chat ใหม่
  const createChat = () => {

    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: []
    }

    setChats(prev => [newChat, ...prev])
    setActiveChat(newChat.id)

  }


  // ส่งข้อความ
  const handleSend = async (text) => {

    if (!user) {
      setOpenLoginModal(true)
      return
    }

    if (!activeChat) return

    const userMsg = {
      role: "user",
      content: text
    }

    // เพิ่มข้อความของผู้ใช้
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

    // สร้าง bot message placeholder
    const botMsg = {
      role: "assistant",
      content: ""
    }

    setChats(prev =>
      prev.map(chat =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: [...chat.messages, botMsg]
            }
          : chat
      )
    )

    try {
      // ส่งคำถามไปยัง backend แบบ streaming
      await streamChatMessage(
        text,
        String(activeChat),
        // onToken: เมื่อได้ token ใหม่
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
        // onDone: เมื่อจบการ streaming
        (metadata) => {
          // metadata มี: { intent, emotion, sections }
          console.log("Chat completed:", metadata)
        }
      )
    } catch (error) {
      // แสดง error message
      setChats(prev =>
        prev.map(chat =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: chat.messages.map((msg, i) =>
                  i === chat.messages.length - 1
                    ? { 
                        ...msg, 
                        content: `❌ เกิดข้อผิดพลาด: ${error.message}` 
                      }
                    : msg
                )
              }
            : chat
        )
      )
      console.error("Chat error:", error)
    }

  }


  const currentChat =
    chats.find(c => c.id === activeChat) || { messages: [] }


  return (
    <div className="h-screen flex bg-white dark:bg-gray-900">

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

      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <div className="h-14 border-b border-neutral-200 dark:border-gray-700 bg-neutral-50 dark:bg-gray-800 flex items-center px-6 font-semibold text-neutral-800 dark:text-gray-200">
          ⚖️ Legal Chat Assistant
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50 dark:bg-gray-900">

          {currentChat.messages.length === 0 && (
            <p className="text-neutral-400 dark:text-gray-500 text-center mt-20">
              {user ? "เริ่มต้นถามกฎหมายได้เลย" : "กรุณาเข้าสู่ระบบเพื่อเริ่มแชท"}
            </p>
          )}

          {currentChat.messages.map((msg, i) => (
            <Message
              key={i}
              role={msg.role}
              content={msg.content}
            />
          ))}

        </div>

        <ChatInput onSend={handleSend} />

        {openProfileModal && (
          <EditProfileModal
            open={openProfileModal}
            onClose={() => setOpenProfileModal(false)}
          />
        )}

        {openLoginModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4 text-neutral-800 dark:text-gray-200">เข้าสู่ระบบ</h2>
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
                
                // บันทึก profile จากข้อมูลสมัครสมาชิก
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
                  className="w-full p-2 mb-2 border border-neutral-300 dark:border-gray-600 bg-neutral-50 dark:bg-gray-700 rounded text-neutral-800 dark:text-gray-200"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="รหัสผ่าน"
                  className="w-full p-2 mb-4 border border-neutral-300 dark:border-gray-600 bg-neutral-50 dark:bg-gray-700 rounded text-neutral-800 dark:text-gray-200"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">เข้าสู่ระบบ</button>
              </form>
              <button onClick={() => setOpenLoginModal(false)} className="mt-2 text-sm text-gray-500 dark:text-gray-400">ยกเลิก</button>
              <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">ยังไม่มีบัญชี? <a href="/register" className="text-indigo-600 dark:text-indigo-400">สมัครสมาชิก</a></p>
            </div>
          </div>
        )}

      </div>

    </div>
  )
}