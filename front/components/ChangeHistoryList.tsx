'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

interface ChangeRecord {
  id: number
  employeeId: number
  employeeName: string
  changeType: string
  changeDate: string
  reason: string
  previousDepartmentOrProject: string
  newDepartmentOrProject: string
  status: 'pending' | 'confirmed'
}

const mockChangeRecords: ChangeRecord[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: '张三',
    changeType: '入职',
    changeDate: '2023-06-01',
    reason: '新员工入职',
    previousDepartmentOrProject: '',
    newDepartmentOrProject: '技术部',
    status: 'confirmed',
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: '李四',
    changeType: '项目调岗',
    changeDate: '2023-06-15',
    reason: '项目需求',
    previousDepartmentOrProject: '项目A',
    newDepartmentOrProject: '项目B',
    status: 'pending',
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: '王五',
    changeType: '部门调动',
    changeDate: '2023-06-20',
    reason: '组织结构调整',
    previousDepartmentOrProject: '市场部',
    newDepartmentOrProject: '销售部',
    status: 'pending',
  },
  {
    id: 4,
    employeeId: 4,
    employeeName: '赵六',
    changeType: '离职',
    changeDate: '2023-07-01',
    reason: '个人原因',
    previousDepartmentOrProject: '人力资源部',
    newDepartmentOrProject: '',
    status: 'confirmed',
  },
  {
    id: 5,
    employeeId: 5,
    employeeName: '钱七',
    changeType: '晋升',
    changeDate: '2023-07-10',
    reason: '年度绩效评估',
    previousDepartmentOrProject: '初级工程师',
    newDepartmentOrProject: '高级工程师',
    status: 'pending',
  },
  {
    id: 6,
    employeeId: 6,
    employeeName: '孙八',
    changeType: '入职',
    changeDate: '2023-07-15',
    reason: '扩大团队规模',
    previousDepartmentOrProject: '',
    newDepartmentOrProject: '产品部',
    status: 'confirmed',
  },
  {
    id: 7,
    employeeId: 7,
    employeeName: '周九',
    changeType: '项目调岗',
    changeDate: '2023-07-20',
    reason: '项目完成',
    previousDepartmentOrProject: '项目C',
    newDepartmentOrProject: '项目D',
    status: 'pending',
  },
  {
    id: 8,
    employeeId: 8,
    employeeName: '吴十',
    changeType: '部门调动',
    changeDate: '2023-08-01',
    reason: '个人发展需求',
    previousDepartmentOrProject: '财务部',
    newDepartmentOrProject: '审计部',
    status: 'confirmed',
  },
]

export default function ChangeHistoryList() {
  const [changeRecords, setChangeRecords] = useState<ChangeRecord[]>(mockChangeRecords)
  const [searchKeyword, setSearchKeyword] = useState('')

  const handleConfirm = (id: number) => {
    setChangeRecords(prevRecords =>
      prevRecords.map(record =>
        record.id === id ? { ...record, status: 'confirmed' } : record
      )
    )
  }

  const handleReject = (id: number) => {
    setChangeRecords(prevRecords =>
      prevRecords.filter(record => record.id !== id)
    )
  }

  const pendingRecords = changeRecords.filter(record => record.status === 'pending')
  const confirmedRecords = changeRecords.filter(record => record.status === 'confirmed')

  const filteredConfirmedRecords = confirmedRecords.filter(record =>
    record.employeeName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    record.changeType.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    record.reason.toLowerCase().includes(searchKeyword.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {pendingRecords.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">待确认变动 ({pendingRecords.length})</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>员工</TableHead>
                <TableHead>变动类型</TableHead>
                <TableHead>变动时间</TableHead>
                <TableHead>原因</TableHead>
                <TableHead>变动前</TableHead>
                <TableHead>变动后</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.employeeName}</TableCell>
                  <TableCell>{record.changeType}</TableCell>
                  <TableCell>{record.changeDate}</TableCell>
                  <TableCell>{record.reason}</TableCell>
                  <TableCell>{record.previousDepartmentOrProject}</TableCell>
                  <TableCell>{record.newDepartmentOrProject}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleConfirm(record.id)} size="sm" className="mr-2">
                      确认
                    </Button>
                    <Button onClick={() => handleReject(record.id)} size="sm" variant="destructive">
                      拒绝
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4">变动历史记录</h3>
        <div className="mb-4 flex items-center">
          <Search className="w-5 h-5 mr-2 text-gray-500" />
          <Input
            type="text"
            placeholder="搜索员工、变动类型或原因"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>员工</TableHead>
              <TableHead>变动类型</TableHead>
              <TableHead>变动时间</TableHead>
              <TableHead>原因</TableHead>
              <TableHead>变动前</TableHead>
              <TableHead>变动后</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConfirmedRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.employeeName}</TableCell>
                <TableCell>{record.changeType}</TableCell>
                <TableCell>{record.changeDate}</TableCell>
                <TableCell>{record.reason}</TableCell>
                <TableCell>{record.previousDepartmentOrProject}</TableCell>
                <TableCell>{record.newDepartmentOrProject}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

