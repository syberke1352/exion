"use client"

import { useState, useEffect } from "react"
import { LayoutDashboard, FileText, Users, Settings, Trophy, ChartBar as BarChart3, Music, Mic, Volume2, Calendar, Menu } from "lucide-react"
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

interface HadrohAdminDashboardProps {
  onLogout: () => void
}

export default function HadrohAdminDashboard({ onLogout }: HadrohAdminDashboardProps) {
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
    { id: "achievements", label: "Prestasi", icon: Trophy },
    { id: "reports", label: "Laporan", icon: BarChart3 },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ]

  useEffect(() => {
    const loadData = async () => {
      if (!user || user.role !== "hadroh_admin") return

      setLoading(true)
      try {
        const [membersData, docsData, achievementsData] = await Promise.all([
          getMembers("hadroh"),
          getDocumentation("hadroh"),
          getAchievements("hadroh"),
        ])

        setMembers(membersData)
        setDocumentation(docsData)
        setAchievements(achievementsData)
      } catch (error) {
        console.error("Error loading hadroh data:", error)
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
          <h1 className="text-3xl font-heading font-bold mb-2 text-emerald-600 dark:text-emerald-400">
            Dashboard Hadroh
          </h1>
          <p className="text-muted-foreground">Kelola grup hadroh dan seni musik Islami</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <Music className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Admin Hadroh</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Anggota Aktif"
          value={members.length}
          description="Pemain hadroh"
          icon={Users}
          variant="success"
        />
        <DashboardCard title="Pertunjukan" value={6} description="Show tahun ini" icon={Mic} variant="success" />
        <DashboardCard
          title="Prestasi"
          value={achievements.length}
          description="Penghargaan hadroh"
          icon={Trophy}
          variant="warning"
        />
        <DashboardCard
          title="Repertoar"
          value={15}
          description="Lagu dikuasai"
          icon={Volume2}
          variant="primary"
          trend={{ value: 3, label: "lagu baru bulan ini", isPositive: true }}
        />
      </div>

      {/* Recent Activities */}
      <Card className="admin-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Music className="w-5 h-5 text-emerald-600" />
            Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {documentation.slice(0, 5).map((doc) => (
              <div
                key={doc.id}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-3 h-3 bg-emerald-600 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{doc.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">{doc.description}</p>
                </div>
                <div className="text-sm text-muted-foreground flex-shrink-0">
                  {new Date(doc.date).toLocaleDateString("id-ID")}
                </div>
              </div>
            ))}
            {documentation.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Belum ada aktivitas terbaru</p>
                <p className="text-sm text-muted-foreground">Mulai dengan menambahkan dokumentasi kegiatan</p>
              </div>
            )}
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
        return <AdminMemberCRUD ekskulType="hadroh" />
      case "documentation":
        return <AdminDocumentationCRUD ekskulType="hadroh" />
      case "achievements":
        return <AdminAchievementManagement />
      default:
        return renderDashboard()
    }
  }

  if (!user || user.role !== "hadroh_admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat dashboard hadroh..." variant="primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar
        title="Hadroh Admin"
        subtitle="Islamic Music & Performance"
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
            <span className="font-medium text-foreground">Admin Hadroh</span>
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