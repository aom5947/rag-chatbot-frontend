import { Menu, X, MessageSquarePlus, Settings, User } from "lucide-react"
import { useState,useEffect } from "react"

export default function Sidebar({
  isOpen,
  setIsOpen,
  chats,
  setActiveChat,
  createChat,
  setOpenProfileModal
}) {

  const [openProfile, setOpenProfile] = useState(false)
  const [profile,setProfile] = useState(null)

  useEffect(()=>{

  const saved = JSON.parse(localStorage.getItem("profile"))

  if(saved){
    setProfile(saved)
  }

  const handleStorageChange = () => {
    const updated = JSON.parse(localStorage.getItem("profile"))
    if(updated){
      setProfile(updated)
    }
  }

  window.addEventListener("storage", handleStorageChange)
  return () => window.removeEventListener("storage", handleStorageChange)

},[])

  return (
    <div
      className={`fixed md:relative z-20 h-full bg-white/80 backdrop-blur-md border-r border-indigo-100 shadow-lg transition-all duration-300
      ${isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:translate-x-0 md:w-16"}`}
    >

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-indigo-100">

        {isOpen && (
          <h2 className="font-semibold text-indigo-700">
            ⚖️ Legal AI
          </h2>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded hover:bg-indigo-100"
        >
          {isOpen ? <X size={18}/> : <Menu size={18}/>}
        </button>

      </div>

      {/* New Chat */}
      <div className="p-3">

        <button
          onClick={createChat}
          className="flex items-center gap-2 w-full bg-indigo-50 hover:bg-indigo-100 p-2 rounded text-sm text-indigo-700"
        >
          <MessageSquarePlus size={18}/>
          {isOpen && "New Chat"}
        </button>

      </div>

      {/* Chat History */}
      <div className="flex-1 p-3 space-y-2 text-sm text-neutral-600 overflow-y-auto">

        {chats.map(chat => (

          <div
            key={chat.id}
            onClick={() => setActiveChat(chat.id)}
            className="hover:bg-indigo-50 p-2 rounded cursor-pointer"
          >
            {isOpen ? chat.title : "💬"}
          </div>

        ))}

      </div>

      {/* Profile */}
      <div className="absolute bottom-0 w-full border-t border-indigo-100 p-3">

        {openProfile && (
          <div className="absolute bottom-16 left-3 w-52 bg-white shadow-xl rounded-xl border p-2 text-sm">

            <button
              onClick={() => {
                setOpenProfileModal(true)
                setOpenProfile(false)
              }}
              className="flex items-center gap-2 w-full p-2 rounded hover:bg-indigo-50"
            >
              <User size={16}/>
              แก้ไขโปรไฟล์
            </button>

            <button className="flex items-center gap-2 w-full p-2 rounded hover:bg-indigo-50">
              <Settings size={16}/>
              ตั้งค่า
            </button>

          </div>
        )}

        <div
          onClick={() => setOpenProfile(!openProfile)}
          className="flex items-center gap-3 cursor-pointer hover:bg-indigo-50 p-2 rounded"
        >

          <div className="w-8 h-8 rounded-full overflow-hidden">

            {profile?.avatar ? (

                <img
                src={profile.avatar}
                className="w-full h-full object-cover"
                />

            ) : (

                <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white">
                {profile?.name?.charAt(0) || "J"}
                </div>

            )}

            </div>

          {isOpen && (
            <div className="text-sm">
              <p className="font-medium">{profile?.name || "User"}</p>
              <p className="text-xs text-neutral-400">
                {profile?.username || "Profile"}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  )
}