"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import Navbar from '@/components/ui/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Mail, ChevronDown, ChevronUp, Loader2 } from "lucide-react"

const initialOrders = [
  {
    id: 1,
    client: "Dave",
    subject: "Website help needed ASAP!!!",
    content: `Hey there,
So like I was talking to my friend Jake the other day (he's got this awesome pet grooming business btw) and he mentioned you did some work on his website? Anyway, I've got this online store that sells vintage vinyl records and music memorabilia and stuff, and tbh the website is kind of a mess right now. It's like from the stone age or something lol.
I was thinking maybe you could take a look and see if you can spruce it up a bit? Make it look all fancy and modern and whatever. Oh, and it would be great if people could like, I don't know, search for stuff easier? Right now it's kind of a pain to find anything specific.
Also, I've been hearing a lot about this SEO thing. Can we get some of that? I want my site to show up when people Google "awesome vinyl records" or "rare Beatles memorabilia" or something like that.
Let me know if you need anything else from me. I'm usually pretty busy during the day but feel free to call me anytime after 6pm or on weekends.
Thanks a bunch!
Dave
VinylVault.com`,
    summary: "",
    isSummarizing: false,
  },
  {
    id: 2,
    client: "Sarah",
    subject: "need a logo for my new business",
    content: `        Hi,
        My name is Sarah and I'm starting a new business. It's going to be a combination coffee shop and bookstore, cause I love books and coffee lol. Anyway, I need a logo for it and my cousin said you're really good at design stuff.
        I want something that looks professional but also kind of cozy and inviting, you know? Like maybe with a coffee cup and a book, but not too obvious. And I was thinking maybe we could use brown and green colors, but I'm not sure. What do you think?
        Oh, and the name of the shop is going to be "The Bookworm's Brew" ... or maybe "Chapters & Chai" ... actually I haven't really decided yet. Could you maybe come up with a few options for both names?
        I don't know how much this usually costs, but I'm just starting out so I can't spend too much. Is $50 enough? If not, let me know.
        I kind of need this pretty quick because I want to order some signage and business cards. Do you think you could have something for me to look at by the end of the week?
        Thanks so much!!!
        Sarah
        P.S. Do you also do website design? I might need help with that too but I'm not sure yet.`,
    summary: "",
    isSummarizing: false,
  },
  {
    id: 3,
    client: "Robert Johnson",
    subject: "Help with social media stuff",
    content: `Dear sir/madam,
I hope this email finds you in good spirits. My name is Robert Johnson and I am the owner of Johnson's Hardware, a family-owned business that has been serving our community for over 50 years. I am writing to you today because I find myself in need of assistance with what the young folks call "social media marketing".
You see, my grandson Tommy (he's 14 now, can you believe it?) was telling me over Sunday dinner that we need to get with the times and start promoting our business on the Facebook and the Twitter and what have you. I must admit, I'm a bit out of my depth with all this newfangled technology, but I trust Tommy's judgement. He's always fiddling with that smartphone of his, so he must know a thing or two about this stuff.
I was wondering if you could help us set up some of these social media accounts and maybe show us how to use them properly. I've heard that you can reach a lot of people through these platforms, and goodness knows we could use some more customers, what with that big box store that opened up on the edge of town last year.
Now, I'm not entirely sure what all is involved in this social media business, but I was thinking maybe we could post pictures of some of our products? Or perhaps share some DIY tips? I remember my father always used to say that if you help people, they'll remember you when they need something. Do you think that would work on the internet too?
Oh, and one more thing - my wife Martha suggested we might need something called a "hashtag". Do you know anything about those?
I look forward to hearing back from you at your earliest convenience. If you need to reach me, you can call the store during business hours (8am-6pm, Monday to Saturday), or send me an email. Tommy set up this email account for me, but I must admit I'm still getting the hang of it, so please be patient if I don't respond right away.
Thank you kindly for your time and consideration.
Yours sincerely,
Robert Johnson
Owner, Johnson's Hardware
"If we don't have it, you don't need it!"
P.S. Do you know how to make the emails stop going into that spam folder? It's awfully inconvenient.`,
    summary: "",
    isSummarizing: false,
  },
]

