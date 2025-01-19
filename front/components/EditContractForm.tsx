'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Contract {
  id: number
  name: string
  company: string
  department: string
  project: string
  salary: number
  startDate: string
  endDate: string
}

interface EditContractFormProps {
  contract: Contract
  onSave: (updatedContract: Contract) => void
}

export default function EditContractForm({ contract, onSave }: EditContractFormProps) {
  const [formData, setFormData] = useState(contract)

  useEffect(() => {
    setFormData(contract)
  }, [contract])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">变更合同</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>变更合同信息</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">姓名</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="company">所属公司</Label>
            <Input id="company" name="company" value={formData.company} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="department">部门</Label>
            <Select name="department" value={formData.department} onValueChange={(value) => handleSelectChange('department', value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择部门" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="一部">一部</SelectItem>
                <SelectItem value="二部">二部</SelectItem>
                <SelectItem value="三部">三部</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="project">项目</Label>
            <Input id="project" name="project" value={formData.project} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="salary">合同薪资</Label>
            <Input id="salary" name="salary" type="number" value={formData.salary} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="startDate">生效日期</Label>
            <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="endDate">到期日期</Label>
            <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="file">上传变更文件</Label>
            <Input id="file" name="file" type="file" />
          </div>
          <Button type="submit">保存变更</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

