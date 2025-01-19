'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AbsenceRecordForm() {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    reason: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting absence record:', formData)
    // Here you would typically send the data to your backend
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <Label htmlFor="name">姓名</Label>
        <Select name="name" onValueChange={(value) => setFormData(prev => ({ ...prev, name: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="选择员工" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="张三">张三</SelectItem>
            <SelectItem value="李四">李四</SelectItem>
            <SelectItem value="王五">王五</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="startDate">开始日期</Label>
        <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} required />
      </div>
      <div>
        <Label htmlFor="endDate">结束日期</Label>
        <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} required />
      </div>
      <div>
        <Label htmlFor="reason">缺勤原因</Label>
        <Textarea id="reason" name="reason" value={formData.reason} onChange={handleInputChange} required />
      </div>
      <Button type="submit">提交缺勤记录</Button>
    </form>
  )
}

