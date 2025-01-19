'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"

export default function BonusDeductionForm() {
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    effectiveDate: '',
    applyTo: 'individual',
    target: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log('Submitting bonus/deduction:', formData)
    toast({
      title: "奖扣项已添加",
      description: "新的薪资奖扣项已成功添加到系统中。",
    })
    // Reset form after submission
    setFormData({
      type: '',
      amount: '',
      effectiveDate: '',
      applyTo: 'individual',
      target: ''
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="type">类型</Label>
          <Select name="type" onValueChange={(value) => handleSelectChange('type', value)} value={formData.type}>
            <SelectTrigger>
              <SelectValue placeholder="选择类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one-time-bonus">一次性补贴/奖励</SelectItem>
              <SelectItem value="deduction">扣除</SelectItem>
              <SelectItem value="periodic-bonus">周期性补贴</SelectItem>
              <SelectItem value="temporary-withholding">暂时扣押</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="amount">金额</Label>
          <Input id="amount" name="amount" type="number" value={formData.amount} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="effectiveDate">生效日期</Label>
          <Input id="effectiveDate" name="effectiveDate" type="date" value={formData.effectiveDate} onChange={handleInputChange} required />
        </div>
        <div>
          <Label>应用范围</Label>
          <RadioGroup value={formData.applyTo} onValueChange={(value) => handleSelectChange('applyTo', value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual">个人</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="project" id="project" />
              <Label htmlFor="project">项目</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="company" id="company" />
              <Label htmlFor="company">公司</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="target">目标（个人姓名/项目名称/公司名称）</Label>
          <Input id="target" name="target" value={formData.target} onChange={handleInputChange} required />
        </div>
      </div>
      <Button type="submit">添加奖扣项</Button>
    </form>
  )
}

