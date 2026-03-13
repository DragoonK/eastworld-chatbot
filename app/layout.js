export const metadata = {
  title: "Brightstar International School of Phnom Penh",
  description: "Brightstar admissions assistant — fees, curriculum & enrolment",
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
