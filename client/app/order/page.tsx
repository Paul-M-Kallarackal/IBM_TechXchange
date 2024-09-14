'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

// Mock data for offers
const initialOffers = [
  { id: 1, client: "TechCorp", project: "Website Redesign", amount: 5000, deadline: "2023-08-15" },
  { id: 2, client: "GreenEnergy", project: "Mobile App Development", amount: 8000, deadline: "2023-09-30" },
  { id: 3, client: "FashionBrand", project: "E-commerce Platform", amount: 6500, deadline: "2023-10-15" },
]

export default function OffersPage() {
  const [offers, setOffers] = useState(initialOffers)
  const [selectedOffer, setSelectedOffer] = useState<null | { id: number; client: string; project: string; amount: number; deadline: string; }>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [acceptanceMessage, setAcceptanceMessage] = useState("")
  const { toast } = useToast()

  const handleAccept = (offer: { id: number; client: string; project: string; amount: number; deadline: string; }) => {
    setSelectedOffer(null)
    setAcceptanceMessage(`Dear ${offer.client},\n\nI am pleased to accept your offer for the "${offer.project}" project. I look forward to working with you and delivering excellent results.\n\nBest regards,\n[Your Name]`)
    setIsModalOpen(true)
  }

  const handleDecline = (offerId: number) => {
    setOffers(offers.filter(offer => offer.id !== offerId))
    toast({
      title: "Offer Declined",
      description: "The offer has been removed from your list.",
    })
  }

  const handleSendAcceptance = () => {
    // Here you would typically send the acceptance message to the client
    // For now, we'll just close the modal and remove the offer from the list
    setOffers(offers.filter(offer => selectedOffer && offer.id !== selectedOffer.id))
    setIsModalOpen(false)
    toast({
      title: "Offer Accepted",
      description: "Your acceptance message has been sent.",
    })
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Current Offers</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers.map((offer) => (
            <TableRow key={offer.id}>
              <TableCell>{offer.client}</TableCell>
              <TableCell>{offer.project}</TableCell>
              <TableCell>${offer.amount}</TableCell>
              <TableCell>{offer.deadline}</TableCell>
              <TableCell>
                <Button onClick={() => handleAccept(offer)} className="mr-2">Accept</Button>
                <Button variant="destructive" onClick={() => handleDecline(offer.id)}>Decline</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  <DialogContent className="bg-white">
    <DialogHeader>
      <DialogTitle>Accept Offer</DialogTitle>
    </DialogHeader>
    <Textarea
      value={acceptanceMessage}
      onChange={(e) => setAcceptanceMessage(e.target.value)}
      rows={10}
    />
    <DialogFooter>
      <Button onClick={handleSendAcceptance}>Send Acceptance</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      <Toaster />
    </div>
  )
}