export default function Component() {
  const [isConnected, setIsConnected] = useState(false)
  const [selectedMailingList, setSelectedMailingList] = useState<string | null>(null)
  console.log(selectedMailingList);
  const [orders, setOrders] = useState(initialOrders)
  const [selectedOrder, setSelectedOrder] = useState<null | (typeof initialOrders)[0]>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false)
  const [acceptanceMessage, setAcceptanceMessage] = useState("")
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false)
  const { toast } = useToast()

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

  const handleAccept = async () => {
    if (selectedOrder) {
      setIsGeneratingResponse(true)
      setAcceptanceMessage("Generating Acceptance...")
      setIsModalOpen(true)

      try {
        const response = await fetch('https://darling-flea-unbiased.ngrok-free.app/generate_acceptance_response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email_content: `Subject: ${selectedOrder.subject}\n\n${selectedOrder.content}`
          }),
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        setAcceptanceMessage(data.response)
      } catch (error) {
        console.error('Error:', error)
        toast({
          title: "Error",
          description: "Failed to generate acceptance response. Please try again.",
          variant: "destructive",
        })
        setAcceptanceMessage("Failed to generate acceptance response. Please try again.")
      } finally {
        setIsGeneratingResponse(false)
      }
    }
  }

  const handleNegotiate = async () => {
    if (selectedOrder) {
      setIsGeneratingResponse(true)
      setAcceptanceMessage("Generating Negotiation...")
      setIsModalOpen(true)

      try {
        const response = await fetch('https://darling-flea-unbiased.ngrok-free.app/generate_negotiation_response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email_content: `Subject: ${selectedOrder.subject}\n\n${selectedOrder.content}`
          }),
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        setAcceptanceMessage(data.response)
      } catch (error) {
        console.error('Error:', error)
        toast({
          title: "Error",
          description: "Failed to generate negotiation response. Please try again.",
          variant: "destructive",
        })
        setAcceptanceMessage("Failed to generate negotiation response. Please try again.")
      } finally {
        setIsGeneratingResponse(false)
      }
    }
  }

  const handleSummarize = async (orderId: number) => {
    const order = orders.find(o => o.id === orderId)
    if (!order) return

    setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? { ...o, isSummarizing: true } : o))

    try {
      const response = await fetch('https://darling-flea-unbiased.ngrok-free.app/request_summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_content: `Subject: ${order.subject}\n\n${order.content}` }),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()

      setOrders(prevOrders => prevOrders.map(o => 
        o.id === orderId ? { ...o, summary: data.summary, isSummarizing: false } : o
      ))

      toast({
        title: "Summary Generated",
        description: "The order has been summarized successfully.",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      })
      setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? { ...o, isSummarizing: false } : o))
    }
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
                        {order.summary && (
                          <div className="bg-purple-100 dark:bg-purple-700 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold mb-2 text-purple-800 dark:text-purple-200">Summary:</h3>
                            <p className="text-sm text-purple-600 dark:text-purple-300">{order.summary}</p>
                          </div>
                        )}
                        <p className="text-sm text-purple-600 dark:text-purple-300">{order.content}</p>
                        <div className="flex justify-end space-x-2">
                          <Button onClick={() => handleRespond(order)} className="bg-purple-600 hover:bg-purple-700 text-white">
                            Respond
                          </Button>
                          <Button 
                            onClick={() => handleSummarize(order.id)} 
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                            disabled={order.isSummarizing}
                          >
                            {order.isSummarizing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Summarizing...
                              </>
                            ) : (
                              <>
                                <Brain className="mr-2 h-4 w-4" />
                                Summarize
                              </>
                            )}
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
              <Button onClick={handleAccept} className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={isGeneratingResponse}>
                {isGeneratingResponse ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Accept
              </Button>
              <Button onClick={handleNegotiate} className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={isGeneratingResponse}>
                {isGeneratingResponse ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Negotiate
              </Button>
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
              disabled={isGeneratingResponse}
            />
            <DialogFooter>
              <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700 text-white" disabled={isGeneratingResponse}>
                Send Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Toaster />
      </div>
    </div>
  )
}