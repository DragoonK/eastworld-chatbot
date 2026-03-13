"use client";
 
import { useState, useRef, useEffect } from "react";
 
const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Hello! 👋 Welcome to Brightstar International School of Phnom Penh.\n\nI'm your admissions assistant — I can help with school fees, our Cambridge curriculum, the enrolment process, and more.\n\nWhat's your name? And which grade level are you enquiring about?\n\n—\n\nសួស្តី! 👋 សូមស្វាគមន៍មកកាន់សាលាអន្តរជាតិ Brightstar។\n\nខ្ញុំអាចជួយអ្នកអំពីថ្លៃសិក្សា កម្មវិធីសិក្សា Cambridge ដំណើរការចុះឈ្មោះ និងព័ត៌មានផ្សេងៗ។",
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
          content: "I'm having trouble connecting right now. Please call 015 905 789 or visit brightstar.edu.kh.",
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Noto+Sans+Khmer:wght@400;600&display=swap');
 
        * { margin: 0; padding: 0; box-sizing: border-box; }
 
        body, html {
          background: #f5f7fa;
          color: #1a1a2e;
          font-family: 'Inter', 'Noto Sans Khmer', -apple-system, sans-serif;
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
 
        /* Rainbow top bar matching Brightstar's colourful branding */
        .rainbow-bar {
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #e53935, #fb8c00, #fdd835, #43a047, #1e88e5, #8e24aa);
          flex-shrink: 0;
        }
 
        .header {
          width: 100%;
          padding: 18px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 10;
          position: relative;
          flex-shrink: 0;
          background: white;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
 
        .logo-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }
 
        .logo-icon {
          width: 40px;
          height: 40px;
          background: #1565c0;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }
 
        .logo-text {
          font-size: 14px;
          font-weight: 700;
          color: #1565c0;
          line-height: 1.2;
          letter-spacing: -0.2px;
        }
 
        .logo-sub {
          font-size: 10px;
          color: #888;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
 
        .header-link {
          font-size: 11px;
          color: #1565c0;
          text-decoration: none;
          padding: 7px 16px;
          border: 1px solid rgba(21, 101, 192, 0.3);
          border-radius: 6px;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.3px;
          font-weight: 500;
          text-transform: uppercase;
        }
        .header-link:hover {
          background: #1565c0;
          color: white;
          border-color: #1565c0;
        }
 
        .main-content {
          flex: 1;
          width: 100%;
          max-width: 700px;
          display: flex;
          flex-direction: column;
          z-index: 10;
          position: relative;
          padding: 20px 24px 24px;
          min-height: 0;
        }
 
        /* Chat container */
        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: white;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          min-height: 0;
        }
 
        /* Chat header bar */
        .chat-header {
          padding: 16px 22px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          gap: 14px;
          background: linear-gradient(135deg, #0d47a1 0%, #1976d2 100%);
          flex-shrink: 0;
        }
        .chat-avatar {
          width: 40px; height: 40px; border-radius: 10px;
          background: #ffc107;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }
        .chat-header-info h2 {
          font-family: 'Inter', sans-serif;
          font-size: 14px; font-weight: 600;
          color: white; letter-spacing: 0.2px;
        }
        .chat-header-info p {
          font-size: 11px;
          color: rgba(255,255,255,0.65);
          margin-top: 3px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .status-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #4caf50;
          margin-left: auto;
          box-shadow: 0 0 6px rgba(76,175,80,0.6);
          animation: statusPulse 2.5s ease-in-out infinite;
        }
        @keyframes statusPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
 
        /* Messages */
        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-height: 0;
          background: #f8fafc;
        }
        .messages-area::-webkit-scrollbar { width: 3px; }
        .messages-area::-webkit-scrollbar-track { background: transparent; }
        .messages-area::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
 
        .msg {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.65;
          animation: msgIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .msg-assistant {
          align-self: flex-start;
          background: white;
          border: 1px solid rgba(0,0,0,0.07);
          color: #1a1a2e;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .msg-user {
          align-self: flex-end;
          background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
          color: white;
          font-weight: 500;
          border-bottom-right-radius: 4px;
        }
 
        /* Typing */
        .typing {
          align-self: flex-start;
          background: white;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 16px;
          border-bottom-left-radius: 4px;
          padding: 14px 18px;
          display: flex;
          gap: 5px;
          align-items: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #1565c0; opacity: 0.3;
          animation: dotBounce 1.2s ease-in-out infinite;
        }
        .dot:nth-child(2) { animation-delay: 0.15s; }
        .dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes dotBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
          30% { transform: translateY(-5px); opacity: 0.8; }
        }
 
        /* Quick actions */
        .quick-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding: 0 20px 14px;
          flex-shrink: 0;
          background: #f8fafc;
        }
        .pill {
          padding: 7px 14px;
          border-radius: 100px;
          border: 1.5px solid #1565c0;
          background: transparent;
          color: #1565c0;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.2px;
        }
        .pill:hover {
          background: #1565c0;
          color: white;
        }
 
        /* Input */
        .input-area {
          padding: 14px 18px 18px;
          border-top: 1px solid rgba(0,0,0,0.06);
          display: flex;
          gap: 10px;
          align-items: flex-end;
          flex-shrink: 0;
          background: white;
        }
        .input-area textarea {
          flex: 1;
          resize: none;
          border: 1.5px solid #e0e3e8;
          border-radius: 12px;
          padding: 11px 15px;
          font-size: 14px;
          font-family: 'Inter', 'Noto Sans Khmer', sans-serif;
          line-height: 1.5;
          outline: none;
          min-height: 44px;
          max-height: 120px;
          background: #f8fafc;
          color: #1a1a2e;
          transition: border-color 0.2s;
        }
        .input-area textarea::placeholder { color: #9ca3af; }
        .input-area textarea:focus {
          border-color: #1565c0;
          background: white;
        }
 
        .send-btn {
          width: 44px; height: 44px; border-radius: 12px;
          background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: opacity 0.2s, transform 0.15s;
        }
        .send-btn:hover { transform: scale(1.04); opacity: 0.9; }
        .send-btn:disabled { opacity: 0.25; cursor: not-allowed; transform: none; }
        .send-btn svg { width: 17px; height: 17px; fill: white; }
 
        /* Footer */
        .chat-footer {
          text-align: center;
          padding: 8px;
          font-size: 10px;
          color: #aaa;
          letter-spacing: 0.5px;
          border-top: 1px solid rgba(0,0,0,0.04);
          flex-shrink: 0;
          background: white;
        }
        .chat-footer a {
          color: #1565c0;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .chat-footer a:hover { opacity: 0.7; }
 
        @media (max-width: 640px) {
          .header { padding: 14px 16px; }
          .main-content { padding: 10px 10px 10px; }
          .msg { max-width: 88%; font-size: 13.5px; }
          .header-link { display: none; }
          .quick-actions { padding: 0 14px 12px; }
          .pill { font-size: 11px; padding: 6px 11px; }
        }
      `}</style>
 
      <div className="page-wrap">
        <div className="rainbow-bar" />
 
        <header className="header">
          <div className="logo-wrap">
            <div className="logo-icon">⭐</div>
            <div>
              <div className="logo-text">Brightstar International</div>
              <div className="logo-sub">School of Phnom Penh</div>
            </div>
          </div>
          <a href="https://brightstar.edu.kh" className="header-link" target="_blank" rel="noopener noreferrer">
            brightstar.edu.kh
          </a>
        </header>
 
        <div className="main-content">
          <div className="chat-container">
            <div className="chat-header">
              <div className="chat-avatar">⭐</div>
              <div className="chat-header-info">
                <h2>Brightstar Assistant</h2>
                <p>Fees · Admissions · Curriculum · Enrolment</p>
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
                  "What are the school fees?",
                  "How do I enrol my child?",
                  "Tell me about the 2-week free trial",
                  "What curriculum do you follow?",
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
                placeholder="Ask about fees, enrolment, curriculum... / សួរអំពីថ្លៃ ការចុះឈ្មោះ..."
                rows={1}
              />
              <button className="send-btn" onClick={sendMessage} disabled={!input.trim() || isLoading}>
                <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
              </button>
            </div>
 
            <div className="chat-footer">
              Powered by <a href="https://brightstar.edu.kh" target="_blank" rel="noopener noreferrer">Brightstar International School of Phnom Penh</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
