"use client"

import { useState, useEffect } from "react"
import { LayoutDashboard, FileText, Users, Settings, Trophy, BarChart3, Sword, Target, Award, Menu } from "lucide-react"
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

interface SilatAdminDashboardProps {
  onLogout: () => void
}

export default function SilatAdminDashboard({ onLogout }: SilatAdminDashboardProps) {
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
    { id: "training", label: "Latihan", icon: Sword },
    { id: "tournaments", label: "Turnamen", icon: Trophy },
    { id: "members", label: "Anggota", icon: Users },
    { id: "belts", label: "Tingkatan Sabuk", icon: Award },
    { id: "documentation", label: "Dokumentasi", icon: FileText },
    { id: "reports", label: "Laporan", icon: BarChart3 },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ]

  useEffect(() => {
    const loadData = async () => {
      if (!user || user.role !== "silat_admin") return

      setLoading(true)
      try {
        const [membersData, docsData, achievementsData] = await Promise.all([
          getMembers("silat"),
          getDocumentation("silat"),
          getAchievements("silat"),
        ])

        setMembers(membersData)
        setDocumentation(docsData)
        setAchievements(achievementsData)
      } catch (error) {
        console.error("Error loading silat data:", error)
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
          <h1 className="text-3xl font-heading font-bold mb-2 text-red-600 dark:text-red-400">
            Dashboard Pencak Silat
          </h1>
          <p className="text-muted-foreground">Kelola ekstrakurikuler pencak silat dan bela diri</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <Sword className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span className="text-sm font-medium text-red-600 dark:text-red-400">Admin Pencak Silat</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Pesilat Aktif"
          value={members.length}
          description="Atlet bela diri"
          icon={Users}
          variant="danger"
        />
        <DashboardCard title="Sabuk Hitam" value={5} description="Master level" icon={Award} variant="danger" />
        <DashboardCard
          title="Turnamen"
          value={achievements.length}
          description="Prestasi tahun ini"
          icon={Trophy}
          variant="danger"
        />
        <DashboardCard
          title="Tingkat Skill"
          value="78%"
          description="Rata-rata kemampuan"
          icon={Target}
          variant="danger"
          trend={{ value: 8, label: "dari bulan lalu", isPositive: true }}
        />
      </div>

      {/* Belt Progression */}
      <Card className="hover:shadow-md transition-all duration-300">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Award className="w-5 h-5 text-red-600 dark:text-red-400" />
            Distribusi Tingkatan Sabuk
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[
              { belt: "Sabuk Putih", count: 15, color: "bg-gray-200 dark:bg-gray-600", percentage: 45 },
              { belt: "Sabuk Kuning", count: 8, color: "bg-yellow-400", percentage: 24 },
              { belt: "Sabuk Hijau", count: 6, color: "bg-green-500", percentage: 18 },
              { belt: "Sabuk Biru", count: 3, color: "bg-blue-500", percentage: 9 },
              { belt: "Sabuk Coklat", count: 1, color: "bg-amber-700", percentage: 3 },
              { belt: "Sabuk Hitam", count: 0, color: "bg-black dark:bg-gray-800", percentage: 0 },
            ].map((belt, index) => (
              <div
                key={index}
                className="flex items-center justify-between hover:bg-muted/30 p-2 rounded transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${belt.color} border border-border`}></div>
                  <span className="font-medium text-foreground">{belt.belt}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div
                      className="bg-red-600 dark:bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${belt.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-8 text-foreground">{belt.count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Tournaments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-red-600 dark:text-red-400" />
            Turnamen Mendatang
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Kejuaraan Pencak Silat Pelajar", date: "2024-03-20", category: "Tanding", status: "Registered" },
              { name: "Festival Seni Bela Diri", date: "2024-04-15", category: "Seni", status: "Preparing" },
              {
                name: "Kompetisi Pencak Silat Nasional",
                date: "2024-05-25",
                category: "Tanding & Seni",
                status: "Planning",
              },
            ].map((tournament, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{tournament.name}</h4>
                  <p className="text-sm text-muted-foreground">{tournament.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{new Date(tournament.date).toLocaleDateString("id-ID")}</p>
                  <Badge variant="outline">{tournament.status}</Badge>
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
        return <AdminMemberCRUD ekskulType="silat" />
      case "documentation":
        return <AdminDocumentationCRUD ekskulType="silat" />
      case "attendance":
        return <AdminAttendanceManagement />
      case "achievements":
        return <AdminAchievementManagement />
      default:
        return renderDashboard()
    }
  }

  if (!user || user.role !== "silat_admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat dashboard pencak silat..." variant="primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar
        title="Silat Admin"
        subtitle="Martial Arts & Culture"
        icon={Sword}
        navigationItems={navigationItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        variant="silat"
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-card border-b p-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-foreground">Admin Pencak Silat</span>
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
