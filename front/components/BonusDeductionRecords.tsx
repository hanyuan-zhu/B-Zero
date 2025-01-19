'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

interface BonusDeductionRecord {
  id: number
  type: string
  amount: number
  effectiveDate: string
  applyTo: string
  target: string
  frequency?: string
  endDate?: string
  withholdingStatus?: 'pending' | 'returned'
  returnDate?: string
}

const mockRecords: BonusDeductionRecord[] = [
  { id: 1, type: '一次性补贴', amount: 1000, effectiveDate: '2023-08-01', applyTo: '个人', target: '张三' },
  { id: 2, type: '扣除', amount: -500, effectiveDate: '2023-08-15', applyTo: '项目', target: '项目A' },
  { id: 3, type: '周期性补贴', amount: 200, effectiveDate: '2023-09-01', applyTo: '公司', target: '公司X', frequency: '每月', endDate: '2023-12-31' },
  { id: 4, type: '暂时扣押', amount: 1000, effectiveDate: '2023-08-01', applyTo: '个人', target: '李四', withholdingStatus: 'pending' },
]

export default function BonusDeductionRecords() {
  const [records, setRecords] = useState<BonusDeductionRecord[]>(mockRecords)
  const [filters, setFilters] = useState({
    type: '',
    startDate: '',
    endDate: '',
    applyTo: ''
  })
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<BonusDeductionRecord | null>(null)
  const [returnDate, setReturnDate] = useState('')

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = () => {
    // Here you would typically fetch filtered data from your backend
    // For now, we'll just filter the mock data
    const filteredRecords = mockRecords.filter(record => 
      (filters.type === 'all' || !filters.type || record.type === filters.type) &&
      (!filters.startDate || record.effectiveDate >= filters.startDate) &&
      (!filters.endDate || record.effectiveDate <= filters.endDate) &&
      (filters.applyTo === 'all' || !filters.applyTo || record.applyTo === filters.applyTo)
    )
    setRecords(filteredRecords)
  }

  const handleExport = () => {
    // Here you would typically generate and download an export file
    console.log('Exporting records:', records)
    alert('导出功能已触发，请检查控制台日志。')
  }

  const handleReturnWithholding = (record: BonusDeductionRecord) => {
    setSelectedRecord(record)
    setIsReturnModalOpen(true)
  }

  const handleConfirmReturn = () => {
    if (selectedRecord && returnDate) {
      const updatedRecords = records.map(record => 
        record.id === selectedRecord.id 
          ? { ...record, withholdingStatus: 'returned', returnDate } 
          : record
      )
      setRecords(updatedRecords)
      setIsReturnModalOpen(false)
      setSelectedRecord(null)
      setReturnDate('')
      toast({
        title: "暂扣返回已确认",
        description: `暂扣金额已于 ${returnDate} 返回。`,
      })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">奖扣记录查询</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">类型</Label>
          <Select onValueChange={(value) => handleFilterChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="选择类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="一次性补贴">一次性补贴</SelectItem>
              <SelectItem value="扣除">扣除</SelectItem>
              <SelectItem value="周期性补贴">周期性补贴</SelectItem>
              <SelectItem value="暂时扣押">暂时扣押</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="startDate">开始日期</Label>
          <Input 
            id="startDate" 
            type="date" 
            value={filters.startDate} 
            onChange={(e) => handleFilterChange('startDate', e.target.value)} 
          />
        </div>
        <div>
          <Label htmlFor="endDate">结束日期</Label>
          <Input 
            id="endDate" 
            type="date" 
            value={filters.endDate} 
            onChange={(e) => handleFilterChange('endDate', e.target.value)} 
          />
        </div>
        <div>
          <Label htmlFor="applyTo">应用范围</Label>
          <Select onValueChange={(value) => handleFilterChange('applyTo', value)}>
            <SelectTrigger>
              <SelectValue placeholder="选择范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="个人">个人</SelectItem>
              <SelectItem value="项目">项目</SelectItem>
              <SelectItem value="公司">公司</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-between">
        <Button onClick={handleSearch}>查询</Button>
        <Button onClick={handleExport} variant="outline">导出</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>类型</TableHead>
            <TableHead>金额</TableHead>
            <TableHead>生效日期</TableHead>
            <TableHead>应用范围</TableHead>
            <TableHead>目标</TableHead>
            <TableHead>频率</TableHead>
            <TableHead>终止日期</TableHead>
            <TableHead>暂扣状态</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.type}</TableCell>
              <TableCell>{record.amount}</TableCell>
              <TableCell>{record.effectiveDate}</TableCell>
              <TableCell>{record.applyTo}</TableCell>
              <TableCell>{record.target}</TableCell>
              <TableCell>{record.frequency || '-'}</TableCell>
              <TableCell>{record.endDate || '-'}</TableCell>
              <TableCell>
                {record.type === '暂时扣押' 
                  ? (record.withholdingStatus === 'pending' ? '未返回' : '已返回')
                  : '-'}
              </TableCell>
              <TableCell>
                {record.type === '暂时扣押' && record.withholdingStatus === 'pending' && (
                  <Button onClick={() => handleReturnWithholding(record)}>暂扣返回</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isReturnModalOpen} onOpenChange={setIsReturnModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认暂扣返回</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="returnDate">返回生效日期</Label>
            <Input
              id="returnDate"
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsReturnModalOpen(false)}>取消</Button>
            <Button type="submit" onClick={handleConfirmReturn}>确认返回</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

