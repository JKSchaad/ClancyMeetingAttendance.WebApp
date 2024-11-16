import { ReactNode } from 'react'
import Head from 'next/head'

interface BaseLayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

export default function BaseLayout({
  children,
  title = 'Clancy Meeting Attendance',
  description = 'Track meeting attendance with QR codes',
}: BaseLayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </>
  )
}
