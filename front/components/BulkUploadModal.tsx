'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertCircle, Upload } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function BulkUploadModal() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadResult(null)

    // 这里应该是实际的上传逻辑
    // 为了演示，我们使用 setTimeout 模拟上传过程
    setTimeout(() => {
      setIsUploading(false)
      setUploadResult({
        success: true,
        message: `成功上传文件 ${file.name}，共处理 100 条记录。`
      })
      setFile(null)
    }, 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          批量上传
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>批量上传社保缴费记录</DialogTitle>
          <DialogDescription>
            请上传包含社保缴费记录的 CSV 或 Excel 文件。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              选择文件
            </Label>
            <Input
              id="file"
              type="file"
              className="col-span-3"
              onChange={handleFileChange}
              accept=".csv,.xlsx,.xls"
            />
          </div>
        </div>
        {uploadResult && (
          <Alert variant={uploadResult.success ? "default" : "destructive"}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{uploadResult.success ? "上传成功" : "上传失败"}</AlertTitle>
            <AlertDescription>
              {uploadResult.message}
            </AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <Button type="submit" onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? "上传中..." : "上传"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

