'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface QueryResult {
  id: number
  name: string
  department: string
  baseAmount: number
  personalContribution: number
  companyContribution: number
  paymentDate: string
  type: 'social' | 'housing'
}

interface RecordQueryAndExportProps {
  type: 'social' | 'housing' | 'both'
}

export default function RecordQueryAndExport({ type }: RecordQueryAndExportProps) {
  const [queryParams, setQueryParams] = useState({
    name: '',
    department: '',
    startDate: '',
    endDate: '',
    recordType: type === 'both' ? 'all' : type
  })
  const [queryResults, setQueryResults] = useState<QueryResult[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setQueryParams(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setQueryParams(prev => ({ ...prev, [field]: value }))
  }

  const handleQuery = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send a request to your backend to get the query results
    // For now, we'll just use some mock data
    const mockResults: QueryResult[] = [
      { id: 1, name: '张三', department: '技术部', baseAmount: 10000, personalContribution: 1000, companyContribution: 2000, paymentDate: '2023-08-01', type: 'social' },
      { id: 2, name: '李四', department: '市场部', baseAmount: 12000, personalContribution: 1200, companyContribution: 2400, paymentDate: '2023-08-01', type: 'housing' },
    ]
    setQueryResults(mockResults)
  }

  const handleExport = () => {
    // Here you would typically generate and download an export file
    console.log('Exporting query results')
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleQuery} className="space-y-4">
        <h2 className="text-xl font-semibold">记录查询</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">姓名</Label>
            <Input id="name" name="name" value={queryParams.name} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="department">部门</Label>
            <Select onValueChange={(value) => handleSelectChange('department', value)} value={queryParams.department}>
              <SelectTrigger>
                <SelectValue placeholder="选择部门" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有部门</SelectItem>
                <SelectItem value="技术部">技术部</SelectItem>
                <SelectItem value="市场部">市场部</SelectItem>
                <SelectItem value="销售部">销售部</SelectItem>
                <SelectItem value="人力资源部">人力资源部</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="startDate">开始日期</Label>
            <Input id="startDate" name="startDate" type="date" value={queryParams.startDate} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="endDate">结束日期</Label>
            <Input id="endDate" name="endDate" type="date" value={queryParams.endDate} onChange={handleInputChange} />
          </div>
          {type === 'both' && (
            <div>
              <Label htmlFor="recordType">记录类型</Label>
              <Select onValueChange={(value) => handleSelectChange('recordType', value)} value={queryParams.recordType}>
                <SelectTrigger>
                  <SelectValue placeholder="选择记录类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="social">社保</SelectItem>
                  <SelectItem value="housing">公积金</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <Button type="submit">查询</Button>
      </form>

      {queryResults.length > 0 && (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>姓名</TableHead>
                <TableHead>部门</TableHead>
                <TableHead>缴费基数</TableHead>
                <TableHead>个人缴纳</TableHead>
                <TableHead>公司缴纳</TableHead>
                <TableHead>缴纳日期</TableHead>
                {type === 'both' && <TableHead>记录类型</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {queryResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>{result.name}</TableCell>
                  <TableCell>{result.department}</TableCell>
                  <TableCell>{result.baseAmount}</TableCell>
                  <TableCell>{result.personalContribution}</TableCell>
                  <TableCell>{result.companyContribution}</TableCell>
                  <TableCell>{result.paymentDate}</TableCell>
                  {type === 'both' && <TableCell>{result.type === 'social' ? '社保' : '公积金'}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={handleExport}>导出查询结果</Button>
        </div>
      )}
    </div>
  )
}

