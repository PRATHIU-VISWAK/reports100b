"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton, useUser } from "@clerk/nextjs"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

const routes = [
  {
    href: "/dashboard",
    label: "Dashboard",
    protected: true,
  },
  {
    href: "/complaints",
    label: "My Reports",
    protected: true,
  },
  {
    href: "/complaints/new",
    label: "Submit Report",
    protected: true,
  },
  {
    href: "/admin/dashboard",
    label: "Admin",
    admin: true,
  },
]

export function Navbar() {
  const pathname = usePathname()
  const { isSignedIn, user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const isAdmin = user?.publicMetadata?.role === "admin" || user?.publicMetadata?.role === "elite"

  const filteredRoutes = routes.filter(route => {
    if (!isSignedIn && route.protected) return false
    if (route.admin && !isAdmin) return false
    return true
  })

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">Booth Reports</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          {filteredRoutes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "default" : "ghost"}
              asChild
            >
              <Link href={route.href}>{route.label}</Link>
            </Button>
          ))}
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-4">
                {filteredRoutes.map((route) => (
                  <Button
                    key={route.href}
                    variant={pathname === route.href ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setIsOpen(false)}
                    asChild
                  >
                    <Link href={route.href}>{route.label}</Link>
                  </Button>
                ))}
                {isSignedIn ? (
                  <div className="flex items-center">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                ) : (
                  <Button asChild>
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
} 