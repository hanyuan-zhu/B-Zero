'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import NewContractForm from '@/components/NewContractForm'
import EditContractForm from '@/components/EditContractForm'
import ContractHistoryModal from '@/components/ContractHistoryModal'

// 模拟合同数据
const mockContracts = [
  { id: 1, name: '张三', company: '公司X', salary: 10000, startDate: '2023-01-01', endDate: '2024-01-01', department: '一部', project: '项目A' },
  { id: 2, name: '李四', company: '公司Y', salary: 12000, startDate: '2023-02-01', endDate: '2024-02-01', department: '二部', project: '项目B' },
  { id: 3, name: '王五', company: '公司X', salary: 15000, startDate: '2023-03-01', endDate: '2024-03-01', department: '三部', project: '项目C' },
]

export default function ContractManagement() {
  const [filter, setFilter] = useState({ department: 'all', project: 'all' })
  const [contracts, setContracts] = useState(mockContracts)

  const filteredContracts = contracts.filter(contract => 
    (filter.department === 'all' || contract.department === filter.department) &&
    (filter.project === 'all' || contract.project === filter.project)
  )

  const handleContractUpdate = (updatedContract) => {
    setContracts(prevContracts => 
      prevContracts.map(contract => 
        contract.id === updatedContract.id ? updatedContract : contract
      )
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">合同管理</h1>
      <div className="flex justify-between items-center">
        <NewContractForm />
      </div>

      <div className="flex space-x-4">
        <Select onValueChange={(value) => setFilter({...filter, department: value})}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择部门" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有部门</SelectItem>
            <SelectItem value="一部">一部</SelectItem>
            <SelectItem value="二部">二部</SelectItem>
            <SelectItem value="三部">三部</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setFilter({...filter, project: value})}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择项目" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有项目</SelectItem>
            <SelectItem value="项目A">项目A</SelectItem>
            <SelectItem value="项目B">项目B</SelectItem>
            <SelectItem value="项目C">项目C</SelectItem>
          </SelectContent>
        </Select>

        <Input 
          placeholder="搜索合同" 
          className="max-w-sm" 
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>姓名</TableHead>
            <TableHead>所属公司</TableHead>
            <TableHead>合同薪资</TableHead>
            <TableHead>生效日期</TableHead>
            <TableHead>到期日期</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell>{contract.name}</TableCell>
              <TableCell>{contract.company}</TableCell>
              <TableCell>{contract.salary}</TableCell>
              <TableCell>{contract.startDate}</TableCell>
              <TableCell>{contract.endDate}</TableCell>
              <TableCell>
                <ContractHistoryModal employeeName={contract.name} employeeId={contract.id} />
                <EditContractForm contract={contract} onSave={handleContractUpdate} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

