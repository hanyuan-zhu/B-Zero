import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import MainNavigation from '@/components/MainNavigation'
import { Sidebar } from '@/components/Sidebar'
import { Breadcrumb } from '@/components/Breadcrumb'
import { usePathname } from 'next/navigation'

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
  const pathname = usePathname()

  // Simple permission check (replace with actual auth logic)
  const isAdmin = true // This should be determined by your authentication system
  const restrictedPaths = ['/bonus-deduction-management']

  if (restrictedPaths.includes(pathname) && !isAdmin) {
    return <div>您没有权限访问此页面</div>
  }

  return (
    <html lang="zh">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-100">
          <MainNavigation />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
              <Breadcrumb />
              <div className="mt-4">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}

