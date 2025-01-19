'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Employee {
  id: string
  name: string
  project: string
  company: string
  status: string
}

interface ResignModalProps {
  isOpen: boolean
  onClose: () => void
  selectedEmployee?: Employee | null
}

const mockEmployees: Employee[] = [
  { id: '1', name: '张三', project: '项目A', company: '公司X', status: '在职' },
  { id: '2', name: '李四', project: '项目B', company: '公司Y', status: '待岗' },
]

export default function ResignModal({ isOpen, onClose, selectedEmployee }: ResignModalProps) {
  const [formData, setFormData] = useState({
    employeeId: '',
    effectiveDate: '',
    reason: ''
  })

  const [selectedEmployeeData, setSelectedEmployeeData] = useState<Employee | null>(null)

  useEffect(() => {
    if (selectedEmployee) {
      setFormData(prev => ({ ...prev, employeeId: selectedEmployee.id }))
      setSelectedEmployeeData(selectedEmployee)
    } else {
      setSelectedEmployeeData(null)
    }
  }, [selectedEmployee])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (field === 'employeeId') {
      const employee = mockEmployees.find(emp => emp.id === value)
      setSelectedEmployeeData(employee || null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Submitting resignation:', { ...formData, employeeDetails: selectedEmployeeData })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>员工离职</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employeeName" className="text-right">
                员工姓名
              </Label>
              {selectedEmployee ? (
                <Input
                  id="employeeName"
                  value={selectedEmployee.name}
                  disabled
                  className="col-span-3 bg-gray-100"
                />
              ) : (
                <Select
                  value={formData.employeeId}
                  onValueChange={(value) => handleChange('employeeId', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择员工" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            {selectedEmployeeData && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">所在项目</Label>
                  <Input value={selectedEmployeeData.project} disabled className="col-span-3 bg-gray-100" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">所在公司</Label>
                  <Input value={selectedEmployeeData.company} disabled className="col-span-3 bg-gray-100" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">当前状态</Label>
                  <Input value={selectedEmployeeData.status} disabled className="col-span-3 bg-gray-100" />
                </div>
              </>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="effectiveDate" className="text-right">
                离职生效日期
              </Label>
              <Input
                id="effectiveDate"
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => handleChange('effectiveDate', e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                离职原因
              </Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
                className="col-span-3"
                required
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

