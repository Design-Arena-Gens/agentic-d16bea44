import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Storyboard Creator',
  description: 'Create storyboard shots with image visualization',
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
