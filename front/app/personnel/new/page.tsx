'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function NewPersonnel() {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    project: '',
    joinDate: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Submitting new personnel:', formData)
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">新员工入职</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">姓名</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="position">职位</Label>
          <Input id="position" name="position" value={formData.position} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="department">部门</Label>
          <Select id="department" name="department" value={formData.department} onChange={handleChange} required>
            <option value="">选择部门</option>
            <option value="1部">1部</option>
            <option value="2部">2部</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="project">项目</Label>
          <Select id="project" name="project" value={formData.project} onChange={handleChange} required>
            <option value="">选择项目</option>
            <option value="项目A">项目A</option>
            <option value="项目B">项目B</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="joinDate">入职日期</Label>
          <Input id="joinDate" name="joinDate" type="date" value={formData.joinDate} onChange={handleChange} required />
        </div>
        <Button type="submit">提交</Button>
      </form>
    </div>
  )
}

