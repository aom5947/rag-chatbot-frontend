/**
 * API Client สำหรับเชื่อมต่อ Backend
 * 
 * Backend: http://localhost:8000
 * Endpoints:
 *   POST /chat        → รอทั้งหมด
 *   POST /chat/stream → SSE streaming
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000"
const API_KEY = import.meta.env.VITE_API_KEY || ""

/**
 * ส่งคำถาม รับคำตอบทั้งหมดพร้อม
 * @param {string} message - คำถาม
 * @param {string} sessionId - session ID
 * @param {string} model - "huggingface" หรือ "openai-compat"
 * @returns {Promise<{answer, intent, emotion, sections}>}
 */
export async function sendChatMessage(message, sessionId, model = "huggingface") {
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY && { "X-API-Key": API_KEY }),
      },
      body: JSON.stringify({
        message,
        session_id: sessionId,
        model,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

/**
 * ส่งคำถาม รับคำตอบแบบ SSE streaming (real-time)
 * @param {string} message - คำถาม
 * @param {string} sessionId - session ID
 * @param {Function} onToken - เรียกเมื่อได้ token ใหม่: onToken(token)
 * @param {Function} onDone - เรียกเมื่อจบ: onDone({intent, emotion, sections})
 * @param {string} model - "huggingface" หรือ "openai-compat"
 */
export async function streamChatMessage(
  message,
  sessionId,
  onToken,
  onDone,
  model = "gpt-oss:20b"
) {
  const res = await fetch(`${API_BASE}/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(API_KEY && { "X-API-Key": API_KEY }),
    },
    body: JSON.stringify({
      message: String(message),
      session_id: String(sessionId),
      model: model
    })
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Backend error:", text);
    throw new Error(`Request failed: ${res.status} - ${text}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop();

    for (let event of events) {
      if (!event.trim()) continue;

      const lines = event.split("\n");
      let eventType = "message";
      let dataLine = "";

      for (let line of lines) {
        if (line.startsWith("event: ")) {
          eventType = line.replace("event: ", "").trim();
        }
        if (line.startsWith("data: ")) {
          dataLine += line.replace("data: ", "").trim();
        }
      }

      if (!dataLine) continue;

      try {
        const parsed = JSON.parse(dataLine);

        // ✅ TOKEN (string)
        if (typeof parsed === "string") {
          console.debug("📝 Chunk:", parsed);

          // 🔥 Fake streaming ทีละคำ
          const words = parsed.split(" ");

          for (let i = 0; i < words.length; i++) {
            const word = words[i];

            onToken?.(word + (i < words.length - 1 ? " " : ""));

            await new Promise(r => setTimeout(r, 20));
          }
        }

        // ✅ DONE EVENT
        if (eventType === "done") {
          console.debug("🎯 Done:", parsed);
          onDone?.(parsed);
        }

      } catch (e) {
        console.warn("Parse error:", e, dataLine);
      }
    }
  }
}