import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

interface Profile {
  name: string;
  role: string;
}

interface Response {
  id: string;
  created_at: string;
  message: string;
  profiles?: Profile;
}

interface Complaint {
  id: string;
  created_at: string;
  description: string;
  location: string;
  status: string;
  user_id: string;
  responses: Response[];
  category: string;
}
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ComplaintDetailPage({
  params
}: {
  params: { id: string }
}) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const supabase = await createClient()

  // Get complaint details
  const { data: complaint } = await supabase
    .from("complaints")
    .select(`
      *,
      responses (
        *,
        profiles (
          name,
          role
        )
      )
    `)
    .eq("id", params.id)
    .eq("user_id", userId)
    .single()

  if (!complaint) {
    redirect("/complaints")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/complaints">Back to Reports</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{complaint.category}</CardTitle>
          <CardDescription>
            Reported on {new Date(complaint.created_at).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p>{complaint.description}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Location</h3>
            <p>{complaint.location}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Status</h3>
            <p className="capitalize">{complaint.status}</p>
          </div>

          <div>
            <h3 className="font-medium mb-4">Response History</h3>
            {complaint.responses && complaint.responses.length > 0 ? (
              <div className="space-y-4">
                {complaint.responses.map((response: Response) => (
                  <Card key={response.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{response.profiles?.name || "Admin"}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(response.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p>{response.message}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No responses yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}