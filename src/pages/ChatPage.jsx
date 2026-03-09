import { useState, useEffect } from "react"
import Sidebar from "../components/layout/Sidebar"
import Message from "../components/chat/Message"
import ChatInput from "../components/chat/ChatInput"
import EditProfileModal from "../components/EditProfileModal"

export default function ChatPage() {

  const [isOpen, setIsOpen] = useState(true)

  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)

  const [openProfileModal, setOpenProfileModal] = useState(false)

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
  const handleSend = (text) => {

    if (!activeChat) return

    const userMsg = {
      role: "user",
      content: text
    }

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

    setTimeout(() => {

      const botMsg = {
        role: "assistant",
        content: "กำลังค้นหากฎหมาย..."
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

    }, 800)

  }


  const currentChat =
    chats.find(c => c.id === activeChat) || { messages: [] }


  return (
    <div className="h-screen flex">

      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        chats={chats}
        setActiveChat={setActiveChat}
        createChat={createChat}
        setOpenProfileModal={setOpenProfileModal}
      />

      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <div className="h-14 border-b flex items-center px-6 font-semibold">
          ⚖️ Legal Chat Assistant
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {currentChat.messages.length === 0 && (
            <p className="text-neutral-400 text-center mt-20">
              เริ่มต้นถามกฎหมายได้เลย
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

      </div>

    </div>
  )
}