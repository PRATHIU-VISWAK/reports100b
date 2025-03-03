export type UserRole = "resident" | "admin"

export interface UserMetadata {
  role: UserRole
  phone: string
  name: string
} 