'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface ChangeRecord {
  id: number
  name: string
  previousDepartment: string
  newDepartment: string
  changeDate: string
}

const mockChangeRecords: ChangeRecord[] = [
  { id: 1, name: '张三', previousDepartment: '技术部', newDepartment: '产品部', changeDate: '2023-08-01' },
  { id: 2, name: '李四', previousDepartment: '市场部', newDepartment: '销售部', changeDate: '2023-08-15' },
  { id: 3, name: '王五', previousDepartment: '', newDepartment: '人力资源部', changeDate: '2023-08-20' },
]

export default function SocialInsuranceChangeConfirmation() {
  const [changeRecords, setChangeRecords] = useState<ChangeRecord[]>(mockChangeRecords)

  const handleConfirm = (id: number) => {
    setChangeRecords(prevRecords => prevRecords.filter(record => record.id !== id))
    // Here you would typically send a request to your backend to update the record
    console.log(`Confirmed change for record with id ${id}`)
  }

  const handleReject = (id: number) => {
    setChangeRecords(prevRecords => prevRecords.filter(record => record.id !== id))
    // Here you would typically send a request to your backend to delete or mark the record as rejected
    console.log(`Rejected change for record with id ${id}`)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">待确认的社保变更</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>姓名</TableHead>
            <TableHead>原部门</TableHead>
            <TableHead>新部门</TableHead>
            <TableHead>变动日期</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {changeRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.name}</TableCell>
              <TableCell>{record.previousDepartment || '新入职'}</TableCell>
              <TableCell>{record.newDepartment || '离职'}</TableCell>
              <TableCell>{record.changeDate}</TableCell>
              <TableCell>
                <Button onClick={() => handleConfirm(record.id)} className="mr-2">确认</Button>
                <Button onClick={() => handleReject(record.id)} variant="destructive">拒绝</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

