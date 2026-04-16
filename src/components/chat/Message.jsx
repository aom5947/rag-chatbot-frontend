import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

export default function Message({ role, content }) {

  const isUser = role === "user"
  const [displayed, setDisplayed] = useState("")

  // useEffect(() => {
  //   if (isUser) {
  //     setDisplayed(content)
  //     return
  //   }

  //   let i = 0
  //   const interval = setInterval(() => {
  //     setDisplayed(content.slice(0, i))
  //     i++
  //     if (i > content.length) clearInterval(interval)
  //   }, 10)

  //   return () => clearInterval(interval)
  // }, [content])
  useEffect(() => {
    if (isUser || !content) {
      setDisplayed(content)
      return
    }

    const words = content.split(" ")
    let i = 0
    setDisplayed("")

    const interval = setInterval(() => {
      i++
      setDisplayed(words.slice(0, i).join(" "))
      if (i >= words.length) clearInterval(interval)
    }, 30)

    return () => clearInterval(interval)
  }, [content])
  if (!content) {
    return (
      <div className="flex justify-start">
        <div className="bg-white px-3 py-2 rounded-xl shadow-sm border">
          <div className="flex gap-1 text-base">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce delay-100">.</span>
            <span className="animate-bounce delay-200">.</span>
          </div>
        </div>
      </div>
    )
  }

  const components = {
    p: ({ children }) => (
      <p className="mb-1.5 leading-6">{children}</p>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    h1: ({ children }) => (
      <h1 className="text-base font-bold mb-1">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-sm font-semibold mb-1">{children}</h2>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-4 mb-1.5 space-y-0.5">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-4 mb-1.5 space-y-0.5">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="leading-6">{children}</li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-gray-300 pl-3 italic text-gray-500 my-1.5">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
        {children}
      </code>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-2">
        <table className="text-xs border-collapse w-full">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-gray-300 px-2 py-1 bg-gray-50 font-semibold text-left">{children}</th>
    ),
    td: ({ children }) => (
      <td className="border border-gray-300 px-2 py-1">{children}</td>
    ),
    hr: () => <hr className="my-2 border-gray-200" />,
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
        max-w-2xl px-4 py-2.5 rounded-xl text-sm shadow-sm
        whitespace-pre-wrap break-words
        ${isUser
            ? "bg-blue-500 text-white"
            : "bg-white border border-gray-200 text-gray-800"}
      `}
      >
        <ReactMarkdown
          components={components}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}   // แก้พวก br

        >
          {displayed}
        </ReactMarkdown>
      </motion.div>

    </div>
  )
}