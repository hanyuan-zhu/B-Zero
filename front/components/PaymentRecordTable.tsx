'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from 'lucide-react'

interface PaymentRecord {
  id: number
  name: string
  department: string
  baseAmount: number
  personalContribution: number
  companyContribution: number
  paymentDate: string
}

const mockRecords: PaymentRecord[] = [
  { id: 1, name: '张三', department: '技术部', baseAmount: 10000, personalContribution: 1000, companyContribution: 2000, paymentDate: '2023-08-01' },
  { id: 2, name: '李四', department: '市场部', baseAmount: 12000, personalContribution: 1200, companyContribution: 2400, paymentDate: '2023-08-01' },
  { id: 3, name: '王五', department: '销售部', baseAmount: 15000, personalContribution: 1500, companyContribution: 3000, paymentDate: '2023-08-01' },
  // Add more mock data here...
]

interface PaymentRecordTableProps {
  type: 'social' | 'housing'
}

export default function PaymentRecordTable({ type }: PaymentRecordTableProps) {
  const [records, setRecords] = useState<PaymentRecord[]>(mockRecords)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<keyof PaymentRecord>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const recordsPerPage = 10

  useEffect(() => {
    // In a real application, you would fetch data from an API here
    setRecords(mockRecords)
  }, [])

  const handleEdit = (id: number) => {
    console.log(`Editing record with id ${id}`)
  }

  const handleDelete = (id: number) => {
    setRecords(prevRecords => prevRecords.filter(record => record.id !== id))
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleSort = (column: keyof PaymentRecord) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const filteredRecords = records.filter(record =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = sortedRecords.slice(indexOfFirstRecord, indexOfLastRecord)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const SortIcon = ({ column }: { column: keyof PaymentRecord }) => {
    if (column !== sortColumn) return <ChevronsUpDown className="ml-2 h-4 w-4" />
    return sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-gray-500" />
        <Input
          type="text"
          placeholder="搜索姓名或部门..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
              姓名 <SortIcon column="name" />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('department')}>
              部门 <SortIcon column="department" />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('baseAmount')}>
              缴费基数 <SortIcon column="baseAmount" />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('personalContribution')}>
              个人缴纳 <SortIcon column="personalContribution" />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('companyContribution')}>
              公司缴纳 <SortIcon column="companyContribution" />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('paymentDate')}>
              缴纳日期 <SortIcon column="paymentDate" />
            </TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.name}</TableCell>
              <TableCell>{record.department}</TableCell>
              <TableCell>{record.baseAmount}</TableCell>
              <TableCell>{record.personalContribution}</TableCell>
              <TableCell>{record.companyContribution}</TableCell>
              <TableCell>{record.paymentDate}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(record.id)} variant="outline" size="sm" className="mr-2">
                  编辑
                </Button>
                <Button onClick={() => handleDelete(record.id)} variant="destructive" size="sm">
                  删除
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center">
        <div>
          显示 {indexOfFirstRecord + 1} 到 {Math.min(indexOfLastRecord, sortedRecords.length)} 条，共 {sortedRecords.length} 条记录
        </div>
        <div className="space-x-2">
          <Button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
          >
            上一页
          </Button>
          <Button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastRecord >= sortedRecords.length}
            variant="outline"
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  )
}

