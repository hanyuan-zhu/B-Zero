'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface GenerateSalaryModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (department: string, month: string) => void
}

export default function GenerateSalaryModal({ isOpen, onClose, onGenerate }: GenerateSalaryModalProps) {
  const [formData, setFormData] = useState({
    department: '',
    month: '',
  })

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerate(formData.department, formData.month)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>生成工资单</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="department">部门</Label>
            <Select name="department" onValueChange={(value) => handleSelectChange('department', value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择部门" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="技术部">技术部</SelectItem>
                <SelectItem value="市场部">市场部</SelectItem>
                <SelectItem value="人力资源部">人力资源部</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="month">月份</Label>
            <Select name="month" onValueChange={(value) => handleSelectChange('month', value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择月份" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                    {month}月
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>取消</Button>
          <Button type="submit" onClick={handleSubmit}>生成</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

