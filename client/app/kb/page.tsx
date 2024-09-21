"use client";

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { CornerDownLeft, Upload, Check, FileText, Code, MessageCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for recently uploaded files
const recentFiles = [
  {
    id: 1,
    name: "project_report.pdf",
    type: "pdf",
    size: "2.5 MB",
    uploadDate: "2023-06-15",
    content: "This is a comprehensive project report detailing the progress and outcomes of the recent marketing campaign. It includes statistics, graphs, and recommendations for future strategies."
  },
  {
    id: 2,
    name: "data_analysis.py",
    type: "python",
    size: "15 KB",
    uploadDate: "2023-06-14",
    content: "import pandas as pd\nimport matplotlib.pyplot as plt\n\n# Load data\ndf = pd.read_csv('sales_data.csv')\n\n# Perform analysis\ntotal_sales = df['sales'].sum()\navg_sales = df['sales'].mean()\n\n# Create visualization\nplt.figure(figsize=(10,6))\nplt.bar(df['date'], df['sales'])\nplt.title('Daily Sales')\nplt.xlabel('Date')\nplt.ylabel('Sales ($)')\nplt.show()\n\nprint(f'Total Sales: ${total_sales}')\nprint(f'Average Daily Sales: ${avg_sales}')"
  }
]

export default function KnowledgeBase() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [messages, setMessages] = useState<{ type: 'user' | 'bot', content: string }[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState<typeof recentFiles[0] | null>(null)
  const [showChat, setShowChat] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

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
    <div className="flex flex-col h-screen bg-purple-50 dark:bg-purple-900">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-48 bg-purple-100 dark:bg-purple-800 p-3 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3 text-purple-800 dark:text-purple-200">Recent Files</h2>
          {recentFiles.map(file => (
            <Button
              key={file.id}
              variant="ghost"
              className="w-full justify-start mb-2 text-sm text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-700"
              onClick={() => {
                setSelectedFile(file)
                setShowChat(false)
              }}
            >
              {file.type === 'pdf' ? <FileText className="mr-2 h-4 w-4" /> : <Code className="mr-2 h-4 w-4" />}
              {file.name}
            </Button>
          ))}
        </aside>
        <main className="flex-1 p-4 flex flex-col">
          {selectedFile ? (
            <Card className="mb-4 bg-white dark:bg-purple-800">
              <CardHeader>
                <CardTitle className="text-purple-800 dark:text-purple-200">{selectedFile.name}</CardTitle>
                <CardDescription className="text-purple-600 dark:text-purple-300">
                  Type: {selectedFile.type.toUpperCase()} | Size: {selectedFile.size} | Uploaded: {selectedFile.uploadDate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-purple-50 dark:bg-purple-900">
                  <pre className="text-sm text-purple-800 dark:text-purple-200 whitespace-pre-wrap">
                    {selectedFile.content}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : showChat ? (
            <>
              <ScrollArea className="flex-1 mb-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg ${
                        message.type === 'user' ? 'bg-purple-600 text-white ml-auto' : 'bg-purple-200 dark:bg-purple-700 dark:text-purple-100'
                      } max-w-[80%] break-words text-sm`}
                    >
                      {message.content}
                      {message.type === 'bot' && message.content === 'Understood' && (
                        <Check className="inline-block ml-2 h-4 w-4" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <footer className="border-t bg-purple-100 dark:bg-purple-800 p-2">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 bg-white dark:bg-purple-700 dark:text-purple-100"
                  />
                  <Button type="submit" size="icon" className="h-10 bg-purple-600 hover:bg-purple-700">
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
                    <DialogContent className="bg-white dark:bg-purple-800">
                      <DialogHeader>
                        <DialogTitle>Upload Files</DialogTitle>
                        <DialogDescription>
                          Select files to upload to your backend.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleUploadSubmit} className="space-y-4">
                        <div>
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
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-purple-600 dark:text-purple-300">Select a file from the sidebar or start a chat.</p>
            </div>
          )}
        </main>
      </div>
      {!showChat && (
        <Button
          className="fixed bottom-4 right-4 rounded-full w-12 h-12 bg-purple-600 hover:bg-purple-700"
          onClick={() => {
            setSelectedFile(null)
            setShowChat(true)
          }}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}