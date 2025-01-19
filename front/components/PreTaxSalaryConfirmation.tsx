'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import GenerateSalaryModal from './GenerateSalaryModal'

interface PreTaxSalaryRecord {
  id: string
  name: string
  baseSalary: number
  attendanceRate: number
  bonusDeduction: number
  socialInsurance: number
  housingFund: number
  preTaxSalary: number
}

const mockPreTaxData: PreTaxSalaryRecord[] = [
  {
    id: '1',
    name: '张三',
    baseSalary: 10000,
    attendanceRate: 0.95,
    bonusDeduction: 1000,
    socialInsurance: 800,
    housingFund: 400,
    preTaxSalary: 9300,
  },
  // Add more mock data...
]

export default function PreTaxSalaryConfirmation() {
  const [preTaxData, setPreTaxData] = useState<PreTaxSalaryRecord[]>(mockPreTaxData)
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)

  const handleGenerateSalary = (department: string, month: string) => {
    // Here you would fetch data and generate the pre-tax salary table
    console.log('Generating salary for department:', department, 'and month:', month)
    // After generating, you would update the preTaxData state
  }

  const handleConfirm = () => {
    // Here you would typically send the confirmed data to your backend
    console.log('Confirming pre-tax salary data:', preTaxData)
    // Then you might want to navigate to the tax confirmation page or show a success message
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">税前工资表确认</h2>
        <Button onClick={() => setIsGenerateModalOpen(true)}>生成工资单</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>姓名</TableHead>
            <TableHead>基础工资</TableHead>
            <TableHead>考勤系数</TableHead>
            <TableHead>薪资奖扣额</TableHead>
            <TableHead>社保个人缴纳额</TableHead>
            <TableHead>公积金个人缴纳额</TableHead>
            <TableHead>税前工资</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {preTaxData.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.name}</TableCell>
              <TableCell>{record.baseSalary}</TableCell>
              <TableCell>{record.attendanceRate}</TableCell>
              <TableCell>{record.bonusDeduction}</TableCell>
              <TableCell>{record.socialInsurance}</TableCell>
              <TableCell>{record.housingFund}</TableCell>
              <TableCell>{record.preTaxSalary}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={handleConfirm}>确认税前工资表</Button>
      <GenerateSalaryModal 
        isOpen={isGenerateModalOpen} 
        onClose={() => setIsGenerateModalOpen(false)}
        onGenerate={handleGenerateSalary}
      />
    </div>
  )
}

