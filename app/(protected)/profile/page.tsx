import { auth } from "@clerk/nextjs/server"
import { createServerClient } from "@/lib/supabase/server"

export default async function ProfilePage() {
  const { userId } = await auth()
  const supabase = createServerClient()
  
  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      <div className="max-w-xl">
        {profile ? (
          <div className="space-y-4">
            <div>
              <label className="font-medium">Name</label>
              <div>{profile.name}</div>
            </div>
            <div>
              <label className="font-medium">Phone</label>
              <div>{profile.phone}</div>
            </div>
            <div>
              <label className="font-medium">Role</label>
              <div className="capitalize">{profile.role}</div>
            </div>
          </div>
        ) : (
          <div>Profile not found</div>
        )}
      </div>
    </div>
  )
} 