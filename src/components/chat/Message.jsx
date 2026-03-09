export default function Message({ role, content }) {

  const isUser = role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>

      <div
        className={`max-w-md px-4 py-2 rounded-lg
        ${isUser ? "bg-indigo-500 text-white" : "bg-gray-200"}
        `}
      >
        {content}
      </div>

    </div>
  )
}