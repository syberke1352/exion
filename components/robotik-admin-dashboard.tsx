"use client"

import { useState, useEffect } from "react"
import { LayoutDashboard, FileText, Users, Settings, Trophy, ChartBar as BarChart3, Cpu, Wrench, Target, Menu, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { getMembers, getDocumentation, getAchievements } from "@/lib/firebase-service"
import type { Member, Documentation, Achievement } from "@/types"
import LoadingSpinner from "./loading-spinner"
import DashboardCard from "./dashboard-card"
import DashboardSidebar from "./dashboard-sidebar"
import AdminAchievementManagement from "./admin-achievement-management"
import AdminMemberCRUD from "./admin-member-crud"
import AdminDocumentationCRUD from "./admin-documentation-crud"
import AdminAttendanceManagement from "./admin-attendance-management"

interface RobotikAdminDashboardProps {
  onLogout: () => void
}

export default function RobotikAdminDashboard({ onLogout }: RobotikAdminDashboardProps) {
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
    { id: "projects", label: "Proyek Robot", icon: Cpu },
    { id: "competitions", label: "Kompetisi", icon: Trophy },
    { id: "members", label: "Anggota", icon: Users },
    { id: "attendance", label: "Absensi", icon: UserCheck },
    { id: "training", label: "Pelatihan", icon: Wrench },
    { id: "documentation", label: "Dokumentasi", icon: FileText },
    { id: "reports", label: "Laporan", icon: BarChart3 },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ]

  useEffect(() => {
    const loadData = async () => {
      if (!user || user.role !== "robotik_admin") return

      setLoading(true)
      try {
        const [membersData, docsData, achievementsData] = await Promise.all([
          getMembers("robotik"),
          getDocumentation("robotik"),
          getAchievements("robotik"),
        ])

        setMembers(membersData)
        setDocumentation(docsData)
        setAchievements(achievementsData)
      } catch (error) {
        console.error("Error loading robotik data:", error)
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
          <h1 className="text-3xl font-heading font-bold mb-2 text-amber-600 dark:text-amber-400">Dashboard Robotik</h1>
          <p className="text-muted-foreground">Kelola ekstrakurikuler robotik dan teknologi</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <Cpu className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Admin Robotik</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Anggota Aktif"
          value={members.length}
          description="Programmer & Engineer"
          icon={Users}
          variant="warning"
        />
        <DashboardCard
          title="Proyek Aktif"
          value={8}
          description="Robot dalam pengembangan"
          icon={Cpu}
          variant="warning"
        />
        <DashboardCard
          title="Kompetisi"
          value={achievements.length}
          description="Prestasi tahun ini"
          icon={Trophy}
          variant="warning"
        />
        <DashboardCard
          title="Tingkat Skill"
          value="85%"
          description="Rata-rata kemampuan"
          icon={Target}
          variant="warning"
          trend={{ value: 12, label: "dari bulan lalu", isPositive: true }}
        />
      </div>

      {/* Current Projects */}
      <Card className="hover:shadow-md transition-all duration-300">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Cpu className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Proyek Robot Terkini
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[
              { name: "Robot Line Follower", progress: 85, status: "Testing", team: "Tim Alpha" },
              { name: "Robot Sumo", progress: 60, status: "Development", team: "Tim Beta" },
              { name: "Robot Soccer", progress: 40, status: "Design", team: "Tim Gamma" },
              { name: "Drone Autonomous", progress: 25, status: "Planning", team: "Tim Delta" },
            ].map((project, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{project.name}</h4>
                  <p className="text-sm text-muted-foreground">{project.team}</p>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div
                      className="bg-amber-600 dark:bg-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <Badge variant={project.status === "Testing" ? "default" : "secondary"}>{project.status}</Badge>
                  <p className="text-sm text-muted-foreground mt-1">{project.progress}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Competitions */}
      <Card className="hover:shadow-md transition-all duration-300">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Kompetisi Mendatang
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[
              { name: "Kontes Robot Indonesia", date: "2024-03-15", category: "Line Follower", status: "Registered" },
              { name: "Robotik Competition", date: "2024-04-20", category: "Sumo Robot", status: "Preparing" },
              { name: "Tech Innovation Fair", date: "2024-05-10", category: "Innovation", status: "Planning" },
            ].map((comp, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-foreground">{comp.name}</h4>
                  <p className="text-sm text-muted-foreground">{comp.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {new Date(comp.date).toLocaleDateString("id-ID")}
                  </p>
                  <Badge variant="outline">{comp.status}</Badge>
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
        return <AdminMemberCRUD ekskulType="robotik" />
      case "documentation":
        return <AdminDocumentationCRUD ekskulType="robotik" />
      case "attendance":
        return <AdminAttendanceManagement />
      case "achievements":
        return <AdminAchievementManagement />
      case "members":
        return <AdminMemberCRUD ekskulType="robotik" />
      case "documentation":
        return <AdminDocumentationCRUD ekskulType="robotik" />
      case "attendance":
        return <AdminAttendanceManagement />
      case "achievements":
        return <AdminAchievementManagement />
      case "members":
        return <AdminMemberCRUD ekskulType="robotik" />
      case "documentation":
        return <AdminDocumentationCRUD ekskulType="robotik" />
      case "attendance":
        return <AdminAttendanceManagement />
      default:
        return renderDashboard()
    }
  }

  if (!user || user.role !== "robotik_admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat dashboard robotik..." variant="primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar
        title="Robotik Admin"
        subtitle="Technology & Innovation"
        icon={Cpu}
        navigationItems={navigationItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        variant="robotik"
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-card border-b p-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-foreground">Admin Robotik</span>
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
