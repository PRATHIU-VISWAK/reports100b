import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { createServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/animated-card"

export default async function DashboardPage() {
  const { userId } = await auth()
  const supabase = await createServerClient()

  try {
    // Get complaint stats with better filtering
    const { data: complaints, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Error details:', error)
      throw error
    }

    // Calculate counts from valid data
    const counts = {
      total: complaints?.length ?? 0,
      pending: complaints?.filter(c => c.status === 'pending').length ?? 0,
      in_progress: complaints?.filter(c => c.status === 'in_progress').length ?? 0,
      resolved: complaints?.filter(c => c.status === 'resolved').length ?? 0
    }

    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card>
            <h3 className="text-xl font-bold mb-1">Total Reports</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">All your submitted reports</p>
            <p className="text-4xl font-bold mb-4">{counts.total}</p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/complaints">View All</Link>
            </Button>
          </Card>
          
          <Card>
            <h3 className="text-xl font-bold mb-1">Pending</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">Reports awaiting review</p>
            <p className="text-4xl font-bold mb-4">{counts.pending}</p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/complaints?status=pending">View Pending</Link>
            </Button>
          </Card>
          
          <Card>
            <h3 className="text-xl font-bold mb-1">In Progress</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">Reports being addressed</p>
            <p className="text-4xl font-bold mb-4">{counts.in_progress}</p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/complaints?status=in_progress">View In Progress</Link>
            </Button>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-4">
              <Button asChild className="w-full">
                <Link href="/complaints/new">Submit New Report</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/profile">Your Profile</Link>
              </Button>
            </div>
          </Card>
          
          <Card>
            <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
            {counts.total > 0 ? (
              <div className="text-sm">
                <p className="mb-2">Recently reported issues will appear here.</p>
                <Link href="/complaints" className="text-primary hover:underline">
                  View your complete history
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You have not submitted any reports yet.</p>
                <Button asChild>
                  <Link href="/complaints/new">Submit Your First Report</Link>
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
        <div className="text-red-500">
          Failed to load dashboard data. Please try again later.
        </div>
      </div>
    )
  }
}