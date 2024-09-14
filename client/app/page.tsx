import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mountain, CheckCircle } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/dashboard">
          <Mountain className="h-6 w-6" />
          <span className="sr-only">Moriatz</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="pt-2 text-sm font-medium hover:underline underline-offset-4" href="/order">
            Orders
          </Link>
          <Link className="pt-2 text-sm font-medium hover:underline underline-offset-4" href="/kb">
            Knowledge Base
          </Link>
          <Link className="pt-2 text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Moriatz
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Empowering freelancers to 10x their productivity using AI. Get started today and make your clients happy. Quicker, faster - it's almost criminal.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/dashboard">
                  <Button>Get Started</Button>
                </Link>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Moriatz. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}