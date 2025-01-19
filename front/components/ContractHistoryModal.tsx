'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ContractVersion {
  id: number
  version: number
  startDate: string
  endDate: string
  salary: number
  department: string
  project: string
  changeDate: string
  changeReason: string
}

interface ContractHistoryModalProps {
  employeeName: string
  employeeId: number
}

export default function ContractHistoryModal({ employeeName, employeeId }: ContractHistoryModalProps) {
  const [contractHistory, setContractHistory] = useState<ContractVersion[]>([])

  useEffect(() => {
    // 这里应该从后端获取合同历史数据
    // 为了演示，我们使用模拟数据
    const mockHistory: ContractVersion[] = [
      { id: 1, version: 1, startDate: '2022-01-01', endDate: '2023-01-01', salary: 10000, department: '一部', project: '项目A', changeDate: '2022-01-01', changeReason: '初始合同' },
      { id: 2, version: 2, startDate: '2023-01-01', endDate: '2024-01-01', salary: 12000, department: '二部', project: '项目B', changeDate: '2022-12-15', changeReason: '年度调薪' },
      { id: 3, version: 3, startDate: '2023-07-01', endDate: '2024-07-01', salary: 15000, department: '二部', project: '项目C', changeDate: '2023-06-15', changeReason: '项目调动' },
    ]
    setContractHistory(mockHistory)
  }, [employeeId])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">查看合同历史</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{employeeName}的合同历史</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>版本</TableHead>
              <TableHead>生效日期</TableHead>
              <TableHead>到期日期</TableHead>
              <TableHead>薪资</TableHead>
              <TableHead>部门</TableHead>
              <TableHead>项目</TableHead>
              <TableHead>变更日期</TableHead>
              <TableHead>变更原因</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contractHistory.map((version) => (
              <TableRow key={version.id}>
                <TableCell>{version.version}</TableCell>
                <TableCell>{version.startDate}</TableCell>
                <TableCell>{version.endDate}</TableCell>
                <TableCell>{version.salary}</TableCell>
                <TableCell>{version.department}</TableCell>
                <TableCell>{version.project}</TableCell>
                <TableCell>{version.changeDate}</TableCell>
                <TableCell>{version.changeReason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}

