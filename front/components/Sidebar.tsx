'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, FileText, Calendar, DollarSign, Award, Shield, ChevronDown, ChevronRight } from 'lucide-react'

const sidebarItems = [
  {
    title: "人员管理",
    icon: Users,
    items: [
      { title: "人员名单", href: "/" },
      { title: "变动记录", href: "/change-history" },
      { title: "合同管理", href: "/contract-management" },
      { title: "考勤管理", href: "/attendance-management" },
    ],
  },
  {
    title: "薪资管理",
    icon: DollarSign,
    items: [
      { title: "工资表管理", href: "/salary-management" },
      { title: "薪资奖扣管理", href: "/bonus-deduction-management" },
    ],
  },
  {
    title: "社保管理",
    icon: Shield,
    items: [
      { title: "五险一金记录", href: "/social-insurance-management" },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<string[]>(["人员管理"])

  const toggleSection = (title: string) => {
    setOpenSections(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {sidebarItems.map((section) => (
              <div key={section.title}>
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => toggleSection(section.title)}
                >
                  <div className="flex items-center">
                    <section.icon className="mr-2 h-4 w-4" />
                    {section.title}
                  </div>
                  {openSections.includes(section.title) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                {openSections.includes(section.title) && (
                  <div className="mt-1 space-y-1">
                    {section.items.map((item) => (
                      <Button
                        key={item.href}
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className="w-full justify-start pl-8"
                        asChild
                      >
                        <Link href={item.href}>{item.title}</Link>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

