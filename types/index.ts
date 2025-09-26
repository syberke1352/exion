export interface User {
  id: string
  email: string
  name: string
  role:
    | "super_admin"
    | "robotik_admin"
    | "silat_admin"
    | "futsal_admin"
    | "band_admin"
    | "hadroh_admin"
    | "qori_admin"
  createdAt: Date
  updatedAt: Date
}

export interface Member {
  id: string
  name: string
  class: string
  phone: string
  email: string
  joinDate: Date
  status: "active" | "inactive"
  photoUrl?: string
  photo?: string // 🔹 ditambah biar error "photo" hilang
  studentId: string
  ekskulType: EkskulType
  createdAt: Date
  updatedAt: Date
}

export interface Documentation {
  id: string
  title: string
  description: string
  date: Date
  location?: string
  participants?: string
  image?: string
  photoUrls?: string[]
  ekskulType: EkskulType
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface Achievement {
  id: string
  title: string
  description: string
  date: Date
  level: "Sekolah" | "Kota" | "Provinsi" | "Nasional" | "Internasional"
  position: string
  participants: string[]
  photoUrl?: string
  image?: string // 🔹 ditambah biar error hilang
  category?: string // 🔹 ditambah biar error hilang
  ekskulType: EkskulType
  createdAt: Date
  updatedAt: Date
}

export interface Attendance {
  id: string
  memberId: string
  scheduleId?: string
  date: string
  status: "Hadir" | "Tidak Hadir" | "Izin" | "Sakit"
  notes?: string
  ekskulType: EkskulType
  createdAt: Date
  updatedAt: Date
}

export interface Schedule {
  id: string
  title: string
  description: string
  date: Date
  startTime: string
  endTime: string
  location: string
  ekskulType: EkskulType
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export type EkskulType =
  | "robotik"
  | "silat"
  | "futsal"
  | "band"
  | "musik" // 🔹 ditambah biar error EkskulType hilang
  | "hadroh"
  | "qori"
  | "umum"  // 🔹 ditambah juga karena muncul di log error

export interface Event {
  id: string
  title: string
  description: string
  date: Date
  startTime: string
  endTime: string
  location: string
  type: "competition" | "training" | "workshop" | "meeting" | "performance"
  ekskulType: EkskulType
  participants?: string[]
  maxParticipants?: number
  registrationDeadline?: Date
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

// Additional utility types
export interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

export interface FirebaseError {
  code: string
  message: string
}

export interface PublicUploadResult {
  secure_url: string // 🔹 ganti dari `url` → `secure_url` biar match Cloudinary
  path?: string
  name?: string
  size?: number
  type?: string
}
