"use client"

import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { isSignedIn } = useUser()

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="text-center space-y-8 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-white">
          Report and Track Community Issues
        </h1>
        
        <p className="text-xl text-gray-300">
          A simple and effective way to report neighborhood problems and track their resolution.
          From potholes to streetlights, we make it easy to keep your community maintained.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {isSignedIn ? (
            <>
              <Button size="lg" className="bg-white text-black hover:bg-gray-200" asChild>
                <Link href="/complaints/new">Submit a Report</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-gray-900" asChild>
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" className="bg-white text-black hover:bg-gray-200" asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-gray-900" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="p-6 bg-gray-900 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-white">Easy Reporting</h3>
            <p className="text-gray-300">Submit reports quickly with our simple form. Add photos and location details.</p>
          </div>
          <div className="p-6 bg-gray-900 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-white">Track Progress</h3>
            <p className="text-gray-300">Follow the status of your reports from submission to resolution.</p>
          </div>
          <div className="p-6 bg-gray-900 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-white">Stay Updated</h3>
            <p className="text-gray-300">Receive updates when your reports are reviewed and resolved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
