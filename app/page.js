import ChatWidget from "./components/ChatWidget";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 500 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#0c2340",
            marginBottom: 12,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Eastworld International
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "#555",
            lineHeight: 1.6,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Click the chat icon in the bottom right to speak with our AI
          assistant about studying in Australia, visa requirements, and PR
          pathways.
        </p>
      </div>

      <ChatWidget />
    </main>
  );
}
