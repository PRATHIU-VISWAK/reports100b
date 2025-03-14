import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/animated-card"

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  
  // Get user session (middleware handles protection)
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return null // Middleware will handle redirect
  }
  
  // Dashboard stats
  const { count: totalComplaints } = await supabase
    .from("complaints")
    .select("*", { count: 'exact', head: true })
  
  const { count: pendingComplaints } = await supabase
    .from("complaints")
    .select("*", { count: 'exact', head: true })
    .eq("status", "pending")
  
  const { count: resolvedComplaints } = await supabase
    .from("complaints")
    .select("*", { count: 'exact', head: true })
    .eq("status", "resolved")
  
  // Get recent complaints
  const { data: recentComplaints } = await supabase
    .from("complaints")
    .select("*, profiles(name)")
    .order("created_at", { ascending: false })
    .limit(5)
  
  // Get complaint categories for statistics
  const { data: categoryStats } = await supabase
    .from("complaints")
    .select("category")
  
  const categoryCounts = categoryStats?.reduce((acc: Record<string, number>, complaint) => {
    acc[complaint.category] = (acc[complaint.category] || 0) + 1
    return acc
  }, {})
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/admin/users">Manage Users</Link>
          </Button>
          <form action="/api/auth/signout" method="post">
            <Button variant="outline" type="submit">Sign out</Button>
          </form>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-bold mb-2">Total Reports</h3>
          <p className="text-3xl font-bold">{totalComplaints}</p>
        </Card>
        
        <Card>
          <h3 className="text-lg font-bold mb-2">Pending</h3>
          <p className="text-3xl font-bold">{pendingComplaints}</p>
        </Card>
        
        <Card>
          <h3 className="text-lg font-bold mb-2">Resolved</h3>
          <p className="text-3xl font-bold">{resolvedComplaints}</p>
        </Card>
        
        <Card>
          <h3 className="text-lg font-bold mb-2">Resolution Rate</h3>
          <p className="text-3xl font-bold">
            {totalComplaints ? Math.round((resolvedComplaints! / totalComplaints!) * 100) : 0}%
          </p>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Recent Reports */}
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Reports</h2>
            <Button asChild>
              <Link href="/admin/complaints">View All</Link>
            </Button>
          </div>
          
          {recentComplaints && recentComplaints.length > 0 ? (
            <div className="space-y-4">
              {recentComplaints.map((complaint) => (
                <Card key={complaint.id}>
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold">{complaint.category}</h3>
                    <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium capitalize bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    Reported by {complaint.profiles?.name || "Anonymous"} on {new Date(complaint.created_at).toLocaleDateString()}
                  </p>
                  <p className="line-clamp-2 mb-4">{complaint.description}</p>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/complaints/${complaint.id}`}>View Details</Link>
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <p className="text-center text-neutral-500 dark:text-neutral-400 py-4">
                No reports have been submitted yet.
              </p>
            </Card>
          )}
        </div>
        
        {/* Category Stats */}
        <div className="w-full md:w-1/3">
          <h2 className="text-2xl font-bold mb-4">Categories</h2>
          <Card>
            <CardContent className="p-6">
              {categoryCounts && Object.keys(categoryCounts).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(categoryCounts)
                    .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
                    .map(([category, count]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span>{category}</span>
                        <div className="flex items-center">
                          <span className="mr-3">{count}</span>
                          <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ 
                                width: `${Math.round((count as number) / totalComplaints! * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No category data available.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}