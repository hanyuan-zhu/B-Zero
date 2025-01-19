'use client'

import { usePathname } from 'next/navigation'
import { Breadcrumb } from './Breadcrumb'
import { Sidebar } from './Sidebar'
import MainNavigation from './MainNavigation'

export function PathAwareLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Simple permission check (replace with actual auth logic)
  const isAdmin = true // This should be determined by your authentication system
  const restrictedPaths = ['/bonus-deduction-management']

  if (restrictedPaths.includes(pathname) && !isAdmin) {
    return <div>您没有权限访问此页面</div>
  }

  return (
    <>
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
    </>
  )
}
