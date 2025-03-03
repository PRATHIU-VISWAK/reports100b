import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default async function ComplaintsPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const supabase = await createServerClient()

  // Get user's complaints
  const { data: complaints } = await supabase
    .from("complaints")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">My Reports</h1>
        <Button asChild>
          <Link href="/complaints/new">New Report</Link>
        </Button>
      </div>

      {/* Filter and sort controls can be added here */}
      
      {complaints && complaints.length > 0 ? (
        <div className="grid gap-4">
          {complaints.map((complaint) => (
            <Card key={complaint.id}>
              <CardHeader>
                <CardTitle>{complaint.category}</CardTitle>
                <CardDescription>
                  Reported on {new Date(complaint.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-2">{complaint.description}</p>
                <p className="text-sm font-medium">
                  Status: <span className="capitalize">{complaint.status}</span>
                </p>
                <div className="mt-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/complaints/${complaint.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              No complaints submitted yet
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 