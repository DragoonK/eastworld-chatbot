"use client";

import { useState, useRef, useEffect } from "react";

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Hi there! 👋 I'm the Eastworld Assistant — I help Cambodian students explore their options for studying in Australia.\n\nWhether you're thinking about which course to study, how to get a student visa, or how to work toward permanent residency, I'm here to help.\n\nWhat's your name? And what stage are you at — still in school, just graduated, or looking to make a change?",
};

export default function ChatWidget() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            "Sorry, I had trouble responding. Please try again!",
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again, or visit eastworld.com.au to book a free consultation directly!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatContent = (text) =>
    text.split("\n").map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #0c2340 0%, #1a4a7a 100%)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 24px rgba(12,35,64,0.35)",
          zIndex: 9999,
          transition: "transform 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {isOpen ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 24,
            width: 400,
            height: 580,
            background: "#fff",
            borderRadius: 20,
            boxShadow:
              "0 12px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9998,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #0c2340 0%, #1a4a7a 100%)",
              padding: "20px 20px 16px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              🎓
            </div>
            <div>
              <div
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                Eastworld Assistant
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 12.5,
                  marginTop: 2,
                }}
              >
                Study in Australia · Visa · PR Pathways
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                marginLeft: "auto",
                background: "rgba(255,255,255,0.12)",
                border: "none",
                color: "white",
                width: 32,
                height: 32,
                borderRadius: 8,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              background: "#f7f8fa",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  maxWidth: "82%",
                  padding: "12px 16px",
                  borderRadius: 16,
                  fontSize: 14,
                  lineHeight: 1.55,
                  alignSelf:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  background:
                    msg.role === "user"
                      ? "linear-gradient(135deg, #0c2340, #1a4a7a)"
                      : "white",
                  color: msg.role === "user" ? "white" : "#1a1a2e",
                  border:
                    msg.role === "assistant"
                      ? "1px solid #e8eaed"
                      : "none",
                  borderBottomLeftRadius:
                    msg.role === "assistant" ? 6 : 16,
                  borderBottomRightRadius:
                    msg.role === "user" ? 6 : 16,
                  boxShadow:
                    msg.role === "assistant"
                      ? "0 1px 3px rgba(0,0,0,0.04)"
                      : "none",
                }}
              >
                {formatContent(msg.content)}
              </div>
            ))}
            {isLoading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  background: "white",
                  border: "1px solid #e8eaed",
                  borderRadius: 16,
                  borderBottomLeftRadius: 6,
                  padding: "14px 20px",
                  display: "flex",
                  gap: 5,
                  alignItems: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                {[0, 1, 2].map((d) => (
                  <div
                    key={d}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#0c2340",
                      opacity: 0.35,
                      animation: `dotBounce 1.2s ease-in-out ${d * 0.15}s infinite`,
                    }}
                  />
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "12px 16px 16px",
              background: "white",
              borderTop: "1px solid #eee",
              display: "flex",
              gap: 10,
              alignItems: "flex-end",
              flexShrink: 0,
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about courses, visas, PR pathways..."
              rows={1}
              style={{
                flex: 1,
                resize: "none",
                border: "1.5px solid #dfe1e5",
                borderRadius: 12,
                padding: "10px 14px",
                fontSize: 14,
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: 1.4,
                outline: "none",
                minHeight: 42,
                maxHeight: 100,
                color: "#1a1a2e",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "#1a4a7a")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "#dfe1e5")
              }
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "linear-gradient(135deg, #0c2340, #1a4a7a)",
                border: "none",
                cursor:
                  !input.trim() || isLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                opacity: !input.trim() || isLoading ? 0.4 : 1,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>

          <div
            style={{
              textAlign: "center",
              padding: 6,
              fontSize: 10.5,
              color: "#aaa",
              background: "white",
            }}
          >
            Powered by Eastworld International
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes dotBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
          30% { transform: translateY(-5px); opacity: 0.8; }
        }
      `}</style>
    </>
  );
}
