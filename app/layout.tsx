import "./globals.css";

export const metadata = {
  title: 'AeroWatch',
  description: 'Real-time air quality monitoring and forecasting.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  )
}
