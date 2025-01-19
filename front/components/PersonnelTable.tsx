'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import ResignModal from './ResignModal'
import DepartmentTransferModal from './DepartmentTransferModal'
import ProjectTransferModal from './ProjectTransferModal'

interface Personnel {
  id: string
  name: string
  position: string
  department: string
  project: string
  joinDate: string
  status: string
  company: string
}

interface PersonnelTableProps {
  filters: {
    department: string
    project: string
    keyword: string
    startDate: Date | null
    endDate: Date | null
  }
}

const mockData: Personnel[] = [
  { id: '1', name: '张三', position: '总监理工程师', department: '一部', project: '项目A', joinDate: '2022-01-01', status: '在职', company: '公司X' },
  { id: '2', name: '李四', position: '专业监理工程师', department: '二部', project: '项目B', joinDate: '2022-02-15', status: '在职', company: '公司Y' },
  { id: '3', name: '王五', position: '总监理工程师', department: '三部', project: '项目C', joinDate: '2022-03-10', status: '在职', company: '公司X' },
  { id: '4', name: '赵六', position: '监理员', department: '一部', project: '项目D', joinDate: '2022-04-05', status: '在职', company: '公司Y' },
  { id: '5', name: '钱七', position: '监理员', department: '二部', project: '项目E', joinDate: '2022-05-20', status: '待岗', company: '公司X' },
  { id: '6', name: '孙八', position: '总监理工程师', department: '三部', project: '项目F', joinDate: '2022-06-15', status: '在职', company: '公司Y' },
]

export default function PersonnelTable({ filters }: PersonnelTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [resignModalOpen, setResignModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Personnel | null>(null)
  const [departmentTransferModalOpen, setDepartmentTransferModalOpen] = useState(false)
  const [projectTransferModalOpen, setProjectTransferModalOpen] = useState(false)
  const [selectedEmployeeForTransfer, setSelectedEmployeeForTransfer] = useState<Personnel | null>(null)

  // In a real application, you would fetch data based on filters and pagination
  const filteredData = mockData.filter(item => 
    (!filters.department || item.department === filters.department) &&
    (!filters.project || item.project === filters.project) &&
    (!filters.keyword || (item.name && item.name.includes(filters.keyword)) || (item.position && item.position.includes(filters.keyword))) &&
    (!filters.startDate || (item.joinDate && new Date(item.joinDate) >= filters.startDate)) &&
    (!filters.endDate || (item.joinDate && new Date(item.joinDate) <= filters.endDate))
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>姓名</TableHead>
            <TableHead>职位</TableHead>
            <TableHead>部门</TableHead>
            <TableHead>项目</TableHead>
            <TableHead>入职日期</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.position}</TableCell>
              <TableCell>{item.department}</TableCell>
              <TableCell>{item.project}</TableCell>
              <TableCell>{item.joinDate}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mr-2"
                  onClick={() => {
                    setSelectedEmployeeForTransfer(item)
                    setProjectTransferModalOpen(true)
                  }}
                >
                  调岗
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mr-2"
                  onClick={() => {
                    setSelectedEmployeeForTransfer(item)
                    setDepartmentTransferModalOpen(true)
                  }}
                >
                  调动
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSelectedEmployee(item)
                    setResignModalOpen(true)
                  }}
                >
                  离职
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between">
        <Button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          上一页
        </Button>
        <span>第 {currentPage} 页，共 {totalPages} 页</span>
        <Button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          下一页
        </Button>
      </div>
      <ResignModal
        isOpen={resignModalOpen}
        onClose={() => {
          setResignModalOpen(false)
          setSelectedEmployee(null)
        }}
        selectedEmployee={selectedEmployee}
      />
      <DepartmentTransferModal
        isOpen={departmentTransferModalOpen}
        onClose={() => {
          setDepartmentTransferModalOpen(false)
          setSelectedEmployeeForTransfer(null)
        }}
        selectedEmployee={selectedEmployeeForTransfer}
      />
      <ProjectTransferModal
        isOpen={projectTransferModalOpen}
        onClose={() => {
          setProjectTransferModalOpen(false)
          setSelectedEmployeeForTransfer(null)
        }}
        selectedEmployee={selectedEmployeeForTransfer}
      />
    </div>
  )
}

