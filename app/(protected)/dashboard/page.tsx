import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { createServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/animated-card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default async function DashboardPage() {
  const { userId } = await auth()
  const supabase = await createServerClient()

  try {
    const { data: complaints, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Error details:', error)
      throw error
    }

    const counts = {
      total: complaints?.length ?? 0,
      pending: complaints?.filter(c => c.status === 'pending').length ?? 0,
      in_progress: complaints?.filter(c => c.status === 'in_progress').length ?? 0,
      resolved: complaints?.filter(c => c.status === 'resolved').length ?? 0
    }

    return (
      <div className="container max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Your Dashboard</h1>
          <Button asChild size="lg">
            <Link href="/complaints/new">New Report</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold mb-2">Total Reports</h3>
            <p className="text-sm text-muted-foreground mb-4">All your submitted reports</p>
            <p className="text-5xl font-bold mb-4">{counts.total}</p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/complaints">View All</Link>
            </Button>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold mb-2 text-amber-600">Pending</h3>
            <p className="text-sm text-muted-foreground mb-4">Reports awaiting review</p>
            <p className="text-5xl font-bold mb-4 text-amber-600">{counts.pending}</p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/complaints?status=pending">View Pending</Link>
            </Button>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold mb-2 text-blue-600">In Progress</h3>
            <p className="text-sm text-muted-foreground mb-4">Reports being addressed</p>
            <p className="text-5xl font-bold mb-4 text-blue-600">{counts.in_progress}</p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/complaints?status=in_progress">View In Progress</Link>
            </Button>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
            <div className="flex flex-col gap-4">
              <Button asChild size="lg" className="w-full">
                <Link href="/complaints/new">Submit New Report</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/profile">Manage Profile</Link>
              </Button>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
            {counts.total > 0 ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">Recently reported issues will appear here.</p>
                <Button asChild variant="link" className="p-0">
                  <Link href="/complaints">View your complete history →</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-6">Ready to submit your first report?</p>
                <Button asChild size="lg">
                  <Link href="/complaints/new">Get Started</Link>
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    )
  } catch (err) {
    console.error('Failed to fetch complaints:', err)
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load dashboard data. Please try refreshing the page or contact support if the problem persists.
          </AlertDescription>
        </Alert>
      </div>
    )
  }
}