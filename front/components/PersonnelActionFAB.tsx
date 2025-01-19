'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { PlusIcon, UserPlusIcon, UserMinusIcon, ArrowRightIcon, UsersIcon } from 'lucide-react'
import NewEmployeeModal from './NewEmployeeModal'
import ResignModal from './ResignModal'
import DepartmentTransferModal from './DepartmentTransferModal'
import ProjectTransferModal from './ProjectTransferModal'

export default function PersonnelActionFAB() {
  const [isOpen, setIsOpen] = useState(false)
  const [isNewEmployeeModalOpen, setIsNewEmployeeModalOpen] = useState(false)
  const [isResignModalOpen, setIsResignModalOpen] = useState(false)
  const [isDepartmentTransferModalOpen, setIsDepartmentTransferModalOpen] = useState(false)
  const [isProjectTransferModalOpen, setIsProjectTransferModalOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="fixed bottom-8 right-8 flex flex-col items-end space-y-2">
      {isOpen && (
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <div className="flex items-center space-x-2 mb-2 last:mb-0">
            <span className="flex-grow">添加新员工</span>
            <Button
              size="icon"
              className="rounded-full bg-green-500 hover:bg-green-600"
              onClick={() => setIsNewEmployeeModalOpen(true)}
            >
              <UserPlusIcon className="h-6 w-6" />
              <span className="sr-only">添加新员工</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2 mb-2 last:mb-0">
            <span className="flex-grow">人员离职</span>
            <Button
              size="icon"
              className="rounded-full bg-red-500 hover:bg-red-600"
              onClick={() => setIsResignModalOpen(true)}
            >
              <UserMinusIcon className="h-6 w-6" />
              <span className="sr-only">人员离职</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2 mb-2 last:mb-0">
            <span className="flex-grow">人员项目调岗</span>
            <Button 
              size="icon" 
              className="rounded-full bg-blue-500 hover:bg-blue-600"
              onClick={() => setIsProjectTransferModalOpen(true)}
            >
              <ArrowRightIcon className="h-6 w-6" />
              <span className="sr-only">人员项目调岗</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2 mb-2 last:mb-0">
            <span className="flex-grow">人员部门调动</span>
            <Button 
              size="icon" 
              className="rounded-full bg-purple-500 hover:bg-purple-600"
              onClick={() => setIsDepartmentTransferModalOpen(true)}
            >
              <UsersIcon className="h-6 w-6" />
              <span className="sr-only">人员部门调动</span>
            </Button>
          </div>
        </div>
      )}
      <Button
        size="icon"
        className="rounded-full bg-primary hover:bg-primary/90"
        onClick={() => setIsOpen(!isOpen)}
      >
        <PlusIcon className="h-6 w-6" />
        <span className="sr-only">人员变动操作</span>
      </Button>
      <NewEmployeeModal
        isOpen={isNewEmployeeModalOpen}
        onClose={() => setIsNewEmployeeModalOpen(false)}
      />
      <ResignModal
        isOpen={isResignModalOpen}
        onClose={() => setIsResignModalOpen(false)}
        selectedEmployee={null}
      />
      <DepartmentTransferModal
        isOpen={isDepartmentTransferModalOpen}
        onClose={() => setIsDepartmentTransferModalOpen(false)}
        selectedEmployee={null}
      />
      <ProjectTransferModal
        isOpen={isProjectTransferModalOpen}
        onClose={() => setIsProjectTransferModalOpen(false)}
        selectedEmployee={null}
      />
    </div>
  )
}

