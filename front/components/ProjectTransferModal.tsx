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
  department: string
  project: string
}

interface Department {
  id: string
  name: string
  projects: string[]
}

interface ProjectTransferModalProps {
  isOpen: boolean
  onClose: () => void
  selectedEmployee?: Employee | null
}

const mockEmployees: Employee[] = [
  { id: '1', name: '张三', department: '一部', project: '项目A' },
  { id: '2', name: '李四', department: '二部', project: '项目B' },
]

const mockDepartments: Department[] = [
  { id: '1', name: '一部', projects: ['项目A', '项目C', '项目E'] },
  { id: '2', name: '二部', projects: ['项目B', '项目D', '项目F'] },
  { id: '3', name: '三部', projects: ['项目G', '项目H', '项目I'] },
]

export default function ProjectTransferModal({ isOpen, onClose, selectedEmployee }: ProjectTransferModalProps) {
  const [formData, setFormData] = useState({
    employeeId: '',
    newDepartment: '',
    newProject: '',
    effectiveDate: '',
    reason: ''
  })

  const [selectedEmployeeData, setSelectedEmployeeData] = useState<Employee | null>(null)
  const [availableProjects, setAvailableProjects] = useState<string[]>([])

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
    } else if (field === 'newDepartment') {
      const department = mockDepartments.find(dept => dept.id === value)
      setAvailableProjects(department ? department.projects : [])
      setFormData(prev => ({ ...prev, newProject: '' }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Submitting project transfer:', { ...formData, employeeDetails: selectedEmployeeData })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>人员项目调岗</DialogTitle>
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
                  <Label className="text-right">现在部门</Label>
                  <Input value={selectedEmployeeData.department} disabled className="col-span-3 bg-gray-100" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">现在项目</Label>
                  <Input value={selectedEmployeeData.project} disabled className="col-span-3 bg-gray-100" />
                </div>
              </>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newDepartment" className="text-right">
                新部门
              </Label>
              <Select
                value={formData.newDepartment}
                onValueChange={(value) => handleChange('newDepartment', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择新部门" />
                </SelectTrigger>
                <SelectContent>
                  {mockDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newProject" className="text-right">
                新项目
              </Label>
              <Select
                value={formData.newProject}
                onValueChange={(value) => handleChange('newProject', value)}
                disabled={!formData.newDepartment}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择新项目" />
                </SelectTrigger>
                <SelectContent>
                  {availableProjects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="effectiveDate" className="text-right">
                到岗生效日期
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
                调岗原因
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

