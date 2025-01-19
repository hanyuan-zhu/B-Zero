'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SocialInsuranceChangeConfirmation from '@/components/SocialInsuranceChangeConfirmation'
import PaymentRecordTable from '@/components/PaymentRecordTable'
import PaymentRecordForm from '@/components/PaymentRecordForm'
import RecordQueryAndExport from '@/components/RecordQueryAndExport'
import BulkUploadModal from '@/components/BulkUploadModal'
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'

export default function SocialInsuranceManagement() {
  const [activeTab, setActiveTab] = useState('changes')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showHousingFundAddForm, setShowHousingFundAddForm] = useState(false)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">社保公积金管理</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="changes">变更确认</TabsTrigger>
          <TabsTrigger value="social-records">社保缴费记录</TabsTrigger>
          <TabsTrigger value="housing-fund-records">公积金记录</TabsTrigger>
          <TabsTrigger value="query">记录查询</TabsTrigger>
        </TabsList>
        <TabsContent value="changes">
          <SocialInsuranceChangeConfirmation />
        </TabsContent>
        <TabsContent value="social-records">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">社保缴费记录</h2>
              <div className="space-x-2">
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {showAddForm ? '取消添加' : '添加记录'}
                </Button>
                <BulkUploadModal />
              </div>
            </div>
            {showAddForm && <PaymentRecordForm type="social" />}
            <PaymentRecordTable type="social" />
          </div>
        </TabsContent>
        <TabsContent value="housing-fund-records">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">公积金记录</h2>
              <div className="space-x-2">
                <Button onClick={() => setShowHousingFundAddForm(!showHousingFundAddForm)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {showHousingFundAddForm ? '取消添加' : '添加记录'}
                </Button>
                <BulkUploadModal />
              </div>
            </div>
            {showHousingFundAddForm && <PaymentRecordForm type="housing" />}
            <PaymentRecordTable type="housing" />
          </div>
        </TabsContent>
        <TabsContent value="query">
          <RecordQueryAndExport type="both" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

