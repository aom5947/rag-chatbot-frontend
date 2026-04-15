import { useState, useEffect, useRef, useCallback } from "react"
import { Menu, X, MessageSquarePlus, Settings, User, LogOut } from "lucide-react"
import { useDarkMode } from "../../context/DarkModeContext"
import { useAuth } from "../../context/AuthContext"

const BATCH_SIZE = 10

export default function Sidebar({
  isOpen,
  setIsOpen,
  chats,
  setActiveChat,
  createChat,
  setOpenProfileModal,
  setOpenLoginModal
}) {

  const [visibleChats, setVisibleChats] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const [openProfile, setOpenProfile] = useState(false)
  const [openSettings, setOpenSettings] = useState(false)

  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const { user, logout } = useAuth()

  const scrollRef = useRef(null)
  const sentinelRef = useRef(null)

  // ✅ Load chat ทีละ batch
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return

    setLoading(true)

    setTimeout(() => {
      setVisibleChats(prev => {
        const next = chats.slice(prev.length, prev.length + BATCH_SIZE)
        const newHasMore = prev.length + BATCH_SIZE < chats.length
        setHasMore(newHasMore)
        return [...prev, ...next]
      })

      setLoading(false)
    }, 200)

  }, [chats, loading, hasMore])

  useEffect(() => {
    setVisibleChats([])
    setHasMore(true)
  }, [chats])

  useEffect(() => {
    if (visibleChats.length === 0) loadMore()
  }, [visibleChats, loadMore])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { root: scrollRef.current }
    )

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => observer.disconnect()
  }, [loadMore])

  // ✅ derive user data
  const displayName =
    user?.username ||
    user?.email ||
    "User"

  const avatar =
    user?.avatar_url ||
    null

  return (
    <div
      className={`fixed md:relative z-20 h-full bg-white dark:bg-gray-900 text-neutral-800 dark:text-gray-200 flex flex-col border-r border-neutral-200 dark:border-gray-700 transition-all duration-300
      ${isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:translate-x-0 md:w-16"}`}
    >

      {/* Header */}
      <div className="flex items-center justify-between h-14 px-4 bg-neutral-50 dark:bg-gray-800 border-b border-neutral-200 dark:border-gray-700">
        {isOpen && (
          <h2 className="font-semibold text-neutral-700 dark:text-gray-300">
            Legal AI
          </h2>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-gray-700"
        >
          {isOpen ? <X size={18}/> : <Menu size={18}/>}
        </button>
      </div>

      {/* New Chat */}
      <div className="p-3">
        <button
          onClick={() => {
            if (!user) setOpenLoginModal(true)
            else createChat()
          }}
          className="flex items-center gap-2 w-full border border-neutral-300 dark:border-gray-600 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-800"
        >
          <MessageSquarePlus size={18}/>
          {isOpen && "New Chat"}
        </button>
      </div>

      {/* History */}
      <div className="flex-1 flex flex-col min-h-0 px-3">
        {isOpen && (
          <p className="text-xs uppercase text-neutral-400 dark:text-gray-500 mb-2">
            History
          </p>
        )}

        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1">

          {visibleChats.map(chat => (
            <button
              key={chat.id}
              onClick={() => {
                if (!user) setOpenLoginModal(true)
                else setActiveChat(chat.id)
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-neutral-100 dark:hover:bg-gray-800 truncate"
            >
              {isOpen ? chat.title : "💬"}
            </button>
          ))}

          <div ref={sentinelRef} />

          {loading && (
            <div className="flex justify-center py-3">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"
                    style={{animationDelay:`${i*0.15}s`}}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Profile */}
      <div className="relative border-t border-neutral-200 dark:border-gray-700 p-3">

        {/* dropdown */}
        {openProfile && (
          <div className="absolute bottom-16 left-3 w-56 bg-white dark:bg-gray-800 border rounded-xl shadow-lg overflow-hidden">

            <button
              onClick={() => {
                setOpenProfileModal(true)
                setOpenProfile(false)
              }}
              className="flex items-center gap-2 w-full p-3 text-sm hover:bg-neutral-100 dark:hover:bg-gray-700"
            >
              <User size={16}/>
              แก้ไขโปรไฟล์
            </button>

            <button
              onClick={() => setOpenSettings(!openSettings)}
              className="flex items-center gap-2 w-full p-3 text-sm hover:bg-neutral-100 dark:hover:bg-gray-700"
            >
              <Settings size={16}/>
              ตั้งค่า
            </button>

          </div>
        )}

        {/* settings */}
        {openSettings && (
          <div className="absolute bottom-32 left-3 w-56 bg-white dark:bg-gray-800 border rounded-xl shadow-lg overflow-hidden">

            <button
              onClick={toggleDarkMode}
              className="w-full p-3 text-sm hover:bg-neutral-100 dark:hover:bg-gray-700"
            >
              {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 w-full p-3 text-sm hover:bg-neutral-100 dark:hover:bg-gray-700"
            >
              <LogOut size={16}/>
              ออกจากระบบ
            </button>

          </div>
        )}

        {/* user info */}
        <div
          onClick={() => {
            if (!user) setOpenLoginModal(true)
            else setOpenProfile(!openProfile)
          }}
          className="flex items-center gap-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-gray-800 p-2 rounded"
        >

          <div className="w-8 h-8 rounded-full overflow-hidden">
            {avatar ? (
              <img src={avatar} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-neutral-400 flex items-center justify-center text-white text-sm font-bold">
                {displayName.charAt(0)}
              </div>
            )}
          </div>

          {isOpen && (
            <div className="text-sm">
              <p className="font-medium">{displayName}</p>
              <p className="text-xs text-neutral-400">
                {user?.email || ""}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  )
}