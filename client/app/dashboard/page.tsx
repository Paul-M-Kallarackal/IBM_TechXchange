"use client";

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, DollarSign, Calendar, Brain } from 'lucide-react'
import Navbar from '@/components/ui/Navbar'
import { useToast } from "@/hooks/use-toast"

// Mock data for projects and tasks
const initialProjects = [
  {
    id: 1,
    name: "E-commerce Website Redesign",
    priority: "",
    pay: 5000,
    tasks: [
      { id: 1, name: "Homepage redesign", deadline: "2023-07-15", priority: "" },
      { id: 2, name: "Product page optimization", deadline: "2023-07-20", priority: "" },
      { id: 3, name: "Checkout process improvement", deadline: "2023-07-25", priority: "" },
    ]
  },
  {
    id: 2,
    name: "Mobile App Development",
    priority: "",
    pay: 8000,
    tasks: [
      { id: 1, name: "UI/UX Design", deadline: "2023-08-01", priority: "" },
      { id: 2, name: "Frontend Development", deadline: "2023-08-15", priority: "" },
      { id: 3, name: "Backend Integration", deadline: "2023-08-30", priority: "" },
    ]
  },
  {
    id: 3,
    name: "Content Marketing Campaign",
    priority: "",
    pay: 3000,
    tasks: [
      { id: 1, name: "Content Strategy", deadline: "2023-07-10", priority: "" },
      { id: 2, name: "Blog Post Writing", deadline: "2023-07-20", priority: "" },
      { id: 3, name: "Social Media Schedule", deadline: "2023-07-25", priority: "" },
    ]
  },
]

const priorityColors: { [key: string]: string } = {
  High: "bg-red-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
}

export default function Dashboard() {
  const [projects, setProjects] = useState(initialProjects)
  const [openProjects, setOpenProjects] = useState<number[]>([])
  const { toast } = useToast()

  const toggleProject = (projectId: number) => {
    setOpenProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }

  const handlePrioritize = async (projectId: number) => {
    toast({
      title: "AI Prioritization",
      description: "Analyzing project and assigning priorities...",
    })

    const project = projects.find(p => p.id === projectId)
    if (!project) return

    const payload = {
      [project.name]: Object.fromEntries(project.tasks.map(task => [task.name, task.name]))
    }

    try {
      const response = await fetch('http://localhost:5000/classify_priority', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()

      setProjects(prevProjects => 
        prevProjects.map(p => {
          if (p.id === projectId) {
            return {
              ...p,
              priority: data.project_priority,
              tasks: p.tasks.map(task => ({
                ...task,
                priority: data[task.name]
              }))
            }
          }
          return p
        })
      )

      toast({
        title: "AI Prioritization Complete",
        description: "Project and tasks have been prioritized.",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to prioritize project. Please try again.",
        variant: "destructive",
      })
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
                  {project.priority && (
                    <Badge className={`${priorityColors[project.priority]} text-white`}>
                      {project.priority}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <DollarSign className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-300" />
                  <span className="font-semibold text-purple-800 dark:text-purple-200">${project.pay}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <Collapsible open={openProjects.includes(project.id)} onOpenChange={() => toggleProject(project.id)}>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-700 dark:text-purple-200 dark:hover:bg-purple-600">
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
                  </Collapsible>
                  <Button 
                    onClick={() => handlePrioritize(project.id)}
                    className="bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    Prioritize with AI
                  </Button>
                </div>
                <Collapsible open={openProjects.includes(project.id)}>
                  <CollapsibleContent className="mt-4 space-y-4">
                    {project.tasks.map((task) => (
                      <div key={task.id} className="p-4 bg-purple-100 dark:bg-purple-700 rounded-lg">
                        <h3 className="font-semibold mb-2 text-purple-800 dark:text-purple-200">{task.name}</h3>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-300" />
                            <span className="text-sm text-purple-600 dark:text-purple-300">{task.deadline}</span>
                          </div>
                          {task.priority && (
                            <Badge className={`${priorityColors[task.priority]} text-white`}>
                              {task.priority}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
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