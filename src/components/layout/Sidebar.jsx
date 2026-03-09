import { useState, useEffect, useRef, useCallback } from "react";

const BATCH_SIZE = 10;

// Mock data generator
const generateChats = (start, count) =>
  Array.from({ length: count }, (_, i) => ({
    id: start + i,
    title: [
      "How to center a div in CSS",
      "React hooks explained simply",
      "Build a REST API with Node",
      "Python list comprehensions",
      "What is machine learning?",
      "Fix my tailwind config",
      "SQL JOIN vs subquery",
      "Docker compose tutorial",
      "Explain async/await",
      "TypeScript generics guide",
      "Next.js app router setup",
      "JWT authentication flow",
      "Redis caching strategies",
      "GraphQL vs REST API",
      "Optimize React renders",
      "Git rebase vs merge",
      "MongoDB aggregation pipeline",
      "WebSocket real-time chat",
      "CSS Grid layout tutorial",
      "Zustand state management",
    ][(start + i) % 20],
  }));

const IconSettings = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconProfile = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconLogout = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

// ── Popup ──────────────────────────────────────────────
function ProfilePopup({ open, onClose }) {
  const popupRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, onClose]);

  const menuItems = [
    { icon: <IconProfile />, label: "Profile", color: "text-indigo-200", hover: "hover:bg-indigo-800/60" },
    { icon: <IconSettings />, label: "Settings", color: "text-indigo-200", hover: "hover:bg-indigo-800/60" },
    { divider: true },
    { icon: <IconLogout />, label: "Log out", color: "text-red-400", hover: "hover:bg-red-500/10" },
  ];

  return (
    // absolute, full width of sidebar, sits above footer
    <div
      ref={popupRef}
      className="absolute left-0 w-full bottom-[calc(100%+6px)] z-50 px-3"
      style={{
        pointerEvents: open ? "auto" : "none",
        opacity: open ? 1 : 0,
        transform: open ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 160ms ease, transform 160ms ease",
      }}
    >
      <div className="rounded-xl bg-indigo-900 border border-indigo-700/50 shadow-2xl shadow-black/50 overflow-hidden">
        {/* User info */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-indigo-800">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-none">
            S
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">Somchai</p>
            <p className="text-xs text-indigo-400 truncate">somchai@email.com</p>
          </div>
        </div>

        {/* Menu items */}
        <div className="py-1.5">
          {menuItems.map((item, i) =>
            item.divider ? (
              <div key={i} className="my-1 border-t border-indigo-800" />
            ) : (
              <button
                key={i}
                onClick={onClose}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-100 ${item.color} ${item.hover}`}
              >
                <span className="opacity-75">{item.icon}</span>
                {item.label}
              </button>
            )
          )}
        </div>
      </div>

      {/* Arrow */}
      <div className="pl-5">
        <div className="w-3 h-3 bg-indigo-900 border-r border-b border-indigo-700/50 rotate-45 -mt-[7px]" />
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [chats, setChats] = useState(() => generateChats(0, BATCH_SIZE));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const scrollRef = useRef(null);
  const sentinelRef = useRef(null);
  const totalRef = useRef(BATCH_SIZE);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const next = generateChats(totalRef.current, BATCH_SIZE);
      totalRef.current += BATCH_SIZE;
      setChats((prev) => [...prev, ...next]);
      if (totalRef.current >= 60) setHasMore(false); // cap at 60 for demo
      setLoading(false);
    }, 700);
  }, [loading, hasMore]);

  // IntersectionObserver on sentinel div
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { root: scrollRef.current, threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="w-64 h-screen bg-indigo-900 flex flex-col select-none"
    >
      {/* ── Tab Header ── */}
      <div className="flex-none w-full h-14 bg-indigo-600 flex items-center px-3 gap-3 shadow-md">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-inner">
          <svg className="w-4 h-4 text-indigo-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2a8 8 0 110 16A8 8 0 0112 4zm-1 4v4H7l5 5 5-5h-4V8h-2z" />
          </svg>
        </div>
        <span className="text-white font-semibold text-sm tracking-wide">AiChat</span>
      </div>

      {/* ── New Chat Button ── */}
      <div className="flex-none px-3 py-3">
        <button className="w-full h-10 rounded-lg border border-indigo-300 text-indigo-200 text-sm font-medium flex items-center gap-2 px-3 hover:bg-indigo-800 hover:border-indigo-400 hover:text-white transition-all duration-150 group">
          <svg
            className="w-4 h-4 text-indigo-100 group-hover:text-indigo-200 transition-colors"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          แชตใหม่
        </button>
      </div>

      {/* ── History (infinite scroll) ── */}
      <div className="flex-1 flex flex-col min-h-0 px-3">
        {/* Section label */}
        <p className="flex-none text-xl font-semibold text-indigo-100  tracking-widest mb-2 pl-1">
          ประวัติ
        </p>

        {/* Scrollable list */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto pr-1 space-y-0.5"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#4338ca transparent",
          }}
        >
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveId(chat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-100 truncate
                ${
                  activeId === chat.id
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-200 hover:bg-indigo-800/60 hover:text-white"
                }`}
            >
              {chat.title}
            </button>
          ))}

          {/* Sentinel for IntersectionObserver */}
          <div ref={sentinelRef} className="h-1" />

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-center py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* End of list */}
          {!hasMore && (
            <p className="text-center text-xs text-indigo-600 py-3">
              No more chats
            </p>
          )}
        </div>
      </div>

       {/* Footer — relative so popup can anchor here */}
    <div className="flex-none relative border-t border-indigo-800">
            <ProfilePopup open={popupOpen} onClose={() => setPopupOpen(false)} />

        <div className="px-3 py-3 flex items-center gap-3">
          {/* Profile button (no popup trigger) */}
          <button
            className="flex items-center gap-2 flex-1 min-w-0 rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-indigo-800/50"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex-none flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
            <span className="text-sm text-indigo-200 font-medium truncate">Somchai</span>
          </button>

          {/* Settings shortcut */}
          <button
            onClick={() => setPopupOpen((v) => !v)}
            className={`flex-none w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150
              ${popupOpen ? "bg-indigo-700 text-white" : "text-indigo-400 hover:text-white hover:bg-indigo-800"}`}
          >
            <IconSettings />
          </button>
        </div>
      </div>
    </div>
  );
}