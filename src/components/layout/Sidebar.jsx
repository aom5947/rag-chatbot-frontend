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
  user,
  setOpenLoginModal
}) {

  const [visibleChats, setVisibleChats] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const [openProfile, setOpenProfile] = useState(false)
  const [openSettings, setOpenSettings] = useState(false)
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("profile");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })

  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const { logout } = useAuth()

  const scrollRef = useRef(null)
  const sentinelRef = useRef(null)

  useEffect(() => {

    const handleStorageChange = () => {
      const updated = JSON.parse(localStorage.getItem("profile"))
      if (updated) setProfile(updated)
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("profileUpdated", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("profileUpdated", handleStorageChange)
    }

  }, [])

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

    }, 300)

  }, [chats, loading, hasMore])

  useEffect(() => {
    setVisibleChats([])
    setHasMore(true)
    setLoading(false)
  }, [chats])

  useEffect(() => {
    if (hasMore && !loading && visibleChats.length === 0) {
      loadMore()
    }
  }, [chats, hasMore, loading, visibleChats.length, loadMore])

  useEffect(() => {

    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { root: scrollRef.current }
    )

    observer.observe(sentinel)

    return () => observer.disconnect()

  }, [loadMore])

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
          onClick={() => { if (!user) setOpenLoginModal(true); else createChat(); }}
          className="flex items-center gap-2 w-full border border-neutral-300 dark:border-gray-600 text-neutral-700 dark:text-gray-300 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-800"
        >
          <MessageSquarePlus size={18}/>
          {isOpen && "New Chat"}
        </button>

      </div>

      {/* History */}
      <div className="flex-1 flex flex-col min-h-0 px-3">

        {isOpen && (
          <p className="text-xs uppercase text-neutral-400 dark:text-gray-500 tracking-widest mb-2">
            History
          </p>
        )}

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-1"
        >

          {visibleChats.map(chat => (

            <button
              key={chat.id}
              onClick={() => { if (!user) setOpenLoginModal(true); else setActiveChat(chat.id); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-neutral-600 dark:text-gray-400 hover:bg-neutral-100 dark:hover:bg-gray-800 hover:text-neutral-900 dark:hover:text-gray-100 truncate"
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
                    className="w-1.5 h-1.5 bg-neutral-400 dark:bg-gray-600 rounded-full animate-bounce"
                    style={{animationDelay:`${i*0.15}s`}}
                  />
                ))}
              </div>
            </div>
          )}

          {!hasMore && (
            <p className="text-xs text-center text-neutral-400 dark:text-gray-500 py-2">
              End of chats
            </p>
          )}

        </div>

      </div>

      {/* Profile */}
      <div className="relative border-t border-neutral-200 dark:border-gray-700 p-3">

        {openProfile && (

          <div className="absolute bottom-16 left-3 w-56 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">

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

        {openSettings && (

          <div className="absolute bottom-32 left-3 w-56 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">

            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 w-full p-3 text-sm hover:bg-neutral-100 dark:hover:bg-gray-700"
            >
              {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            <button
              onClick={() => {
                logout()
                setOpenSettings(false)
              }}
              className="flex items-center gap-2 w-full p-3 text-sm hover:bg-neutral-100 dark:hover:bg-gray-700"
            >
              <LogOut size={16}/>
              ออกจากระบบ
            </button>

          </div>

        )}

        <div
          onClick={() => { if (!user) setOpenLoginModal(true); else setOpenProfile(!openProfile); }}
          className="flex items-center gap-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-gray-800 p-2 rounded"
        >

          <div className="w-8 h-8 rounded-full overflow-hidden">

            {profile?.avatar ? (

              <img
                src={profile.avatar}
                className="w-full h-full object-cover"
              />

            ) : (

              <div className="w-full h-full bg-neutral-400 dark:bg-gray-600 flex items-center justify-center text-white text-sm font-bold">
                {profile?.name?.charAt(0) || "U"}
              </div>

            )}

          </div>

          {isOpen && (

            <div className="text-sm">

              <p className="font-medium">
                {profile?.name || "User"}
              </p>

              <p className="text-xs text-neutral-400 dark:text-gray-500">
                {profile?.username || "Profile"}
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  )
}