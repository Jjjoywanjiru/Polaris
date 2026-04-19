import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Polaris',
  description: 'Hand-crafted clothing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Inter:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} bg-void`}>
        {children}
      </body>
    </html>
  )
}