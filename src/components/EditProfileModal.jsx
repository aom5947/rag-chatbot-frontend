import { useState, useEffect } from "react"

export default function EditProfileModal({ open, onClose }) {

  if (!open) return null

  const [name,setName] = useState("")
  const [username,setUsername] = useState("")
  const [avatar,setAvatar] = useState("")

  useEffect(()=>{

    const profile = JSON.parse(localStorage.getItem("profile"))

    if(profile){
      setName(profile.name)
      setUsername(profile.username)
      setAvatar(profile.avatar)
    }

  },[])

  const handleImage = (e) => {

    const file = e.target.files[0]

    if(!file) return

    const reader = new FileReader()

    reader.onload = () => {
      setAvatar(reader.result)
    }

    reader.readAsDataURL(file)

  }

  const handleSave = () => {

    const profile = {
      name,
      username,
      avatar
    }

    localStorage.setItem("profile",JSON.stringify(profile))

    // Trigger update in other components
    window.dispatchEvent(new Event('profileUpdated'))

    onClose()

  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div className="bg-white w-[420px] rounded-2xl p-6 shadow-2xl animate-[scaleIn_.2s_ease]">

        <h2 className="text-lg font-semibold mb-4">
          แก้ไขโปรไฟล์
        </h2>

        {/* avatar */}
        <div className="flex justify-center mb-4">

          {avatar ? (

            <img
              src={avatar}
              className="w-20 h-20 rounded-full object-cover"
            />

          ) : (

            <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl">
              {name ? name.charAt(0).toUpperCase() : "J"}
            </div>

          )}

        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="mb-4"
        />

        {/* name */}
        <input
          value={name}
          onChange={(e)=>setName(e.target.value)}
          placeholder="Name"
          className="w-full border p-2 rounded mb-3"
        />

        {/* username */}
        <input
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          placeholder="Username"
          className="w-full border p-2 rounded mb-4"
        />

        <div className="flex justify-end gap-2">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            ยกเลิก
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            บันทึก
          </button>

        </div>

      </div>

    </div>

  )

}