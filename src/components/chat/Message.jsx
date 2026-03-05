export default function Message({ role, content }) {
  const isUser = role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xl px-4 py-3 rounded-xl shadow-sm
        ${isUser
          ? "bg-indigo-600 text-white"
          : "bg-white border border-indigo-100 text-neutral-800"
        }`}
      >
        {content}
      </div>
    </div>
  )
}