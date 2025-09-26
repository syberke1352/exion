"use client"

import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Trophy,
  BarChart3,
  Music,
  Mic,
  Volume2,
  Calendar,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { getMembers, getDocumentation, getAchievements } from "@/lib/firebase-service"
import type { Member, Documentation, Achievement } from "@/types"
import LoadingSpinner from "./loading-spinner"
import DashboardCard from "./dashboard-card"
import DashboardSidebar from "./dashboard-sidebar"
import AdminMemberCRUD from "./admin-member-crud"
import AdminDocumentationCRUD from "./admin-documentation-crud"
import AdminAttendanceManagement from "./admin-attendance-management"
import AdminAchievementManagement from "./admin-achievement-management"

interface BandAdminDashboardProps {
  onLogout: () => void
}

export default function BandAdminDashboard({ onLogout }: BandAdminDashboardProps) {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Data state
  const [members, setMembers] = useState<Member[]>([])
  const [documentation, setDocumentation] = useState<Documentation[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "performances", label: "Pertunjukan", icon: Mic },
    { id: "rehearsals", label: "Latihan", icon: Music },
    { id: "members", label: "Anggota", icon: Users },
    { id: "repertoire", label: "Repertoar", icon: Volume2 },
    { id: "documentation", label: "Dokumentasi", icon: FileText },
    { id: "reports", label: "Laporan", icon: BarChart3 },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ]

  useEffect(() => {
    const loadData = async () => {
      if (!user || user.role !== "band_admin") return

      setLoading(true)
      try {
        const [membersData, docsData, achievementsData] = await Promise.all([
          getMembers("band"),
          getDocumentation("band"),
          getAchievements("band"),
        ])

        setMembers(membersData)
        setDocumentation(docsData)
        setAchievements(achievementsData)
      } catch (error) {
        console.error("Error loading band data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  const handleLogout = async () => {
    await logout()
    onLogout()
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2 text-purple-600 dark:text-purple-400">Dashboard Band</h1>
          <p className="text-muted-foreground">Kelola grup musik dan pertunjukan seni</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <Music className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Admin Band</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Musisi Aktif"
          value={members.length}
          description="Anggota band"
          icon={Users}
          variant="default"
        />
        <DashboardCard title="Pertunjukan" value={8} description="Show tahun ini" icon={Mic} variant="default" />
        <DashboardCard
          title="Prestasi"
          value={achievements.length}
          description="Penghargaan musik"
          icon={Trophy}
          variant="warning"
        />
        <DashboardCard
          title="Repertoar"
          value={25}
          description="Lagu dikuasai"
          icon={Volume2}
          variant="primary"
          trend={{ value: 5, label: "lagu baru bulan ini", isPositive: true }}
        />
      </div>

      {/* Band Formation */}
      <Card className="admin-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Music className="w-5 h-5 text-purple-600" />
            Formasi Band Utama
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { instrument: "Vokal Utama", player: "Sari Dewi", role: "Lead Singer", status: "Active" },
              { instrument: "Gitar Lead", player: "Andi Pratama", role: "Lead Guitar", status: "Active" },
              { instrument: "Gitar Bass", player: "Budi Santoso", role: "Bass Guitar", status: "Active" },
              { instrument: "Keyboard", player: "Citra Lestari", role: "Keyboardist", status: "Active" },
              { instrument: "Drum", player: "Doni Saputra", role: "Drummer", status: "Active" },
              { instrument: "Vokal Pendukung", player: "Eka Putri", role: "Backing Vocal", status: "Active" },
            ].map((musician, index) => (
              <div key={index} className="p-4 border rounded-lg text-center hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Music className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-foreground">{musician.player}</h4>
                <p className="text-sm text-muted-foreground">{musician.instrument}</p>
                <Badge variant="default" className="mt-2 bg-purple-600">
                  {musician.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Performances */}
      <Card className="admin-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Mic className="w-5 h-5 text-purple-600" />
            Pertunjukan Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[
              {
                event: "Festival Seni Sekolah",
                date: "2024-02-14",
                venue: "Aula Sekolah",
                audience: "500+",
                type: "School Event",
              },
              {
                event: "Konser Amal",
                date: "2024-02-07",
                venue: "Gedung Serbaguna",
                audience: "300+",
                type: "Charity",
              },
              {
                event: "Perayaan HUT Sekolah",
                date: "2024-01-28",
                venue: "Lapangan Sekolah",
                audience: "800+",
                type: "Anniversary",
              },
              {
                event: "Kompetisi Band Pelajar",
                date: "2024-01-15",
                venue: "Balai Kota",
                audience: "200+",
                type: "Competition",
              },
            ].map((performance, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-foreground">{performance.event}</h4>
                  <p className="text-sm text-muted-foreground">{performance.venue}</p>
                  <Badge variant="outline" className="mt-1">
                    {performance.type}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {new Date(performance.date).toLocaleDateString("id-ID")}
                  </p>
                  <p className="text-sm text-muted-foreground">{performance.audience} penonton</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card className="admin-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="w-5 h-5 text-purple-600" />
            Jadwal Mendatang
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[
              {
                event: "Konser Musik Klasik",
                date: "2024-03-20",
                time: "19:00",
                venue: "Gedung Kesenian",
                type: "Concert",
              },
              {
                event: "Festival Musik Daerah",
                date: "2024-04-05",
                time: "15:00",
                venue: "Taman Budaya",
                type: "Festival",
              },
              {
                event: "Pentas Seni Gabungan",
                date: "2024-04-18",
                time: "18:30",
                venue: "Aula Besar",
                type: "Collaboration",
              },
            ].map((event, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold text-foreground">{event.event}</h4>
                  <p className="text-sm text-muted-foreground">{event.venue}</p>
                  <Badge variant="outline" className="mt-1">
                    {event.type}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {new Date(event.date).toLocaleDateString("id-ID")}
                  </p>
                  <p className="text-sm text-muted-foreground">{event.time}</p>
                  <Badge variant="secondary" className="mt-1">
                    Upcoming
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard()
      case "members":
        return <AdminMemberCRUD ekskulType="band" />
      case "documentation":
        return <AdminDocumentationCRUD ekskulType="band" />
      case "attendance":
        return <AdminAttendanceManagement />
      case "achievements":
        return <AdminAchievementManagement />
      default:
        return renderDashboard()
    }
  }

  if (!user || user.role !== "band_admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat dashboard band..." variant="primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar
        title="Band Admin"
        subtitle="Music & Performance"
        icon={Music}
        navigationItems={navigationItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        variant="band"
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-card border-b p-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-foreground">Admin Band</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {loading ? <LoadingSpinner size="lg" text="Memuat data..." variant="primary" /> : renderContent()}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}
