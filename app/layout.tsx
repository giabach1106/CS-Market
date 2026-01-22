import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CS2 Skin Trader Pro',
  description: 'CS348 Project - Database-backed application',
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

