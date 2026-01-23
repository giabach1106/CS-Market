import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Skin Trader Market',
  description: 'CS348 Project',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

