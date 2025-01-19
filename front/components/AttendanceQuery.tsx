'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AttendanceRecord {
  id: number
  name: string
  company: string
  expectedDays: number
  actualDays: number
  attendanceRate: string
}

const mockAttendanceRecords: AttendanceRecord[] = [
  { id: 1, name: '张三', company: '公司X', expectedDays: 22, actualDays: 20, attendanceRate: '90.91%' },
  { id: 2, name: '李四', company: '公司Y', expectedDays: 22, actualDays: 22, attendanceRate: '100%' },
  { id: 3, name: '王五', company: '公司X', expectedDays: 22, actualDays: 21, attendanceRate: '95.45%' },
]

export default function AttendanceQuery() {
  const [filters, setFilters] = useState({
    name: '',
    department: '',
    month: ''
  })

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Querying with filters:', filters)
    // Here you would typically fetch data based on the filters
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <div>
            <Label htmlFor="name">姓名</Label>
            <Input id="name" value={filters.name} onChange={(e) => handleFilterChange('name', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="department">部门</Label>
            <Select onValueChange={(value) => handleFilterChange('department', value)}>
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
            <Label htmlFor="month">月份</Label>
            <Input id="month" type="month" value={filters.month} onChange={(e) => handleFilterChange('month', e.target.value)} />
          </div>
        </div>
        <Button type="submit">查询</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>姓名</TableHead>
            <TableHead>所属公司</TableHead>
            <TableHead>应出勤天数</TableHead>
            <TableHead>实际出勤天数</TableHead>
            <TableHead>出勤率</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockAttendanceRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.name}</TableCell>
              <TableCell>{record.company}</TableCell>
              <TableCell>{record.expectedDays}</TableCell>
              <TableCell>{record.actualDays}</TableCell>
              <TableCell>{record.attendanceRate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

