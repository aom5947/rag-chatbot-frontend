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
  onDone
) {
  const res = await fetch(`${API_BASE}/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(API_KEY && { "X-API-Key": API_KEY }), // ✅ ใช้ key จาก env
    },
    body: JSON.stringify({
      message: String(message),       // ✅ ถูกแล้ว
      session_id: String(sessionId),  // ✅ ถูกแล้ว
      model: "openai-compat"                    // ❗ สำคัญมาก (อย่าใช้ default)
    })
  });

  if (!res.ok) {
    const text = await res.text(); // 👈 debug error
    console.error("Backend error:", text);
    throw new Error(`Request failed: ${res.status}`);
  }

  if (!res.ok) {
    throw new Error("Request failed");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // 🔥 split SSE event (คั่นด้วย \n\n)
    const events = buffer.split("\n\n");
    buffer = events.pop(); // เก็บ incomplete ไว้รอบหน้า

    for (let event of events) {
      // แยก line
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

        // 🔥 token streaming
        if (eventType === "message") {
          onToken?.(parsed);
        }

        // 🔥 done event
        if (eventType === "done") {
          onDone?.(parsed);
        }
      } catch (e) {
        // ignore parse error
      }
    }
  }
}

/**
 * ตรวจสอบสถานะ backend
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`)
    return await response.json()
  } catch (error) {
    console.error("Health check failed:", error)
    return { status: "error", message: error.message }
  }
}
