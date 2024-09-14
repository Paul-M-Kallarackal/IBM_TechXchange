"use client";
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CornerDownLeft, Mic, Paperclip, Upload } from "lucide-react"

export default function ChatInterface() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setUploadedFiles(Array.from(files))
    }
  }

  const handleUploadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsUploading(true)

    // Simulating file upload to backend
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Here you would typically send the files to your backend
    console.log("Files to upload:", uploadedFiles)

    setIsUploading(false)
    setUploadedFiles([])
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4">
        <h1 className="text-xl font-semibold">Chat Interface</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Upload className="h-4 w-4" />
              <span className="sr-only">Upload files</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Upload Files</DialogTitle>
              <DialogDescription>
                Select files to upload to your backend.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Choose files</Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="mt-1"
                />
              </div>
              {uploadedFiles.length > 0 && (
                <div>
                  <p className="font-medium">Selected files:</p>
                  <ul className="list-disc pl-5">
                    {uploadedFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              <Button type="submit" disabled={isUploading || uploadedFiles.length === 0}>
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </header>
      <main className="flex-1 overflow-auto p-4">
        {/* Chat messages would go here */}
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Your chat messages will appear here.</p>
          </div>
        </div>
      </main>
      <footer className="border-t bg-background p-4">
        <form className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Textarea
              placeholder="Type your message here..."
              className="min-h-[80px] resize-none pr-12 text-base"
            />
            <div className="absolute bottom-1 right-1 flex space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Attach file</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                    <Mic className="h-4 w-4" />
                    <span className="sr-only">Use microphone</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Use microphone</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            </div>
          </div>
          <Button type="submit" size="icon" className="h-[80px]">
            <CornerDownLeft className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </footer>
    </div>
  )
}