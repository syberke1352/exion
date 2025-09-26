export default function LeaderboardPage() {
  const leaderboardData = [
    { rank: 1, name: "Ahmad Rizki", avatar: "👨‍🎓", xp: 2450, badge: "🏆", ekskul: "Robotik", attendance: "98%" },
    { rank: 2, name: "Sari Dewi", avatar: "👩‍🎓", xp: 2180, badge: "🥈", ekskul: "Musik", attendance: "95%" },
    { rank: 3, name: "Budi Santoso", avatar: "👨‍💻", xp: 1950, badge: "🥉", ekskul: "Futsal", attendance: "92%" },
    { rank: 4, name: "Dewi Lestari", avatar: "👩‍🎨", xp: 1720, badge: "", ekskul: "Silat", attendance: "90%" },
    { rank: 5, name: "Riko Pratama", avatar: "👨‍🎵", xp: 1580, badge: "", ekskul: "Musik", attendance: "88%" },
    { rank: 6, name: "Maya Sari", avatar: "👩‍⚽", xp: 1450, badge: "", ekskul: "Futsal", attendance: "85%" },
    { rank: 7, name: "Andi Wijaya", avatar: "👨‍🥋", xp: 1320, badge: "", ekskul: "Silat", attendance: "83%" },
    { rank: 8, name: "Lina Marlina", avatar: "👩‍🔬", xp: 1180, badge: "", ekskul: "Robotik", attendance: "80%" },
    { rank: 9, name: "Doni Setiawan", avatar: "👨‍🎯", xp: 1050, badge: "", ekskul: "Futsal", attendance: "78%" },
    { rank: 10, name: "Rina Wati", avatar: "👩‍🎪", xp: 920, badge: "", ekskul: "Musik", attendance: "75%" },
  ]

  const ekskulColors = {
    Robotik: "from-blue-500 to-cyan-400",
    Silat: "from-red-500 to-orange-400",
    Futsal: "from-green-500 to-emerald-400",
    Musik: "from-purple-500 to-pink-400",
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="p-4 bg-slate-800">
        <h1 className="text-2xl font-bold text-center">Liga Ekstrakurikuler</h1>
        <p className="text-center text-slate-400 mt-1">Ranking berdasarkan XP dan kehadiran</p>
        <p className="text-center text-yellow-400 font-bold">Update setiap hari</p>
      </header>

      {/* League Badges */}
      <section className="p-4">
        <div className="flex justify-center gap-2 mb-6">
          {["🥉", "🥈", "🏆", "💎", "🏅"].map((badge, index) => (
            <div
              key={index}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${
                index === 2 ? "bg-gradient-to-b from-yellow-400 to-yellow-600 shadow-lg" : "bg-slate-700"
              }`}
            >
              {badge}
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="px-4">
        <div className="space-y-3">
          {leaderboardData.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center justify-between p-4 rounded-2xl ${
                user.rank <= 3
                  ? "bg-gradient-to-r from-slate-700 to-slate-600 border border-yellow-500/30"
                  : "bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    user.rank === 1
                      ? "bg-yellow-500 text-black"
                      : user.rank === 2
                        ? "bg-gray-400 text-black"
                        : user.rank === 3
                          ? "bg-orange-500 text-black"
                          : "bg-slate-600 text-white"
                  }`}
                >
                  {user.rank}
                </div>
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${ekskulColors[user.ekskul as keyof typeof ekskulColors]} flex items-center justify-center text-2xl`}
                >
                  {user.avatar}
                </div>
                <div>
                  <div className="font-bold">{user.name}</div>
                  <div className="text-sm text-slate-400">
                    {user.ekskul} • {user.attendance}
                  </div>
                  {user.badge && <span className="text-lg">{user.badge}</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-yellow-400">{user.xp} XP</div>
                <div className="text-xs text-slate-400">Kehadiran {user.attendance}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
