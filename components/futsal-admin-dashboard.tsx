"use client"

import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Trophy,
  BarChart3,
  Target,
  Timer,
  MapPin,
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

interface FutsalAdminDashboardProps {
  onLogout: () => void
}

export default function FutsalAdminDashboard({ onLogout }: FutsalAdminDashboardProps) {
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
    { id: "matches", label: "Pertandingan", icon: Target },
    { id: "training", label: "Latihan", icon: Timer },
    { id: "members", label: "Pemain", icon: Users },
    { id: "tournaments", label: "Turnamen", icon: Trophy },
    { id: "documentation", label: "Dokumentasi", icon: FileText },
    { id: "reports", label: "Laporan", icon: BarChart3 },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ]

  useEffect(() => {
    const loadData = async () => {
      if (!user || user.role !== "futsal_admin") return

      setLoading(true)
      try {
        const [membersData, docsData, achievementsData] = await Promise.all([
          getMembers("futsal"),
          getDocumentation("futsal"),
          getAchievements("futsal"),
        ])

        setMembers(membersData)
        setDocumentation(docsData)
        setAchievements(achievementsData)
      } catch (error) {
        console.error("Error loading futsal data:", error)
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
          <h1 className="text-3xl font-heading font-bold mb-2 text-orange-600 dark:text-orange-400">
            Dashboard Futsal
          </h1>
          <p className="text-muted-foreground">Kelola tim futsal dan kompetisi olahraga</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <Target className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Admin Futsal</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Pemain Aktif"
          value={members.length}
          description="Atlet futsal"
          icon={Users}
          variant="warning"
        />
        <DashboardCard title="Pertandingan" value={12} description="Match dimainkan" icon={Target} variant="success" />
        <DashboardCard
          title="Prestasi"
          value={achievements.length}
          description="Trofi & medali"
          icon={Trophy}
          variant="warning"
        />
        <DashboardCard
          title="Win Rate"
          value="75%"
          description="Tingkat kemenangan"
          icon={BarChart3}
          variant="primary"
          trend={{ value: 15, label: "dari bulan lalu", isPositive: true }}
        />
      </div>

      {/* Team Formation */}
      <Card className="admin-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Target className="w-5 h-5 text-orange-600" />
            Formasi Tim Utama
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { position: "Kiper", player: "Ahmad Rizki", number: "1", status: "Starter" },
              { position: "Defender", player: "Budi Santoso", number: "2", status: "Starter" },
              { position: "Defender", player: "Candra Wijaya", number: "3", status: "Starter" },
              { position: "Midfielder", player: "Doni Pratama", number: "4", status: "Starter" },
              { position: "Forward", player: "Eko Saputra", number: "5", status: "Starter" },
            ].map((player, index) => (
              <div key={index} className="p-4 border rounded-lg text-center hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-orange-600">#{player.number}</span>
                </div>
                <h4 className="font-semibold text-foreground">{player.player}</h4>
                <p className="text-sm text-muted-foreground">{player.position}</p>
                <Badge variant="default" className="mt-2 bg-orange-600">
                  {player.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Matches */}
      <Card className="admin-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Trophy className="w-5 h-5 text-orange-600" />
            Pertandingan Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[
              {
                opponent: "SMA Negeri 2",
                score: "3-1",
                result: "Menang",
                date: "2024-02-15",
                venue: "Lapangan Sekolah",
              },
              { opponent: "SMA Swasta ABC", score: "2-2", result: "Seri", date: "2024-02-08", venue: "Lapangan ABC" },
              { opponent: "SMA Negeri 5", score: "1-2", result: "Kalah", date: "2024-02-01", venue: "Lapangan Kota" },
              {
                opponent: "SMA Negeri 3",
                score: "4-0",
                result: "Menang",
                date: "2024-01-25",
                venue: "Lapangan Sekolah",
              },
            ].map((match, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-semibold text-foreground">vs {match.opponent}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {match.venue}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{match.score}</p>
                  <Badge
                    variant={
                      match.result === "Menang" ? "default" : match.result === "Seri" ? "secondary" : "destructive"
                    }
                    className={match.result === "Menang" ? "bg-green-600" : ""}
                  >
                    {match.result}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {new Date(match.date).toLocaleDateString("id-ID")}
                  </p>
                  <p className="text-xs text-muted-foreground">Liga Pelajar</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Matches */}
      <Card className="admin-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="w-5 h-5 text-orange-600" />
            Jadwal Pertandingan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[
              {
                opponent: "SMA Negeri 7",
                date: "2024-03-15",
                time: "15:00",
                venue: "Lapangan Kota",
                competition: "Liga Pelajar",
              },
              {
                opponent: "SMA Swasta XYZ",
                date: "2024-03-22",
                time: "14:00",
                venue: "Lapangan Sekolah",
                competition: "Friendly Match",
              },
              {
                opponent: "SMA Negeri 4",
                date: "2024-03-29",
                time: "16:00",
                venue: "Lapangan ABC",
                competition: "Liga Pelajar",
              },
            ].map((match, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold text-foreground">vs {match.opponent}</h4>
                  <p className="text-sm text-muted-foreground">{match.competition}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {match.venue}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {new Date(match.date).toLocaleDateString("id-ID")}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    {match.time}
                  </p>
                  <Badge variant="outline" className="mt-1">
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
        return <AdminMemberCRUD ekskulType="futsal" />
      case "documentation":
        return <AdminDocumentationCRUD ekskulType="futsal" />
      case "attendance":
        return <AdminAttendanceManagement />
      case "achievements":
        return <AdminAchievementManagement />
      default:
        return renderDashboard()
    }
  }

  if (!user || user.role !== "futsal_admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat dashboard futsal..." variant="primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar
        title="Futsal Admin"
        subtitle="Sports & Competition"
        icon={Target}
        navigationItems={navigationItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        variant="futsal"
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-card border-b p-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-foreground">Admin Futsal</span>
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
