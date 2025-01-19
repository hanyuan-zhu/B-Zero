'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface HistoricalSalaryRecord {
  id: string
  name: string
  department: string
  month: string
  postTaxSalary: number
}

const mockHistoricalData: HistoricalSalaryRecord[] = [
  {
    id: '1',
    name: '张三',
    department: '技术部',
    month: '2023-07',
    postTaxSalary: 8800,
  },
  // Add more mock data...
]

export default function HistoricalSalaryQuery() {
  const [queryParams, setQueryParams] = useState({
    name: '',
    department: '',
    month: '',
  })
  const [queryResults, setQueryResults] = useState<HistoricalSalaryRecord[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setQueryParams(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setQueryParams(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = () => {
    // Here you would typically fetch data from your backend based on the query params
    // For now, we'll just filter the mock data
    const filteredResults = mockHistoricalData.filter(record => 
      (queryParams.name === '' || record.name.includes(queryParams.name)) &&
      (queryParams.department === '' || record.department === queryParams.department) &&
      (queryParams.month === '' || record.month === queryParams.month)
    )
    setQueryResults(filteredResults)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">历史工资查询</h2>
      <div className="grid grid-cols-3 gap-4">
        <Input 
          placeholder="员工姓名" 
          name="name" 
          value={queryParams.name} 
          onChange={handleInputChange}
        />
        <Select onValueChange={(value) => handleSelectChange('department', value)}>
          <SelectTrigger>
            <SelectValue placeholder="选择部门" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="技术部">技术部</SelectItem>
            <SelectItem value="市场部">市场部</SelectItem>
            <SelectItem value="人力资源部">人力资源部</SelectItem>
          </SelectContent>
        </Select>
        <Input 
          type="month" 
          name="month" 
          value={queryParams.month} 
          onChange={handleInputChange}
        />
      </div>
      <Button onClick={handleSearch}>查询</Button>
      {queryResults.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>姓名</TableHead>
              <TableHead>部门</TableHead>
              <TableHead>月份</TableHead>
              <TableHead>税后工资</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queryResults.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.department}</TableCell>
                <TableCell>{record.month}</TableCell>
                <TableCell>{record.postTaxSalary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

