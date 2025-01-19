'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface NewEmployeeModalProps {
  isOpen: boolean
  onClose: () => void
}

const departments = [
  { value: "1部", label: "1部" },
  { value: "2部", label: "2部" },
  { value: "3部", label: "3部" },
]

const projects = [
  { value: "项目A", label: "项目A" },
  { value: "项目B", label: "项目B" },
  { value: "项目C", label: "项目C" },
  { value: "项目D", label: "项目D" },
  { value: "项目E", label: "项目E" },
]

export default function NewEmployeeModal({ isOpen, onClose }: NewEmployeeModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    project: 'unassigned',
    joinDate: ''
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Submitting new employee:', formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加新员工</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                姓名
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                职位
              </Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                入职部门
              </Label>
              <Select
                onValueChange={(value) => handleChange('department', value)}
                value={formData.department}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择部门" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project" className="text-right">
                入职项目
              </Label>
              <Select
                onValueChange={(value) => handleChange('project', value)}
                value={formData.project}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择项目（可选）" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">待岗</SelectItem>
                  {projects.map((proj) => (
                    <SelectItem key={proj.value} value={proj.value}>
                      {proj.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="joinDate" className="text-right">
                入职生效日期
              </Label>
              <Input
                id="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={(e) => handleChange('joinDate', e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit">提交</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

