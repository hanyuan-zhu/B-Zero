'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function NewContractForm() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    department: '',
    project: '',
    salary: '',
    startDate: '',
    endDate: '',
    file: null as File | null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting new contract:', formData)
    // Here you would typically send the data to your backend
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>创建新合同</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>创建新合同</DialogTitle>
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
            <Select name="department" onValueChange={(value) => handleSelectChange('department', value)}>
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
            <Label htmlFor="file">上传合同文件</Label>
            <Input id="file" name="file" type="file" onChange={handleFileChange} required />
          </div>
          <Button type="submit">提交</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

