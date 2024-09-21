"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import Navbar from '@/components/ui/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Mail, ChevronDown, ChevronUp } from "lucide-react"

const initialOrders = [
  {
    id: 1,
    client: "TechCorp",
    subject: "Website Redesign Project Proposal",
    content: "Dear Freelancer,\n\nWe are reaching out to discuss a potential website redesign project for TechCorp. We are looking for a modern, responsive website that emphasizes user experience and mobile optimization.\n\nKey points:\n- Use of our brand colors\n- Integration with our CMS\n- Implementation of a blog section\n\nWe're excited about this project and hope to launch by mid-August. Our budget for this project is $5000.\n\nPlease let us know if you're interested and available to take on this project.\n\nBest regards,\nTechCorp Team",
    amount: 5000,
    deadline: "2023-08-15",
  },
  {
    id: 2,
    client: "GreenEnergy",
    subject: "Mobile App Development for Energy Tracking",
    content: "Hello,\n\nGreenEnergy is seeking a developer for an innovative mobile app to help users track their energy consumption. We need both iOS and Android versions.\n\nApp features:\n- Real-time energy usage monitoring\n- Tips for energy saving\n- Integration with smart home devices\n\nWe're aiming for a September launch to coincide with our new marketing campaign. The budget for this project is $8000.\n\nPlease confirm if you're interested in this project.\n\nRegards,\nGreenEnergy Team",
    amount: 8000,
    deadline: "2023-09-30",
  },
  {
    id: 3,
    client: "FashionBrand",
    subject: "E-commerce Platform Development",
    content: "Hi there,\n\nFashionBrand is looking for a developer to create a sleek, high-performance e-commerce platform. We're emphasizing fast load times, an intuitive shopping experience, and robust inventory management.\n\nKey features:\n- Virtual try-on feature using AR\n- Loyalty program integration\n- Seamless mobile shopping experience\n\nWe're looking to soft launch by early October to prepare for the holiday shopping season. Our budget for this project is $6500.\n\nLet us know if you're available to take on this exciting project!\n\nBest,\nFashionBrand Team",
    amount: 6500,
    deadline: "2023-10-15",
  },
]

