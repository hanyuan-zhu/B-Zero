'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

interface AddBonusDeductionModalProps {
  isOpen: boolean
  onClose: () => void
}

// Mock data for dropdowns
const mockEmployees = ['张三', '李四', '王五']
const mockProjects = ['项目A', '项目B', '项目C']
const mockCompanies = ['公司X', '公司Y', '公司Z']

export default function AddBonusDeductionModal({ isOpen, onClose }: AddBonusDeductionModalProps) {
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    effectiveDate: '',
    applyTo: 'individual',
    target: '',
    frequency: '',
    endDate: '',
  })

  const [targetOptions, setTargetOptions] = useState<string[]>([])

  useEffect(() => {
    switch (formData.applyTo) {
      case 'individual':
        setTargetOptions(mockEmployees)
        break
      case 'project':
        setTargetOptions(mockProjects)
        break
      case 'company':
        setTargetOptions(mockCompanies)
        break
      default:
        setTargetOptions([])
    }
  }, [formData.applyTo])

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
    onClose()
    // Reset form after submission
    setFormData({
      type: '',
      amount: '',
      effectiveDate: '',
      applyTo: 'individual',
      target: '',
      frequency: '',
      endDate: '',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加奖扣项</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          {formData.type === 'periodic-bonus' ? (
            <>
              <div>
                <Label htmlFor="frequency">频率</Label>
                <Select name="frequency" onValueChange={(value) => handleSelectChange('frequency', value)} value={formData.frequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择频率" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">每月</SelectItem>
                    <SelectItem value="bimonthly">每两个月</SelectItem>
                    <SelectItem value="quarterly">每季度</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="effectiveDate">开始日期</Label>
                <Input id="effectiveDate" name="effectiveDate" type="date" value={formData.effectiveDate} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="endDate">终止日期</Label>
                <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} required />
              </div>
            </>
          ) : (
            <div>
              <Label htmlFor="effectiveDate">生效日期</Label>
              <Input id="effectiveDate" name="effectiveDate" type="date" value={formData.effectiveDate} onChange={handleInputChange} required />
            </div>
          )}
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
            <Label htmlFor="target">目标</Label>
            <Select name="target" onValueChange={(value) => handleSelectChange('target', value)} value={formData.target}>
              <SelectTrigger>
                <SelectValue placeholder={`选择${formData.applyTo === 'individual' ? '个人' : formData.applyTo === 'project' ? '项目' : '公司'}`} />
              </SelectTrigger>
              <SelectContent>
                {targetOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>取消</Button>
          <Button type="submit" onClick={handleSubmit}>确认添加</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

