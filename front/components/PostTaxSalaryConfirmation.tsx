'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PostTaxSalaryRecord {
  id: string
  name: string
  baseSalary: number
  attendanceRate: number
  bonusDeduction: number
  socialInsurance: number
  housingFund: number
  tax: number
  postTaxSalary: number
}

const mockPostTaxData: PostTaxSalaryRecord[] = [
  {
    id: '1',
    name: '张三',
    baseSalary: 10000,
    attendanceRate: 0.95,
    bonusDeduction: 1000,
    socialInsurance: 800,
    housingFund: 400,
    tax: 500,
    postTaxSalary: 8800,
  },
  // Add more mock data...
]

export default function PostTaxSalaryConfirmation() {
  const [postTaxData, setPostTaxData] = useState<PostTaxSalaryRecord[]>(mockPostTaxData)

  const handleConfirm = () => {
    // Here you would typically send the confirmed data to your backend
    console.log('Confirming post-tax salary data:', postTaxData)
    // Then you might want to show a success message or navigate to another page
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">税后工资表确认</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>姓名</TableHead>
            <TableHead>基础工资</TableHead>
            <TableHead>考勤系数</TableHead>
            <TableHead>薪资奖扣额</TableHead>
            <TableHead>社保个人缴纳额</TableHead>
            <TableHead>公积金个人缴纳额</TableHead>
            <TableHead>税金</TableHead>
            <TableHead>税后工资</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {postTaxData.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.name}</TableCell>
              <TableCell>{record.baseSalary}</TableCell>
              <TableCell>{record.attendanceRate}</TableCell>
              <TableCell>{record.bonusDeduction}</TableCell>
              <TableCell>{record.socialInsurance}</TableCell>
              <TableCell>{record.housingFund}</TableCell>
              <TableCell>{record.tax}</TableCell>
              <TableCell>{record.postTaxSalary}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={handleConfirm}>确认税后工资表</Button>
    </div>
  )
}

