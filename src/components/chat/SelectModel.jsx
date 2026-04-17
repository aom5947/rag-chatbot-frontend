import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchModels } from "@/services/api"

const MODEL_LABELS = {
  "huggingface": "HuggingFace",
  "gpt-oss:20b": "GPT OSS 20B",
  "mdt/gpt-5-nano": "GPT-5 Nano",
  "mdt/gpt-4o-mini": "GPT-4o Mini",
  "mdt/qwen-72b": "Qwen 72B",
  "mdt/codellama-34b": "Code Llama 34B",
  "mdt/deepseek-coder-16b": "DeepSeek Coder 16B",
  // Groq models
  'llama-3.3-70b-versatile': 'Llama 3.3 70B (Groq)',
  'qwen/qwen3-32b': 'Qwen3 32B (Groq)',
  'meta-llama/llama-4-scout-17b-16e-instruct': 'Llama 4 Scout 17B (Groq)',
  'openai/gpt-oss-20b': 'GPT OSS 20B (Groq)',
  'openai/gpt-oss-120b': 'GPT OSS 120B (Groq)',
}

export default function SelectModel({ value, onChange }) {
  const [models, setModels] = useState([])

  useEffect(() => {
    fetchModels()
      .then((list) => {
        setModels(list)
        if (!value && list.length > 0) onChange?.(list[0])
      })
      .catch(() => setModels([]))
  }, [])

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-45">
        <SelectValue placeholder="เลือกโมเดล" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {models.map((m) => (
            <SelectItem key={m} value={m}>
              {MODEL_LABELS[m] ?? m} 
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}