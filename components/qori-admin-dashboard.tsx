"use client"

import { useState, useEffect } from "react"
import { LayoutDashboard, FileText, Users, Settings, Trophy, ChartBar as BarChart3, BookOpen, Mic, Volume2, Calendar, Menu } from "lucide-react"
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

interface QoriAdminDashboardProps {
  onLogout: () => void
}

export default function QoriAdminDashboard({ onLogout }: QoriAdminDashboardProps) {
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
    { id: "competitions", label: "Kompetisi MTQ", icon: Trophy },
    { id: "training", label: "Latihan Tilawah", icon: BookOpen },
    { id: "members", label: "Anggota", icon: Users },
    { id: "recitations", label: "Bacaan", icon: Volume2 },
    { id: "documentation", label: "Dokumentasi", icon: FileText },
    { id: "achievements", label: "Prestasi", icon: Trophy },
    { id: "reports", label: "Laporan", icon: BarChart3 },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ]

  useEffect(() => {
    const loadData = async () => {
      if (!user || user.role !== "qori_admin") return

      setLoading(true)
      try {
        const [membersData, docsData, achievementsData] = await Promise.all([
          getMembers("qori"),
          getDocumentation("qori"),
          getAchievements("qori"),
        ])

        setMembers(membersData)
        setDocumentation(docsData)
        setAchievements(achievementsData)
      } catch (error) {
        console.error("Error loading qori data:", error)
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
          <h1 className="text-3xl font-heading font-bold mb-2 text-indigo-600 dark:text-indigo-400">
            Dashboard Qori
          </h1>
          <p className="text-muted-foreground">Kelola ekstrakurikuler qori dan tilawah Al-Quran</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Admin Qori</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Qori Aktif"
          value={members.length}
          description="Pembaca Al-Quran"
          icon={Users}
          variant="primary"
        />
        <DashboardCard title="Kompetisi MTQ" value={4} description="Event tahun ini" icon={Trophy} variant="primary" />
        <DashboardCard
          title="Prestasi"
          value={achievements.length}
          description="Penghargaan tilawah"
          icon={Trophy}
          variant="warning"
        />
        <DashboardCard
          title="Surah Dikuasai"
          value={30}
          description="Hafalan & tilawah"
          icon={BookOpen}
          variant="primary"
          trend={{ value: 5, label: "surah baru bulan ini", isPositive: true }}
        />
      </div>

      {/* Recent Activities */}
      <Card className="admin-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <BookOpen className="w-5 h-5 text-indigo-600" />
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
                <div className="w-3 h-3 bg-indigo-600 rounded-full flex-shrink-0"></div>
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
        return <AdminMemberCRUD ekskulType="qori" />
      case "documentation":
        return <AdminDocumentationCRUD ekskulType="qori" />
      case "attendance":
        return <AdminAttendanceManagement />
      case "achievements":
        return <AdminAchievementManagement />
      default:
        return renderDashboard()
    }
  }

  if (!user || user.role !== "hadroh_admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat dashboard qori..." variant="primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar
        title="Qori Admin"
        subtitle="Quran Recitation & Tilawah"
        icon={BookOpen}
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
            <span className="font-medium text-foreground">Admin Qori</span>
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