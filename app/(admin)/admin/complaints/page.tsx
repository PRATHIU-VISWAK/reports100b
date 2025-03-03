"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  useEffect(() => {
    fetchComplaints()
  }, [statusFilter, categoryFilter, searchTerm])
  
  const fetchComplaints = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Base query
      let query = supabase
        .from("complaints")
        .select("*, profiles(name)")
        .order("created_at", { ascending: false })
      
      // Apply filters
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }
      
      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter)
      }
      
      if (searchTerm) {
        query = query.or(`description.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      
      setComplaints(data || [])
    } catch (error: any) {
      setError(`Failed to load complaints: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }
  
  const handleStatusChange = async (complaintId: string, newStatus: string) => {
    try {
      // Update the complaint status
      const { error } = await supabase
        .from("complaints")
        .update({ status: newStatus })
        .eq("id", complaintId)
      
      if (error) throw error
      
      // Update the local state
      setComplaints(complaints.map(complaint => 
        complaint.id === complaintId 
          ? { ...complaint, status: newStatus } 
          : complaint
      ))
      
      setSuccess(`Status updated to ${newStatus}`)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (error: any) {
      setError(`Failed to update status: ${error.message}`)
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Complaints Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View and manage all community reports
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/dashboard">Back to Dashboard</Link>
        </Button>
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
      
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Search
              </label>
              <Input
                placeholder="Search by description or location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Status
              </label>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Category
              </label>
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="potholes">Potholes</SelectItem>
                  <SelectItem value="streetlights">Streetlights</SelectItem>
                  <SelectItem value="drainage">Drainage</SelectItem>
                  <SelectItem value="garbage">Garbage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Complaints Table */}
      {loading ? (
        <div className="text-center py-8">Loading complaints...</div>
      ) : complaints.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-mono">{complaint.id.substring(0, 8)}...</TableCell>
                  <TableCell className="capitalize">{complaint.category}</TableCell>
                  <TableCell>{complaint.profiles?.name || "Anonymous"}</TableCell>
                  <TableCell>{new Date(complaint.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{complaint.location}</TableCell>
                  <TableCell>
                    <Select
                      value={complaint.status}
                      onValueChange={(value) => handleStatusChange(complaint.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/complaints/${complaint.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No reports match your filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 