"use client";

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import Navbar from "@/components/ui/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Code, RefreshCw, Upload, Github, CornerDownLeft } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const mockRepositories = [
  { id: 1, name: "project-alpha", readme: "# Project Alpha\n\nThis is a sample README for Project Alpha." },
  { id: 2, name: "project-beta", readme: "# Project Beta\n\nThis is a sample README for Project Beta." },
  { id: 3, name: "project-gamma", readme: "# Project Gamma\n\nThis is a sample README for Project Gamma." },
]

const mockPDFs = [
  { id: 1, name: "report.pdf", content: "This is a sample report." },
  { id: 2, name: "documentation.pdf", content: "This is a sample documentation." },
  { id: 3, name: "analysis.pdf", content: "This is a sample analysis." },
]

export default function KnowledgeBase() {
  const [mode, setMode] = useState<'pdf' | 'code' | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [messages, setMessages] = useState<{ type: 'user' | 'bot', content: string }[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [githubLink, setGithubLink] = useState('')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [hasResponded, setHasResponded] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (inputMessage.trim()) {
      setMessages([...messages, { type: 'user', content: inputMessage }])
      setInputMessage('')
      setIsThinking(true)

      try {
        const response = await fetch(`http://localhost:5000/ask_${mode}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: inputMessage, context: selectedItem }),
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        setMessages(prevMessages => [...prevMessages, { type: 'bot', content: data.response }])
        setHasResponded(true)
      } catch (error) {
        console.error('Error:', error)
        setMessages(prevMessages => [...prevMessages, { type: 'bot', content: 'Sorry, there was an error processing your request.' }])
      } finally {
        setIsThinking(false)
      }
    }
  }

  const handleRedo = () => {
    setMessages([])
    setHasResponded(false)
    setInputMessage('')
  }

  const handleGithubLinkSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("GitHub Link submitted:", githubLink)
    setIsUploadModalOpen(false)
    setGithubLink('')
    // Here you would typically handle the GitHub link, e.g., clone the repository
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log("File uploaded:", file.name)
      setIsUploadModalOpen(false)
      // Here you would typically handle the file upload
    }
  }

  return (
    <div className="flex flex-col h-screen bg-purple-50 dark:bg-purple-900">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        {!mode ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4">
              <Card className="w-64 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-800" onClick={() => setMode('pdf')}>
                <CardHeader>
                  <CardTitle className="text-center text-purple-800 dark:text-purple-200">PDF Mode</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <FileText className="h-24 w-24 text-purple-600 dark:text-purple-300" />
                </CardContent>
              </Card>
              <Card className="w-64 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-800" onClick={() => setMode('code')}>
                <CardHeader>
                  <CardTitle className="text-center text-purple-800 dark:text-purple-200">Code Mode</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Code className="h-24 w-24 text-purple-600 dark:text-purple-300" />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <>
            <aside className="w-48 bg-purple-100 dark:bg-purple-800 p-3 overflow-y-auto">
              <h2 className="text-lg font-semibold mb-3 text-purple-800 dark:text-purple-200">
                {mode === 'code' ? 'Cloned Repositories' : 'PDF Files'}
              </h2>
              {(mode === 'code' ? mockRepositories : mockPDFs).map(item => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start mb-2 text-sm text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-700"
                  onClick={() => setSelectedItem(item)}
                >
                  {item.name}
                </Button>
              ))}
            </aside>
            <main className="flex-1 p-4 flex flex-col">
              {selectedItem && (
                <Card className="mb-4 bg-white dark:bg-purple-800">
                  <CardHeader>
                    <CardTitle className="text-purple-800 dark:text-purple-200">{selectedItem.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-purple-50 dark:bg-purple-900">
                      <pre className="text-sm text-purple-800 dark:text-purple-200 whitespace-pre-wrap">
                        {mode === 'code' ? selectedItem.readme : selectedItem.content}
                      </pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
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
                    </div>
                  ))}
                  {isThinking && (
                    <div className="p-2 rounded-lg bg-purple-200 dark:bg-purple-700 dark:text-purple-100 max-w-[80%] break-words text-sm">
                      Thinking...
                    </div>
                  )}
                </div>
              </ScrollArea>
              <footer className="border-t bg-purple-100 dark:bg-purple-800 p-2">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 bg-white dark:bg-purple-700 dark:text-purple-100"
                    disabled={hasResponded || isThinking}
                  />
                  {hasResponded ? (
                    <Button type="button" size="icon" className="h-10 bg-purple-600 hover:bg-purple-700" onClick={handleRedo}>
                      <RefreshCw className="h-4 w-4" />
                      <span className="sr-only">Redo</span>
                    </Button>
                  ) : (
                    <Button type="submit" size="icon" className="h-10 bg-purple-600 hover:bg-purple-700" disabled={isThinking}>
                      <CornerDownLeft className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  )}
                  <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                    <DialogTrigger asChild>
                      <Button size="icon" className="h-10 bg-purple-600 hover:bg-purple-700">
                        <Upload className="h-4 w-4" />
                        <span className="sr-only">Upload</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-purple-800">
                      <DialogHeader>
                        <DialogTitle className="text-purple-800 dark:text-purple-200">
                          {mode === 'code' ? 'Enter GitHub Link' : 'Upload PDF'}
                        </DialogTitle>
                        <DialogDescription className="text-purple-600 dark:text-purple-300">
                          {mode === 'code' ? 'Paste the GitHub repository link below.' : 'Select a PDF file to upload.'}
                        </DialogDescription>
                      </DialogHeader>
                      {mode === 'code' ? (
                        <form onSubmit={handleGithubLinkSubmit} className="space-y-4">
                          <Input
                            value={githubLink}
                            onChange={(e) => setGithubLink(e.target.value)}
                            placeholder="https://github.com/username/repo"
                            className="bg-purple-50 dark:bg-purple-700 text-purple-800 dark:text-purple-200"
                          />
                          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                            <Github className="mr-2 h-4 w-4" />
                            Submit
                          </Button>
                        </form>
                      ) : (
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="bg-purple-50 dark:bg-purple-700 text-purple-800 dark:text-purple-200"
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </form>
              </footer>
            </main>
          </>
        )}
      </div>
    </div>
  )
}