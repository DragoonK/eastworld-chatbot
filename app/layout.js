export const metadata = {
  title: "Eastworld International",
  description: "Study in Australia — Visa, PR Pathways & University Admissions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
