'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Check, ChevronsUpDown, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import PersonnelTable from './PersonnelTable'

const departments = [
  { label: "所有部门", value: "" },
  { label: "一部", value: "一部" },
  { label: "二部", value: "二部" },
  { label: "三部", value: "三部" },
]

const projects = [
  { label: "所有项目", value: "" },
  { label: "项目A", value: "项目A" },
  { label: "项目B", value: "项目B" },
  { label: "项目C", value: "项目C" },
  { label: "项目D", value: "项目D" },
  { label: "项目E", value: "项目E" },
  { label: "项目F", value: "项目F" },
]

export default function PersonnelList() {
  const [filters, setFilters] = useState({
    department: '',
    project: '',
    keyword: '',
    startDate: null as Date | null,
    endDate: null as Date | null
  })
  const [showMore, setShowMore] = useState(false)

  const handleFilterChange = (key: string, value: string | Date | null) => {
    setFilters({ ...filters, [key]: value })
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索姓名或职位"
            value={filters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            className="pl-8"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-[150px]">
              {filters.department
                ? departments.find((dept) => dept.value === filters.department)?.label
                : "选择部门"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="搜索部门..." />
              <CommandEmpty>未找到部门</CommandEmpty>
              <CommandGroup>
                {departments.map((dept) => (
                  <CommandItem
                    key={dept.value}
                    onSelect={() => handleFilterChange('department', dept.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        filters.department === dept.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {dept.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          onClick={() => setShowMore(!showMore)}
          className="w-[100px]"
        >
          {showMore ? '收起' : '更多'}
          {showMore ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </Button>

        {showMore && (
          <div className="w-full flex flex-wrap gap-2 mt-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-[150px]">
                  {filters.project
                    ? projects.find((proj) => proj.value === filters.project)?.label
                    : "选择项目"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="搜索项目..." />
                  <CommandEmpty>未找到项目</CommandEmpty>
                  <CommandGroup>
                    {projects.map((proj) => (
                      <CommandItem
                        key={proj.value}
                        onSelect={() => handleFilterChange('project', proj.value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            filters.project === proj.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {proj.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[150px] justify-start text-left font-normal",
                    !filters.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.startDate ? format(filters.startDate, "yyyy-MM-dd") : <span>开始日期</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.startDate}
                  onSelect={(date) => handleFilterChange('startDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[150px] justify-start text-left font-normal",
                    !filters.endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.endDate ? format(filters.endDate, "yyyy-MM-dd") : <span>结束日期</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.endDate}
                  onSelect={(date) => handleFilterChange('endDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
      <PersonnelTable filters={filters} />
    </div>
  )
}

