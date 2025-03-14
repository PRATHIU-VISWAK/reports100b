"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AdminComplaintDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const [complaint, setComplaint] = useState<any | null>(null)
  const [responses, setResponses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [responseText, setResponseText] = useState("")
  const [status, setStatus] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  useEffect(() => {
    fetchComplaintData()
  }, [])
  
  const fetchComplaintData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Get complaint details
      const { data: complaint, error: complaintError } = await supabase
        .from("complaints")
        .select("*, profiles(name, email)")
        .eq("id", params.id)
        .single()
      
      if (complaintError) throw complaintError
      
      setComplaint(complaint)
      setStatus(complaint.status)
      
      // Get responses
      const { data: responses, error: responsesError } = await supabase
        .from("responses")
        .select("*, profiles(name)")
        .eq("complaint_id", params.id)
        .order("created_at", { ascending: true })
      
      if (responsesError) throw responsesError
      
      setResponses(responses || [])
    } catch (error: any) {
      setError(`Failed to load complaint data: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)
    
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error("You must be logged in to submit a response")
      }
      
      // Save the response
      const { error: responseError } = await supabase
        .from("responses")
        .insert({
          complaint_id: params.id,
          admin_id: session.user.id,
          message: responseText,
        })
      
      if (responseError) throw responseError
      
      // Update complaint status if changed
      if (status !== complaint.status) {
        const { error: statusError } = await supabase
          .from("complaints")
          .update({ status })
          .eq("id", params.id)
        
        if (statusError) throw statusError
      }
      
      // Refresh data
      await fetchComplaintData()
      
      // Clear response text
      setResponseText("")
      
      setSuccess("Response submitted successfully!")
    } catch (error: any) {
      setError(`Failed to submit response: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    setError(null)

    try {
      const { error: deleteError } = await supabase
        .from('complaints')
        .delete()
        .eq('id', params.id)

      if (deleteError) throw deleteError

      setSuccess('Complaint deleted successfully')
      
      // Redirect after short delay
      setTimeout(() => {
        router.push('/admin/complaints')
      }, 1500)
    } catch (error: any) {
      setError(`Failed to delete complaint: ${error.message}`)
    } finally {
      setIsDeleting(false)
    }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-8">Loading complaint details...</div>
      </div>
    )
  }
  
  if (!complaint) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert variant="destructive">
          <AlertDescription>Complaint not found</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link href="/admin/complaints">Back to Complaints</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button asChild variant="outline" className="mb-4">
          <Link href="/admin/complaints">Back to Complaints</Link>
        </Button>
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold capitalize">{complaint.category}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Reported on {new Date(complaint.created_at).toLocaleDateString()} by {complaint.profiles?.name || "Anonymous"}
            </p>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Complaint"}
          </Button>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-4">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{complaint.description}</p>
              <p className="text-sm font-medium">
                Location: <span className="font-normal">{complaint.location || "Not specified"}</span>
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Reporter Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">
                <span className="font-medium">Name:</span> {complaint.profiles?.name || "Anonymous"}
              </p>
              <p>
                <span className="font-medium">Email:</span> {complaint.profiles?.email || "Not available"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Photo</CardTitle>
            </CardHeader>
            <CardContent>
              {complaint.photo_url ? (
                <div className="rounded-md overflow-hidden">
                  <Image
                    src={complaint.photo_url}
                    alt={`Photo of ${complaint.category}`}
                    width={400}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No photo uploaded
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Response History</h2>
        
        {responses && responses.length > 0 ? (
          <div className="space-y-4">
            {responses.map((response) => (
              <Card key={response.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    From: {response.profiles?.name || "Admin"}
                  </CardTitle>
                  <CardDescription>
                    {new Date(response.created_at).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{response.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500 dark:text-gray-400">
                No responses have been sent yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Send Response</h2>
        <Card>
          <form onSubmit={handleSubmitResponse}>
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Update Status
                </label>
                <Select
                  value={status}
                  onValueChange={setStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Response Message
                </label>
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response message here..."
                  required
                  rows={5}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Sending..." : "Send Response"}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  )
}