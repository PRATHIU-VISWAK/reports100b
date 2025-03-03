export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string | null
          phone: string | null
          role: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          phone?: string | null
          role?: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          phone?: string | null
          role?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      complaints: {
        Row: {
          id: string
          user_id: string
          category: 'potholes' | 'streetlights' | 'drainage' | 'garbage'
          description: string
          location: string
          photo_url: string | null
          status: 'pending' | 'in_progress' | 'resolved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: 'potholes' | 'streetlights' | 'drainage' | 'garbage'
          description: string
          location: string
          photo_url?: string | null
          status?: 'pending' | 'in_progress' | 'resolved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: 'potholes' | 'streetlights' | 'drainage' | 'garbage'
          description?: string
          location?: string
          photo_url?: string | null
          status?: 'pending' | 'in_progress' | 'resolved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      responses: {
        Row: {
          id: string
          complaint_id: string
          admin_id: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          complaint_id: string
          admin_id: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          complaint_id?: string
          admin_id?: string
          message?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 