export default function Component() {
  const [isConnected, setIsConnected] = useState(false)
  const [selectedMailingList, setSelectedMailingList] = useState<string | null>(null)
  const [orders, setOrders] = useState(initialOrders)
  const [selectedOrder, setSelectedOrder] = useState<null | (typeof initialOrders)[0]>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false)
  const [acceptanceMessage, setAcceptanceMessage] = useState("")
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)
  const { toast } = useToast()
  console.log(selectedMailingList)
  const handleConnect = (mailingList: string) => {
    setSelectedMailingList(mailingList)
    setIsConnected(true)
    toast({
      title: `Connected to ${mailingList}`,
      description: "Your orders have been loaded.",
    })
  }

  const handleRespond = (order: (typeof initialOrders)[0]) => {
    setSelectedOrder(order)
    setIsRespondModalOpen(true)
  }

  const handleAccept = () => {
    if (selectedOrder) {
      setAcceptanceMessage(`Dear ${selectedOrder.client},\n\nI am pleased to accept your order for the "${selectedOrder.subject}" project. I have reviewed the details and I'm excited to get started. I'll make sure to focus on the key points you've mentioned.\n\nI look forward to delivering excellent results by ${selectedOrder.deadline}.\n\nBest regards,\n[Your Name]`)
      setIsModalOpen(true)
    }
  }

  const handleNegotiate = () => {
    if (selectedOrder) {
      setAcceptanceMessage(`Dear ${selectedOrder.client},\n\nThank you for your order for the "${selectedOrder.subject}" project. I've reviewed the details and I'm interested in working with you. However, I'd like to discuss a few points to ensure we're aligned on the project scope and timeline.\n\nCan we schedule a call to go over the following:\n\n1. [Point to negotiate]\n2. [Point to negotiate]\n3. [Point to negotiate]\n\nI'm confident we can find a mutually beneficial arrangement. Please let me know your availability for a brief discussion.\n\nBest regards,\n[Your Name]`)
      setIsModalOpen(true)
    }
  }

  const handleSummarize = (order: (typeof initialOrders)[0]) => {
    toast({
      title: "AI Summary",
      description: "Generating summary...",
    })
    // Simulate AI summarization
    setTimeout(() => {
      toast({
        title: "AI Summary",
        description: `${order.client} wants a ${order.subject.toLowerCase()} by ${order.deadline}. Budget: $${order.amount}. Key focus: ${order.content.split('\n')[3]}`,
      })
    }, 2000)
  }

  const handleSendMessage = () => {
    setOrders(orders.filter(order => selectedOrder && order.id !== selectedOrder.id))
    setIsModalOpen(false)
    setIsRespondModalOpen(false)
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the client.",
    })
  }

  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  return (
    <div className="flex flex-col min-h-screen bg-purple-50 dark:bg-purple-900">
      <Navbar />
      <div className="container mx-auto py-10 px-4 flex-1 flex flex-col items-center">
        {!isConnected ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-5 text-purple-800 dark:text-purple-200">Connect to Your Mailing List</h1>
            <div className="space-y-4">
              <Button onClick={() => handleConnect('Gmail')} className="w-full max-w-xs bg-purple-600 hover:bg-purple-700 text-white">
                <Mail className="mr-2 h-4 w-4" />
                Connect to Gmail
              </Button>
              <Button onClick={() => handleConnect('Outlook')} className="w-full max-w-xs bg-purple-600 hover:bg-purple-700 text-white">
                <Mail className="mr-2 h-4 w-4" />
                Connect to Outlook
              </Button>
              <Button onClick={() => handleConnect('Yahoo')} className="w-full max-w-xs bg-purple-600 hover:bg-purple-700 text-white">
                <Mail className="mr-2 h-4 w-4" />
                Connect to Yahoo
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-5 text-purple-800 dark:text-purple-200">Current Orders</h1>
            <div className="w-full max-w-3xl space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="w-full bg-white dark:bg-purple-800">
                  <CardHeader className="cursor-pointer" onClick={() => toggleOrderExpansion(order.id)}>
                    <CardTitle className="flex justify-between items-center text-purple-800 dark:text-purple-200">
                      <span>{order.subject}</span>
                      {expandedOrder === order.id ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                    </CardTitle>
                  </CardHeader>
                  {expandedOrder === order.id && (
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-purple-600 dark:text-purple-300">{order.content}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-purple-600 dark:text-purple-300">Budget: ${order.amount}</span>
                          <span className="text-sm font-medium text-purple-600 dark:text-purple-300">Deadline: {order.deadline}</span>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button onClick={() => handleRespond(order)} className="bg-purple-600 hover:bg-purple-700 text-white">
                            Respond
                          </Button>
                          <Button onClick={() => handleSummarize(order)} className="bg-purple-600 hover:bg-purple-700 text-white">
                            <Brain className="mr-2 h-4 w-4" />
                            Summarize
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}
        <Dialog open={isRespondModalOpen} onOpenChange={setIsRespondModalOpen}>
          <DialogContent className="bg-white dark:bg-purple-800">
            <DialogHeader>
              <DialogTitle className="text-purple-800 dark:text-purple-200">Respond to Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Button onClick={handleAccept} className="w-full bg-purple-600 hover:bg-purple-700 text-white">Accept</Button>
              <Button onClick={handleNegotiate} className="w-full bg-purple-600 hover:bg-purple-700 text-white">Negotiate</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-white dark:bg-purple-800">
            <DialogHeader>
              <DialogTitle className="text-purple-800 dark:text-purple-200">Your Message</DialogTitle>
            </DialogHeader>
            <Textarea
              value={acceptanceMessage}
              onChange={(e) => setAcceptanceMessage(e.target.value)}
              rows={10}
              className="bg-purple-50 dark:bg-purple-700 text-purple-800 dark:text-purple-200"
            />
            <DialogFooter>
              <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700 text-white">Send Message</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Toaster />
      </div>
    </div>
  )
}