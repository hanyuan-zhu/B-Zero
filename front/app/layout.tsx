import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { PathAwareLayout } from '@/components/PathAwareLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '公司管理工具',
  description: '人员名单管理系统',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-100">
          <PathAwareLayout>
            {children}
          </PathAwareLayout>
        </div>
      </body>
    </html>
  )
}

