import { useState, useRef, useEffect } from "react";
import apiClient from "../api/client";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Merhaba! Antrenman programi, motivasyon veya salon isletmeciligi hakkinda sorabilirsin." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, isOpen]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setSending(true);

    try {
      const res = await apiClient.post("/chatbot/ask", { message: userMessage });
      setMessages((prev) => [...prev, { role: "assistant", text: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Bir hata olustu, tekrar dener misin?" },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-3 w-80 h-96 bg-surface border border-border rounded-sm shadow-xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex justify-between items-center">
            <p className="font-display text-xl tracking-wide2 text-ink">ANTRENOR ASISTANI</p>
            <button onClick={() => setIsOpen(false)} className="text-muted hover:text-ink">
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm max-w-[85%] px-3 py-2 rounded-sm ${
                  m.role === "user"
                    ? "bg-accent text-ink ml-auto"
                    : "bg-canvas text-ink border border-border"
                }`}
              >
                {m.text}
              </div>
            ))}
            {sending && (
              <div className="text-sm text-muted px-3 py-2">Yaziyor...</div>
            )}
          </div>

          <form onSubmit={handleSend} className="border-t border-border p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Bir soru sor..."
              className="flex-1 bg-canvas border border-border rounded-sm px-3 py-2 text-sm text-ink focus:border-accent transition-colors"
            />
            <button
              type="submit"
              disabled={sending}
              className="bg-accent hover:bg-accentHover disabled:opacity-50 text-ink text-sm font-medium px-3 rounded-sm transition-colors"
            >
              Gonder
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-accent hover:bg-accentHover shadow-lg flex items-center justify-center text-ink text-2xl transition-colors"
        aria-label="AI asistani ac/kapat"
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}
