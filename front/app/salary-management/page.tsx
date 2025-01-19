'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import PreTaxSalaryConfirmation from '@/components/PreTaxSalaryConfirmation'
import TaxConfirmation from '@/components/TaxConfirmation'
import PostTaxSalaryConfirmation from '@/components/PostTaxSalaryConfirmation'
import HistoricalSalaryQuery from '@/components/HistoricalSalaryQuery'

export default function SalaryManagement() {
  // const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">工资表管理</h1>
        {/* <Button onClick={() => setIsGenerateModalOpen(true)}>生成工资单</Button> */}
      </div>

      <Tabs defaultValue="pre-tax">
        <TabsList>
          <TabsTrigger value="pre-tax">税前工资表确认</TabsTrigger>
          <TabsTrigger value="tax">税金确认</TabsTrigger>
          <TabsTrigger value="post-tax">税后工资表确认</TabsTrigger>
          <TabsTrigger value="history">历史工资查询</TabsTrigger>
        </TabsList>
        <TabsContent value="pre-tax">
          <PreTaxSalaryConfirmation />
        </TabsContent>
        <TabsContent value="tax">
          <TaxConfirmation />
        </TabsContent>
        <TabsContent value="post-tax">
          <PostTaxSalaryConfirmation />
        </TabsContent>
        <TabsContent value="history">
          <HistoricalSalaryQuery />
        </TabsContent>
      </Tabs>

      {/* <GenerateSalaryModal isOpen={isGenerateModalOpen} onClose={() => setIsGenerateModalOpen(false)} /> */}
    </div>
  )
}

