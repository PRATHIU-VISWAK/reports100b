import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { createServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const { userId } = auth()
  const supabase = createServerClient()
  
  // Get complaint stats
  const { data: stats, error } = await supabase
    .from('complaints')
    .select('status')
    .eq('user_id', userId)
  
  // Count complaints by status
  const counts = {
    total: stats?.length || 0,
    pending: stats?.filter(c => c.status === 'pending').length || 0,
    in_progress: stats?.filter(c => c.status === 'in_progress').length || 0,
    resolved: stats?.filter(c => c.status === 'resolved').length || 0,
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total Reports</CardTitle>
            <CardDescription>All your submitted reports</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{counts.total}</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/complaints">View All</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Pending</CardTitle>
            <CardDescription>Reports awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{counts.pending}</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/complaints?status=pending">View Pending</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">In Progress</CardTitle>
            <CardDescription>Reports being addressed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{counts.in_progress}</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/complaints?status=in_progress">View In Progress</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild className="w-full">
              <Link href="/complaints/new">Submit New Report</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/profile">Your Profile</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 