"use client"

import { useState, useEffect } from "react"
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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  
  useEffect(() => {
    fetchUsers()
  }, [searchTerm, roleFilter])
  
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Base query for profiles
      let query = supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
      
      // Apply role filter if selected
      if (roleFilter !== "all") {
        query = query.eq("role", roleFilter)
      }
      
      // Apply search term if entered
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      
      setUsers(data || [])
    } catch (error: any) {
      setError(`Failed to load users: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }
  
  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      // Update the user role
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId)
      
      if (error) throw error
      
      // Update the local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: newRole } 
          : user
      ))
      
      setSuccess(`User role updated to ${newRole}`)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (error: any) {
      setError(`Failed to update role: ${error.message}`)
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View and manage user accounts
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Search
              </label>
              <Input
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Role
              </label>
              <Select
                value={roleFilter}
                onValueChange={setRoleFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Users Table */}
      {loading ? (
        <div className="text-center py-8">Loading users...</div>
      ) : users.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name || "Not provided"}</TableCell>
                  <TableCell>{user.email || "Not provided"}</TableCell>
                  <TableCell>
                    {user.created_at ? 
                      new Date(user.created_at).toLocaleDateString() : "Unknown"
                    }
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role || "user"}
                      onValueChange={(value) => handleRoleUpdate(user.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled // Would need additional functionality to safely delete users
                    >
                      Delete
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
              No users match your filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 