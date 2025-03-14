import { auth } from "@clerk/nextjs/server"
import { createServerClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { UserProfile } from "@clerk/nextjs"

export default async function ProfilePage() {
  const { userId } = await auth()
  const supabase = await createServerClient()
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      
      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        {/* Profile Info Card */}
        <Card className="p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Account Info</h2>
          {profile ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Name</label>
                <p className="font-medium">{profile.name}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone</label>
                <p className="font-medium">{profile.phone}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Role</label>
                <p className="font-medium capitalize">{profile.role}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Member Since</label>
                <p className="font-medium">
                  {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">Profile not found</div>
          )}
        </Card>

        {/* Clerk Profile Management */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <UserProfile
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none p-0",
                navbar: "hidden",
                pageScrollBox: "p-0"
              }
            }}
          />
        </Card>
      </div>
    </div>
  )
}