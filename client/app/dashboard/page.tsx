"use client";
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, DollarSign, Calendar } from 'lucide-react'

// Mock data for projects and tasks
const projects = [
  {
    id: 1,
    name: "E-commerce Website Redesign",
    priority: "High",
    pay: 5000,
    tasks: [
      { id: 1, name: "Homepage redesign", deadline: "2023-07-15", priority: "High" },
      { id: 2, name: "Product page optimization", deadline: "2023-07-20", priority: "Medium" },
      { id: 3, name: "Checkout process improvement", deadline: "2023-07-25", priority: "High" },
    ]
  },
  {
    id: 2,
    name: "Mobile App Development",
    priority: "Medium",
    pay: 8000,
    tasks: [
      { id: 1, name: "UI/UX Design", deadline: "2023-08-01", priority: "High" },
      { id: 2, name: "Frontend Development", deadline: "2023-08-15", priority: "High" },
      { id: 3, name: "Backend Integration", deadline: "2023-08-30", priority: "Medium" },
    ]
  },
  {
    id: 3,
    name: "Content Marketing Campaign",
    priority: "Low",
    pay: 3000,
    tasks: [
      { id: 1, name: "Content Strategy", deadline: "2023-07-10", priority: "Medium" },
      { id: 2, name: "Blog Post Writing", deadline: "2023-07-20", priority: "Low" },
      { id: 3, name: "Social Media Schedule", deadline: "2023-07-25", priority: "Low" },
    ]
  },
]

const priorityColors: { [key: string]: string } = {
  High: "bg-red-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
}

export default function Dashboard(): React.JSX.Element {
  const [openProject, setOpenProject] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Freelancer Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="w-full">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{project.name}</span>
                <Badge className={`${priorityColors[project.priority]} text-white`}>
                  {project.priority}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <DollarSign className="mr-2 h-4 w-4" />
                <span className="font-semibold">${project.pay}</span>
              </div>
              <Collapsible
                open={openProject === project.id}
                onOpenChange={() => setOpenProject(openProject === project.id ? null : project.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full">
                    {openProject === project.id ? (
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
                <CollapsibleContent className="mt-4">
                  {project.tasks.map((task) => (
                    <div key={task.id} className="mb-4 p-4 bg-white rounded-lg shadow">
                      <h3 className="font-semibold mb-2">{task.name}</h3>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span className="text-sm">{task.deadline}</span>
                        </div>
                        <Badge className={`${priorityColors[task.priority]} text-white`}>
                          {task.priority}
                        </Badge>
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
  )
}