"use client";

import { useState, useRef, useEffect } from "react";

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Hi there! 👋 I'm the Eastworld Assistant — I help Cambodian students explore their options for studying in Australia.\n\nWhether you're thinking about which course to study, how to get a student visa, or how to work toward permanent residency, I'm here to help.\n\nWhat's your name? And what stage are you at — still in school, just graduated, or looking to make a change?",
};

export default function Home() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
          content: data.reply || "Sorry, I had trouble responding. Please try again!",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting right now. Visit eastworld.com.au to book a free consultation directly!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendQuickAction = (q) => {
    const userMsg = { role: "user", content: q };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    })
      .then((r) => r.json())
      .then((data) => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply || "Sorry, please try again!" },
        ]);
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Connection error. Please try again!" },
        ]);
      })
      .finally(() => setIsLoading(false));
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body, html {
          background: #06080d;
          color: #e4e8f1;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
          height: 100%;
        }

        .page-wrap {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .bg-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          z-index: 0;
        }

        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          z-index: 0;
          pointer-events: none;
        }
        .orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%);
          top: -100px; right: -100px;
          animation: orbFloat1 12s ease-in-out infinite;
        }
        .orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
          bottom: -80px; left: -80px;
          animation: orbFloat2 15s ease-in-out infinite;
        }
        .orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, transparent 70%);
          top: 40%; left: 50%;
          transform: translateX(-50%);
          animation: orbFloat3 10s ease-in-out infinite;
        }
        @keyframes orbFloat1 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-40px, 30px); } }
        @keyframes orbFloat2 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, -40px); } }
        @keyframes orbFloat3 { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-30px); } }

        .header {
          width: 100%;
          padding: 20px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 10;
          position: relative;
          flex-shrink: 0;
        }
        .logo-area {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .logo-mark {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #38bdf8 0%, #6366f1 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; color: white;
          font-family: 'Space Grotesk', sans-serif;
        }
        .logo-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 18px; font-weight: 600;
          color: #e4e8f1; letter-spacing: -0.3px;
        }
        .logo-text span { color: #38bdf8; }

        .header-link {
          font-size: 13px;
          color: rgba(228, 232, 241, 0.5);
          text-decoration: none;
          padding: 8px 16px;
          border: 1px solid rgba(228, 232, 241, 0.1);
          border-radius: 8px;
          transition: all 0.3s;
          font-family: 'Inter', sans-serif;
        }
        .header-link:hover {
          color: #38bdf8;
          border-color: rgba(56, 189, 248, 0.3);
          background: rgba(56, 189, 248, 0.05);
        }

        .main-content {
          flex: 1;
          width: 100%;
          max-width: 720px;
          display: flex;
          flex-direction: column;
          z-index: 10;
          position: relative;
          padding: 0 24px 24px;
          min-height: 0;
        }

        .chat-label {
          text-align: center;
          margin-bottom: 14px;
          flex-shrink: 0;
        }
        .chat-label h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px; font-weight: 500;
          color: rgba(228, 232, 241, 0.35);
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          overflow: hidden;
          backdrop-filter: blur(20px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.03),
            0 20px 60px rgba(0, 0, 0, 0.4),
            0 0 120px rgba(56, 189, 248, 0.03);
          min-height: 0;
        }

        .chat-header {
          padding: 16px 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(255, 255, 255, 0.02);
          flex-shrink: 0;
        }
        .chat-avatar {
          width: 40px; height: 40px; border-radius: 12px;
          background: linear-gradient(135deg, #38bdf8 0%, #6366f1 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .chat-header-info h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px; font-weight: 600;
          color: #e4e8f1; letter-spacing: -0.2px;
        }
        .chat-header-info p {
          font-size: 12px;
          color: rgba(228, 232, 241, 0.4);
          margin-top: 2px;
        }
        .status-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #22c55e;
          margin-left: auto;
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
          animation: statusPulse 2s ease-in-out infinite;
        }
        @keyframes statusPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-height: 0;
        }
        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-track { background: transparent; }
        .messages-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }

        .msg {
          max-width: 80%;
          padding: 14px 18px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.6;
          animation: msgIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .msg-assistant {
          align-self: flex-start;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #c8cdd8;
          border-bottom-left-radius: 6px;
        }
        .msg-user {
          align-self: flex-end;
          background: linear-gradient(135deg, #1d4ed8 0%, #6366f1 100%);
          color: white;
          border-bottom-right-radius: 6px;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.2);
        }

        .typing {
          align-self: flex-start;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          border-bottom-left-radius: 6px;
          padding: 16px 22px;
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #38bdf8; opacity: 0.4;
          animation: dotBounce 1.2s ease-in-out infinite;
        }
        .dot:nth-child(2) { animation-delay: 0.15s; }
        .dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes dotBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 0.9; }
        }

        .quick-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding: 0 24px 16px;
          flex-shrink: 0;
        }
        .pill {
          padding: 8px 16px;
          border-radius: 100px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          color: rgba(228, 232, 241, 0.5);
          font-size: 12.5px;
          cursor: pointer;
          transition: all 0.25s;
          font-family: 'Inter', sans-serif;
        }
        .pill:hover {
          border-color: rgba(56, 189, 248, 0.3);
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.06);
        }

        .input-area {
          padding: 16px 20px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          gap: 12px;
          align-items: flex-end;
          background: rgba(255, 255, 255, 0.02);
          flex-shrink: 0;
        }
        .input-area textarea {
          flex: 1;
          resize: none;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 12px 16px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          line-height: 1.5;
          outline: none;
          min-height: 46px;
          max-height: 120px;
          background: rgba(255, 255, 255, 0.04);
          color: #e4e8f1;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .input-area textarea::placeholder { color: rgba(228, 232, 241, 0.25); }
        .input-area textarea:focus {
          border-color: rgba(56, 189, 248, 0.3);
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.08);
        }

        .send-btn {
          width: 46px; height: 46px; border-radius: 14px;
          background: linear-gradient(135deg, #38bdf8 0%, #6366f1 100%);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.3s;
          box-shadow: 0 4px 16px rgba(56, 189, 248, 0.2);
        }
        .send-btn:hover { transform: scale(1.05); box-shadow: 0 4px 24px rgba(56, 189, 248, 0.35); }
        .send-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; box-shadow: none; }
        .send-btn svg { width: 18px; height: 18px; fill: white; }

        .chat-footer {
          text-align: center;
          padding: 10px;
          font-size: 11px;
          color: rgba(228, 232, 241, 0.2);
          letter-spacing: 0.5px;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          flex-shrink: 0;
        }
        .chat-footer a {
          color: rgba(56, 189, 248, 0.4);
          text-decoration: none;
          transition: color 0.2s;
        }
        .chat-footer a:hover { color: #38bdf8; }

        @media (max-width: 640px) {
          .header { padding: 14px 16px; }
          .main-content { padding: 0 10px 10px; }
          .chat-label { margin-bottom: 8px; }
          .chat-label h1 { font-size: 11px; letter-spacing: 2px; }
          .msg { max-width: 88%; font-size: 13.5px; }
          .header-link { display: none; }
          .quick-actions { padding: 0 16px 12px; }
          .pill { font-size: 11.5px; padding: 6px 12px; }
        }
      `}</style>

      <div className="page-wrap">
        <div className="bg-grid" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <header className="header">
          <div className="logo-area">
            <div className="logo-mark">E</div>
            <div className="logo-text">east<span>world</span></div>
          </div>
          <a href="https://eastworld.com.au" className="header-link" target="_blank" rel="noopener noreferrer">
            eastworld.com.au →
          </a>
        </header>

        <div className="main-content">
          <div className="chat-label">
            <h1>AI Student Advisor</h1>
          </div>

          <div className="chat-container">
            <div className="chat-header">
              <div className="chat-avatar">🎓</div>
              <div className="chat-header-info">
                <h2>Eastworld Assistant</h2>
                <p>Visa · Courses · PR Pathways · Admissions</p>
              </div>
              <div className="status-dot" />
            </div>

            <div className="messages-area">
              {messages.map((msg, i) => (
                <div key={i} className={`msg msg-${msg.role}`}>
                  {formatContent(msg.content)}
                </div>
              ))}
              {isLoading && (
                <div className="typing">
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <div className="quick-actions">
                {[
                  "How do I get a student visa?",
                  "Best courses for PR",
                  "Tell me about the 2+2 program",
                  "Nursing pathway to PR",
                ].map((q) => (
                  <button key={q} className="pill" onClick={() => sendQuickAction(q)}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div className="input-area">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about courses, visas, PR pathways..."
                rows={1}
              />
              <button className="send-btn" onClick={sendMessage} disabled={!input.trim() || isLoading}>
                <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
              </button>
            </div>

            <div className="chat-footer">
              Powered by <a href="https://eastworld.com.au" target="_blank" rel="noopener noreferrer">Eastworld International</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
