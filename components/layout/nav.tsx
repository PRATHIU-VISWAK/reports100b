"use client"

import { useState } from 'react'
import Link from 'next/link'
import { UserButton } from "@clerk/nextjs"
import { Menu, X, Home, FileText, Settings } from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Reports', href: '/complaints', icon: FileText },
  { name: 'Settings', href: '/profile', icon: Settings },
]

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-black border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-xl font-semibold text-white hover:text-gray-300 transition-colors"
            >
              BoothApp
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-gray-300 flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Profile and Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-full ring-2 ring-white/20"
                }
              }}
            />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-300 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-black border-b border-zinc-800">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-gray-300 flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
