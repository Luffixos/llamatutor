"use client"

import { Logo } from "./logo"
import { usePathname } from "next/navigation"
import Image from "next/image"

const Navbar = () => {
  const pathname = usePathname()
  const isInChat = pathname !== "/"

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-6">
        <a href="/" className="flex items-center">
          <Logo />
        </a>
        <div className="flex items-center gap-4">
          {isInChat && (
            <a
              href="/"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              New Chat
            </a>
          )}
          <a
            href="https://github.com/Nutlope/llamatutor"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-medium text-gray-700 transition-colors hover:text-gray-900 tracking-tight text-sm"
          >
            <Image unoptimized src="/github.svg" alt="github" width={16} height={16} />
            GitHub Repo
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
