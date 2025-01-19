'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaymentRecordFormProps {
  type: 'social' | 'housing'
}

export default function PaymentRecordForm({ type }: PaymentRecordFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    baseAmount: '',
    personalContribution: '',
    companyContribution: '',
    paymentDate: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, department: value === 'none' ? '' : value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Submitting form data:', formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">添加{type === 'social' ? '社保' : '公积金'}缴费记录</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">姓名</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="department">部门</Label>
          <Select onValueChange={handleSelectChange} value={formData.department}>
            <SelectTrigger>
              <SelectValue placeholder="选择部门" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">选择部门</SelectItem>
              <SelectItem value="技术部">技术部</SelectItem>
              <SelectItem value="市场部">市场部</SelectItem>
              <SelectItem value="销售部">销售部</SelectItem>
              <SelectItem value="人力资源部">人力资源部</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="baseAmount">缴费基数</Label>
          <Input id="baseAmount" name="baseAmount" type="number" value={formData.baseAmount} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="personalContribution">个人缴纳</Label>
          <Input id="personalContribution" name="personalContribution" type="number" value={formData.personalContribution} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="companyContribution">公司缴纳</Label>
          <Input id="companyContribution" name="companyContribution" type="number" value={formData.companyContribution} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="paymentDate">缴纳日期</Label>
          <Input id="paymentDate" name="paymentDate" type="date" value={formData.paymentDate} onChange={handleInputChange} required />
        </div>
      </div>
      <Button type="submit">提交</Button>
    </form>
  )
}

