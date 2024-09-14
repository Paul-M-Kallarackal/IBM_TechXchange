// app/components/Navbar.tsx

import Link from "next/link";
import { Mountain } from "lucide-react";

export default function Navbar() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link className="flex items-center justify-center" href="/">
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
  );
}
