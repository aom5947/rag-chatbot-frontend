export default function ChatPage() {
  return (
    <div className="h-screen flex bg-neutral-50 text-neutral-900">
      
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-neutral-200 p-4">
        <h2 className="font-semibold text-lg mb-4">RAG Chatbot</h2>
        <p className="text-sm text-neutral-500">Sidebar</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <div className="h-14 bg-white border-b border-neutral-200 flex items-center px-6">
          <h1 className="font-medium">Chat</h1>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex items-center justify-center">
          <p className="text-neutral-400">
            Start a conversation...
          </p>
        </div>

      </div>
    </div>
  )
}