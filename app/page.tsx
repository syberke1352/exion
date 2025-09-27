"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import HomePage from "@/components/home-page"
import AboutPage from "@/components/about-page"
import ExtracurricularsPage from "@/components/extracurriculars-page"
import AchievementsPage from "@/components/achievements-page"
import ContactPage from "@/components/contact-page"
import RobotikPage from "@/components/robotik-page"
import SilatPage from "@/components/silat-page"
import FutsalPage from "@/components/futsal-page"
import MusikPage from "@/components/musik-page"
import HadrohPage from "@/components/hadroh-page"
import QoriPage from "@/components/qori-page"
import AdminLoginPage from "@/components/admin-login-page"
import AdminDashboardRouter from "@/components/admin-dashboard-router"
import Footer from "@/components/footer"
import { LoadingScreen } from "@/components/loading-screen"
import { useAuth } from "@/hooks/use-auth"
import { getDocumentation, getMembers } from "@/lib/firebase-service"
import type { Documentation, Member } from "@/types"

export default function SchoolWebsite() {
  const [activeSection, setActiveSection] = useState("home")
  const { user, loading } = useAuth()
  const [showLoadingScreen, setShowLoadingScreen] = useState(() => {
    // Only show loading screen if this is the first visit
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("hasVisited")
    }
    return true
  })

  const [globalDokumentasi, setGlobalDokumentasi] = useState<Documentation[]>([])
  const [globalMembers, setGlobalMembers] = useState<Member[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    const loadPublicData = async () => {
      try {
        setDataLoading(true)
        const [docsData, membersData] = await Promise.all([getDocumentation(), getMembers()])

        setGlobalDokumentasi(docsData)
        setGlobalMembers(membersData)
      } catch (error) {
        console.error("Error loading public data:", error)
        setGlobalDokumentasi([])
        setGlobalMembers([])
      } finally {
        setDataLoading(false)
      }
    }

    loadPublicData()
  }, [])

  const handleLoadingComplete = () => {
    setShowLoadingScreen(false)
    // Mark that user has visited
    if (typeof window !== "undefined") {
      sessionStorage.setItem("hasVisited", "true")
    }
  }

  const handleAdminLogin = (role: string) => {
    setActiveSection("admin-dashboard")
  }

  const handleLogout = () => {
    setActiveSection("home")
  }

  const renderPage = () => {
    if (user && activeSection === "admin-dashboard") {
      return <AdminDashboardRouter onLogout={handleLogout} />
    }

    if (activeSection === "admin-login") {
      if (user) {
        setActiveSection("admin-dashboard")
        return <AdminDashboardRouter onLogout={handleLogout} />
      }
      return <AdminLoginPage onLogin={handleAdminLogin} />
    }

    switch (activeSection) {
      case "home":
        return <HomePage onNavigate={setActiveSection} dokumentasi={globalDokumentasi} members={globalMembers} />
      case "about":
        return <AboutPage />
      case "extracurriculars":
        return <ExtracurricularsPage onNavigate={setActiveSection} />
      case "achievements":
        return <AchievementsPage />
      case "contact":
        return <ContactPage />
      case "robotik":
        return <RobotikPage />
      case "silat":
        return <SilatPage />
      case "futsal":
        return <FutsalPage />
      case "musik":
        return <MusikPage />
      case "hadroh":
        return <HadrohPage />
      case "qori":
        return <QoriPage />
      default:
        return <HomePage onNavigate={setActiveSection} dokumentasi={globalDokumentasi} members={globalMembers} />
    }
  }

  if (showLoadingScreen) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <span className="text-muted-foreground">Memuat...</span>
        </div>
      </div>
    )
  }

  const isAdminPage = user && activeSection === "admin-dashboard"

  return (
    <div className="min-h-screen bg-background">
      {!isAdminPage && <Navbar activeSection={activeSection} onSectionChange={setActiveSection} />}
      <main className="w-full">{renderPage()}</main>
      {!isAdminPage && <Footer onNavigate={setActiveSection} />}
    </div>
  )
}
