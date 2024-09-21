import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/ui/Navbar"
import { Brain } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-purple-50 dark:bg-purple-900">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <Brain className="h-16 w-16 text-purple-600 dark:text-purple-300" />
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-purple-800 dark:text-purple-200">
                  Welcome to GigStone AI
                </h1>
                <p className="mx-auto max-w-[700px] text-purple-600 md:text-xl dark:text-purple-300">
                  Empowering freelancers with AI-driven productivity. Get started today and delight your clients with faster, smarter work.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/dashboard">
                  <Button className="bg-purple-600 text-white hover:bg-purple-700">Get Started</Button>
                </Link>
                <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-800">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-purple-200 dark:border-purple-700">
        <p className="text-xs text-purple-600 dark:text-purple-300">
          © 2024 GigStone AI. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs text-purple-600 hover:underline underline-offset-4 dark:text-purple-300" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs text-purple-600 hover:underline underline-offset-4 dark:text-purple-300" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}