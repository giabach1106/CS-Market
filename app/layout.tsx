import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CS348 Ebook Exchange Marketplace',
  description: 'Stage 2 project with Listings CRUD and Available Listings report',
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

