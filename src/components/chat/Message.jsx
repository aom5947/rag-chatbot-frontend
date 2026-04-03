import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

export default function Message({ role, content }) {

  const isUser = role === "user"

  const markdownComponents = {
    p: (props) => (
      <p className="mb-3 leading-7" {...props} />
    ),
    strong: (props) => (
      <strong className={`font-bold ${isUser ? "text-white" : "text-gray-900"}`} {...props} />
    ),
    em: (props) => (
      <em className={`italic ${isUser ? "text-white" : "text-gray-700"}`} {...props} />
    ),
    h1: (props) => (
      <h1 className="text-lg font-semibold mb-2" {...props} />
    ),
    h2: (props) => (
      <h2 className="text-base font-semibold mb-2" {...props} />
    ),
    ul: (props) => (
      <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />
    ),
    blockquote: (props) => (
      <blockquote className={`border-l-4 pl-4 italic my-3 ${isUser ? "border-white text-white" : "border-gray-300 text-gray-500"}`}>
        {props.children}
      </blockquote>
    ),
    code: (props) => (
      <code className={`px-1 py-0.5 rounded text-xs ${isUser ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800"}`} {...props} />
    ),
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>

      <div
        className={`max-w-xl px-4 py-3 rounded-2xl text-sm leading-relaxed
        ${isUser 
          ? "bg-indigo-500 text-white" 
          : "bg-white text-gray-800 border border-gray-200"}
        `}
      >
        <ReactMarkdown
          components={markdownComponents}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          skipHtml={false}
        >
          {content}
        </ReactMarkdown>
      </div>

    </div>
  )
}