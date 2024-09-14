"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import Navbar from "@/components/ui/Navbar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CornerDownLeft, Upload } from "lucide-react"

export default function ChatInterface() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [messages, setMessages] = useState<{ type: 'user' | 'bot', content: string }[]>([])
  const [inputMessage, setInputMessage] = useState('')

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setUploadedFiles(Array.from(files))
    }
  }

  const handleUploadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsUploading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log("Files to upload:", uploadedFiles)
    setIsUploading(false)
    setUploadedFiles([])
  }

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (inputMessage.trim()) {
      setMessages([...messages, { type: 'user', content: inputMessage }])
      setInputMessage('')
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { type: 'bot', content: 'Understood' }])
      }, 500)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      <main className="flex-1 overflow-auto p-4">
        <ScrollArea className="h-full">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg ${
                  message.type === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'
                } max-w-[80%] break-words`}
              >
                {message.content}
              </div>
            ))}
          </div>
        </ScrollArea>
      </main>
      <footer className="border-t bg-background p-2">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1"
          />
          <Button type="submit" size="icon" className="h-10">
            <CornerDownLeft className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="h-10">
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
                  <Label htmlFor="file-upload-footer">Choose files</Label>
                  <Input
                    id="file-upload-footer"
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
        </form>
      </footer>
    </div>
  )
}