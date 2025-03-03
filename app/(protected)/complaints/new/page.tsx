"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Database } from "@/types/supabase"

export default function NewComplaintPage() {
  const { user } = useUser()
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [category, setCategory] = useState("potholes")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setPhoto(file)
      
      const reader = new FileReader()
      reader.onload = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      if (!user) {
        throw new Error("You must be logged in to submit a report")
      }

      let photoUrl = null
      
      if (photo) {
        const fileExt = photo.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`
        
        const { error: uploadError } = await supabase
          .storage
          .from('complaint-photos')
          .upload(filePath, photo)
        
        if (uploadError) {
          console.error('Upload error:', uploadError)
          throw new Error('Failed to upload photo')
        }
        
        const { data: urlData } = supabase
          .storage
          .from('complaint-photos')
          .getPublicUrl(filePath)
        
        photoUrl = urlData.publicUrl
      }
      
      const { error: complaintError } = await supabase
        .from('complaints')
        .insert([{
          user_id: user.id,
          category,
          description,
          location,
          photo_url: photoUrl,
          status: 'pending'
        }])
      
      if (complaintError) {
        console.error('Complaint error:', complaintError)
        throw new Error('Failed to submit complaint')
      }
      
      setSuccess("Report submitted successfully!")
      
      setTimeout(() => {
        router.push('/complaints')
      }, 2000)
    } catch (err) {
      console.error('Submission error:', err)
      setError(err instanceof Error ? err.message : "Failed to submit report. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit New Report</CardTitle>
          <CardDescription>
            Report an issue in your community
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="potholes">Potholes</SelectItem>
                  <SelectItem value="streetlights">Streetlights</SelectItem>
                  <SelectItem value="drainage">Drainage</SelectItem>
                  <SelectItem value="garbage">Garbage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the issue in detail..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Street address or landmark"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Photo (Optional)</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="cursor-pointer"
              />
              {photoPreview && (
                <div className="mt-2 rounded-md overflow-hidden">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="max-h-48 object-contain"
                  />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting Report..." : "Submit Report"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 