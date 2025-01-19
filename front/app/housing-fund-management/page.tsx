'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PaymentRecordTable from '@/components/PaymentRecordTable'
import PaymentRecordForm from '@/components/PaymentRecordForm'
import RecordQueryAndExport from '@/components/RecordQueryAndExport'

export default function HousingFundManagement() {
  const [activeTab, setActiveTab] = useState('records')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">公积金管理</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="records">缴费记录</TabsTrigger>
          <TabsTrigger value="query">记录查询</TabsTrigger>
        </TabsList>
        <TabsContent value="records">
          <div className="space-y-4">
            <PaymentRecordForm type="housing" />
            <PaymentRecordTable type="housing" />
          </div>
        </TabsContent>
        <TabsContent value="query">
          <RecordQueryAndExport type="housing" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

