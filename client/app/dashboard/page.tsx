"use client";

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Brain, Info, Loader2 } from 'lucide-react'
import Navbar from '@/components/ui/Navbar'
import { useToast } from "@/hooks/use-toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Mock email contents
const mockEmails = [
  {
    id: 1,
    subject: "Help with social media marketing",
    content: `Subject: Help with social media stuff
Dear sir/madam,
I hope this email finds you in good spirits. My name is Robert Johnson and I am the owner of Johnson's Hardware, a family-owned business that has been serving our community for over 50 years. I am writing to you today because I find myself in need of assistance with what the young folks call "social media marketing".
...
P.S. Do you know how to make the emails stop going into that spam folder? It's awfully inconvenient.`
  },
  {
    id: 2,
    subject: "Website redesign project",
    content: `Subject: Urgent: Website Redesign Needed
Hello,
I'm reaching out because our company's website is in desperate need of a redesign. We're a mid-sized tech startup, and our current site is outdated and doesn't reflect our innovative spirit. We need a modern, responsive design that works well on mobile devices and showcases our products effectively.
...
Looking forward to your proposal. Thanks!`
  },
  {
    id: 3,
    subject: "E-commerce integration",
    content: `Subject: Adding E-commerce to Our Site
Hi there,
We run a small boutique that specializes in handmade crafts, and we're looking to expand our business online. We need help integrating an e-commerce solution into our existing website. We want to be able to showcase our products, manage inventory, and process secure payments.
...
Can you help us make this transition to online sales? We're excited about the possibilities!`
  }
]

interface Task {
  id: number;
  description: string;
  priority: string;
  explanation: string;
}

interface Project {
  id: number;
  name: string;
  emailContent: string;
  tasks: Task[];
  isClassifying: boolean;
}

const priorityColors: { [key: string]: string } = {
  High: "bg-red-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>(mockEmails.map(email => ({
    id: email.id,
    name: email.subject,
    emailContent: email.content,
    tasks: [],
    isClassifying: false
  })))
  const [openProjects, setOpenProjects] = useState<number[]>([])
  const { toast } = useToast()

  const toggleProject = (projectId: number) => {
    setOpenProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }

  const handleClassifyTasks = async (projectId: number) => {
    setProjects(prevProjects => 
      prevProjects.map(p => 
        p.id === projectId 
          ? { ...p, isClassifying: true }
          : p
      )
    )

    toast({
      title: "AI Task Classification",
      description: "Analyzing email and classifying tasks...",
    })

    const project = projects.find(p => p.id === projectId)
    if (!project) return

    try {
      const response = await fetch('https://darling-flea-unbiased.ngrok-free.app/classify_tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_content: project.emailContent }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()

      setProjects(prevProjects => 
        prevProjects.map(p => 
          p.id === projectId 
            ? { ...p, tasks: data.tasks, isClassifying: false }
            : p
        )
      )

      toast({
        title: "Task Classification Complete",
        description: "Tasks have been classified for the project.",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to classify tasks. Please try again.",
        variant: "destructive",
      })
      setProjects(prevProjects => 
        prevProjects.map(p => 
          p.id === projectId 
            ? { ...p, isClassifying: false }
            : p
        )
      )
    }
  }

  return (
    <div className="min-h-screen bg-purple-50 dark:bg-purple-900">
      <Navbar />
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-purple-800 dark:text-purple-200">Current Projects and Tasks</h1>
        <div className="space-y-6">
          {projects.map((project) => (
            <Card key={project.id} className="w-full bg-white dark:bg-purple-800">
              <CardHeader>
                <CardTitle className="flex justify-between items-center text-purple-800 dark:text-purple-200">
                  <span>{project.name}</span>
                  <Button 
                    onClick={() => handleClassifyTasks(project.id)}
                    className="bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
                    disabled={project.isClassifying}
                  >
                    {project.isClassifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Classifying...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Classify Tasks with AI
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Collapsible open={openProjects.includes(project.id)} onOpenChange={() => toggleProject(project.id)}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-700 dark:text-purple-200 dark:hover:bg-purple-600">
                      {openProjects.includes(project.id) ? (
                        <>
                          Hide Tasks
                          <ChevronUp className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Show Tasks
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-4">
                    {project.isClassifying ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-300" />
                        <span className="ml-2 text-purple-600 dark:text-purple-300">Classifying tasks...</span>
                      </div>
                    ) : project.tasks.length > 0 ? (
                      project.tasks.map((task) => (
                        <div key={task.id} className="p-4 bg-purple-100 dark:bg-purple-700 rounded-lg flex justify-between items-center">
                          <div className="flex-grow">
                            <h3 className="font-semibold mb-2 text-purple-800 dark:text-purple-200">{task.description}</h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${priorityColors[task.priority]} text-white`}>
                              {task.priority}
                            </Badge>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" className="p-0">
                                    <Info className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{task.explanation}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-purple-600 dark:text-purple-300">No tasks classified yet. Click "Classify Tasks with AI" to get started.</p>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}