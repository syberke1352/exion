"use client"

import { useState, useEffect } from "react"
import { Clock, MapPin, Users, CheckCircle, XCircle } from "lucide-react"

export default function AttendancePage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedEkskul, setSelectedEkskul] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const todaySchedule = [
    {
      id: "robotik",
      name: "Robotik",
      time: "14:00 - 16:00",
      location: "Lab Komputer",
      instructor: "Pak Budi",
      color: "from-blue-500 to-cyan-400",
      icon: "🤖",
      status: "upcoming", // upcoming, ongoing, completed, missed
      attendees: 18,
      maxAttendees: 25,
      canCheckIn: false,
    },
    {
      id: "silat",
      name: "Pencak Silat",
      time: "15:30 - 17:00",
      location: "Aula Sekolah",
      instructor: "Bu Sari",
      color: "from-red-500 to-orange-400",
      icon: "🥋",
      status: "ongoing",
      attendees: 15,
      maxAttendees: 20,
      canCheckIn: true,
    },
  ]

  const weeklyAttendance = [
    { day: "Sen", date: "12", status: "present", ekskul: "Robotik" },
    { day: "Sel", date: "13", status: "present", ekskul: "Silat" },
    { day: "Rab", date: "14", status: "absent", ekskul: "Futsal" },
    { day: "Kam", date: "15", status: "present", ekskul: "Musik" },
    { day: "Jum", date: "16", status: "upcoming", ekskul: "Robotik" },
  ]

  const handleCheckIn = (ekskulId: string) => {
    setSelectedEkskul(ekskulId)
    // Simulate check-in process
    setTimeout(() => {
      alert("Berhasil absen masuk!")
      setSelectedEkskul("")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="p-4 bg-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Absensi</h1>
            <p className="text-slate-400">
              {currentTime.toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">
              {currentTime.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="text-sm text-slate-400">Waktu Real-time</div>
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="flex justify-between gap-2">
          {weeklyAttendance.map((day) => (
            <div key={day.day} className="flex-1 text-center">
              <div className="text-xs text-slate-400 mb-1">{day.day}</div>
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold ${
                  day.status === "present"
                    ? "bg-green-500"
                    : day.status === "absent"
                      ? "bg-red-500"
                      : day.status === "upcoming"
                        ? "bg-slate-600"
                        : "bg-slate-700"
                }`}
              >
                {day.date}
              </div>
              <div className="text-xs mt-1">
                {day.status === "present" ? (
                  <CheckCircle size={12} className="text-green-400 mx-auto" />
                ) : day.status === "absent" ? (
                  <XCircle size={12} className="text-red-400 mx-auto" />
                ) : (
                  <Clock size={12} className="text-slate-400 mx-auto" />
                )}
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Today's Schedule */}
      <section className="p-4">
        <h2 className="text-xl font-bold mb-4">Jadwal Hari Ini</h2>
        <div className="space-y-4">
          {todaySchedule.map((session) => (
            <div key={session.id} className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${session.color} flex items-center justify-center text-2xl`}
                  >
                    {session.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{session.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{session.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{session.location}</span>
                      </div>
                    </div>
                    <div className="text-sm text-slate-400 mt-1">Pengajar: {session.instructor}</div>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    session.status === "ongoing"
                      ? "bg-green-500/20 text-green-400"
                      : session.status === "upcoming"
                        ? "bg-blue-500/20 text-blue-400"
                        : session.status === "completed"
                          ? "bg-gray-500/20 text-gray-400"
                          : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {session.status === "ongoing"
                    ? "Berlangsung"
                    : session.status === "upcoming"
                      ? "Akan Datang"
                      : session.status === "completed"
                        ? "Selesai"
                        : "Terlewat"}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Users size={14} />
                  <span>
                    {session.attendees}/{session.maxAttendees} hadir
                  </span>
                  <div className="w-20 bg-slate-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                      style={{ width: `${(session.attendees / session.maxAttendees) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {session.canCheckIn && (
                  <button
                    onClick={() => handleCheckIn(session.id)}
                    disabled={selectedEkskul === session.id}
                    className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                      selectedEkskul === session.id
                        ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-emerald-400 text-white hover:from-green-600 hover:to-emerald-500"
                    }`}
                  >
                    {selectedEkskul === session.id ? "Memproses..." : "Absen Masuk"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Attendance Stats */}
      <section className="p-4">
        <h2 className="text-xl font-bold mb-4">Statistik Kehadiran</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">85%</div>
              <div className="text-sm text-slate-400 mt-1">Tingkat Kehadiran</div>
              <div className="text-xs text-slate-500 mt-1">Bulan ini</div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">12</div>
              <div className="text-sm text-slate-400 mt-1">Hari Berturut</div>
              <div className="text-xs text-slate-500 mt-1">Streak terbaik</div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">24</div>
              <div className="text-sm text-slate-400 mt-1">Total Sesi</div>
              <div className="text-xs text-slate-500 mt-1">Bulan ini</div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">3</div>
              <div className="text-sm text-slate-400 mt-1">Tidak Hadir</div>
              <div className="text-xs text-slate-500 mt-1">Bulan ini</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
