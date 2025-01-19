'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TaxRecord {
  id: string
  name: string
  preTaxSalary: number
  tax: number
}

const mockTaxData: TaxRecord[] = [
  {
    id: '1',
    name: '张三',
    preTaxSalary: 9300,
    tax: 0,
  },
  // Add more mock data...
]

export default function TaxConfirmation() {
  const [taxData, setTaxData] = useState<TaxRecord[]>(mockTaxData)

  const handleTaxChange = (id: string, value: string) => {
    const numValue = parseFloat(value)
    setTaxData(prevData => 
      prevData.map(record => 
        record.id === id ? { ...record, tax: isNaN(numValue) ? 0 : numValue } : record
      )
    )
  }

  const handleConfirm = () => {
    // Here you would typically send the confirmed tax data to your backend
    console.log('Confirming tax data:', taxData)
    // Then you might want to navigate to the post-tax salary confirmation page or show a success message
  }

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Here you would typically handle the CSV file upload
    console.log('Uploading CSV file:', event.target.files?.[0])
    // Then you would parse the CSV and update the taxData state
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">税金确认</h2>
      <div>
        <Input type="file" accept=".csv" onChange={handleUpload} />
        <p className="text-sm text-gray-500 mt-1">上传CSV文件以批量导入税金数据</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>姓名</TableHead>
            <TableHead>税前工资</TableHead>
            <TableHead>税金</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {taxData.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.name}</TableCell>
              <TableCell>{record.preTaxSalary}</TableCell>
              <TableCell>
                <Input 
                  type="number" 
                  value={record.tax} 
                  onChange={(e) => handleTaxChange(record.id, e.target.value)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={handleConfirm}>确认税金</Button>
    </div>
  )
}

