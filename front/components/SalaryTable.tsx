'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'

interface SalaryRecord {
  id: string
  name: string
  project: string
  company: string
  baseSalary: number
  positionSalary: number
  bonus: number
  socialInsurance: number
  housingFund: number
  tax: number
  attendanceRate: number
  preTaxSalary: number
  afterTaxSalary: number
  status: 'draft' | 'pending' | 'approved' | 'paid'
}

const mockData: SalaryRecord[] = [
  {
    id: '1',
    name: '张三',
    project: '项目A',
    company: '公司X',
    baseSalary: 8000,
    positionSalary: 2000,
    bonus: 1000,
    socialInsurance: 800,
    housingFund: 400,
    tax: 500,
    attendanceRate: 1,
    preTaxSalary: 10200,
    afterTaxSalary: 9700,
    status: 'approved',
  },
  // 添加更多模拟数据...
]

export default function SalaryTable() {
  const [data, setData] = useState<SalaryRecord[]>(mockData)
  const [sortColumn, setSortColumn] = useState<keyof SalaryRecord | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleSort = (column: keyof SalaryRecord) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }

    const sortedData = [...data].sort((a, b) => {
      if (a[column] < b[column]) return sortDirection === 'asc' ? -1 : 1
      if (a[column] > b[column]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    setData(sortedData)
  }

  const SortIcon = ({ column }: { column: keyof SalaryRecord }) => {
    if (column !== sortColumn) return <ChevronsUpDown className="ml-2 h-4 w-4" />
    return sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
            姓名 <SortIcon column="name" />
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort('project')}>
            项目 <SortIcon column="project" />
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort('company')}>
            公司 <SortIcon column="company" />
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort('baseSalary')}>
            基础工资 <SortIcon column="baseSalary" />
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort('positionSalary')}>
            岗位工资 <SortIcon column="positionSalary" />
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort('bonus')}>
            奖金 <SortIcon column="bonus" />
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort('socialInsurance')}>
            社保 <SortIcon column="socialInsurance" />
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort('housingFund')}>
            公积金 <SortIcon column="housingFund" />
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort('tax')}>
            税金 <SortIcon column="tax" />
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort('attendanceRate')}>
            考勤系数 <SortIcon column="attendanceRate" />
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort('preTaxSalary')}>
            税前工资 <SortIcon column="preTaxSalary" />
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort('afterTaxSalary')}>
            税后工资 <SortIcon column="afterTaxSalary" />
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
            状态 <SortIcon column="status" />
          </TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{record.name}</TableCell>
            <TableCell>{record.project}</TableCell>
            <TableCell>{record.company}</TableCell>
            <TableCell>{record.baseSalary}</TableCell>
            <TableCell>{record.positionSalary}</TableCell>
            <TableCell>{record.bonus}</TableCell>
            <TableCell>{record.socialInsurance}</TableCell>
            <TableCell>{record.housingFund}</TableCell>
            <TableCell>{record.tax}</TableCell>
            <TableCell>{record.attendanceRate}</TableCell>
            <TableCell>{record.preTaxSalary}</TableCell>
            <TableCell>{record.afterTaxSalary}</TableCell>
            <TableCell>{record.status}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm">查看详情</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

