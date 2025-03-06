import type {Metadata} from 'next'
import {Manrope} from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  title: 'button',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${manrope.className} antialiased`}>{children}</body>
    </html>
  )
}
