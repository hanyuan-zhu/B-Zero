'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import BonusDeductionRecords from '@/components/BonusDeductionRecords'
import AddBonusDeductionModal from '@/components/AddBonusDeductionModal'
import { PlusCircle } from 'lucide-react'

export default function BonusDeductionManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">薪资奖扣管理</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          添加奖扣项
        </Button>
      </div>
      <BonusDeductionRecords />
      <AddBonusDeductionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

