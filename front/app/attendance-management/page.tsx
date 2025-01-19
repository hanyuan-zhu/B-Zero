'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AbsenceRecordForm from '@/components/AbsenceRecordForm'
import AttendanceQuery from '@/components/AttendanceQuery'

export default function AttendanceManagement() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="absence-record">
        <TabsList>
          <TabsTrigger value="absence-record">缺勤记录</TabsTrigger>
          <TabsTrigger value="attendance-query">考勤查询</TabsTrigger>
        </TabsList>
        <TabsContent value="absence-record">
          <AbsenceRecordForm />
        </TabsContent>
        <TabsContent value="attendance-query">
          <AttendanceQuery />
        </TabsContent>
      </Tabs>
    </div>
  )
}

