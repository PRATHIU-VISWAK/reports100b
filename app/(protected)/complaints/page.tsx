'use client';

import { useUser } from "@clerk/nextjs";
import { HoverEffect } from "@/components/ui/aceternity/cards";
import { BackgroundGradient } from "@/components/ui/aceternity/form-animation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IoMdAdd } from "react-icons/io";
import { HiOutlineClipboardDocument } from "react-icons/hi2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Complaint {
  id: string;
  category: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved';
  created_at: string;
  user_id: string;
}

export default function ComplaintsPage() {
  const { user } = useUser();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!user) return;
      
      const supabase = createClient();
      let query = supabase
        .from('complaints')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      try {
        const { data, error: supabaseError } = await query;
        
        if (supabaseError) throw supabaseError;
        
        setComplaints(data || []);
      } catch (err) {
        console.error('Error fetching complaints:', err);
        setError('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [user, filter]);

  const items = complaints.map(complaint => ({
    title: complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1),
    description: `${complaint.description.substring(0, 100)}... 
      [Status: ${complaint.status.toUpperCase()}]`,
    link: `/complaints/${complaint.id}`,
    icon: <HiOutlineClipboardDocument className="w-6 h-6" />,
  }));

  const statusOptions = [
    { value: 'all', label: 'All Reports' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <BackgroundGradient className="p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">My Reports</h1>
            <p className="text-gray-300">Track and manage your submitted reports</p>
          </div>
          <div className="flex gap-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Link href="/complaints/new">
              <Button>
                <IoMdAdd className="w-4 h-4 mr-2" />
                New Report
              </Button>
            </Link>
          </div>
        </div>
      </BackgroundGradient>

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-400">Loading reports...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-400">{error}</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 mb-4">No reports found</p>
          <Button asChild>
            <Link href="/complaints/new">Submit Your First Report</Link>
          </Button>
        </div>
      ) : (
        <HoverEffect items={items} className="gap-4" />
      )}
    </div>
  );
}