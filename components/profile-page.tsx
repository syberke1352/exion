export default function ProfilePage() {
  const userStats = {
    name: "Ahmad",
    username: "ahmad123",
    joinDate: "Bergabung Agustus 2024",
    friends: 12,
    dayStreak: 7,
    totalXP: 2450,
    league: "Emas",
    weekNumber: 1,
    topFinishes: 3,
  }

  const friendSuggestions = [
    { name: "Sari Dewi", avatar: "👩‍🎓", mutualFriends: 3 },
    { name: "Budi Santoso", avatar: "👨‍💻", mutualFriends: 5 },
    { name: "Maya Putri", avatar: "👩‍🎨", mutualFriends: 2 },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-slate-800">
        <h1 className="text-xl font-bold text-slate-400">Profil</h1>
        <button className="text-slate-400">⚙️</button>
      </header>

      {/* Profile Card */}
      <section className="p-4">
        <div className="bg-slate-700 rounded-2xl p-6 relative">
          <button className="absolute top-4 right-4 w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
            ✏️
          </button>

          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center text-4xl mb-4">
              👨‍🎓
            </div>
            <h2 className="text-2xl font-bold">{userStats.name}</h2>
            <p className="text-slate-400">{userStats.username}</p>
            <p className="text-slate-400 text-sm mt-1">{userStats.joinDate}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-blue-400 font-bold">{userStats.friends} Teman</span>
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">🇮🇩</div>
            </div>
          </div>
        </div>
      </section>

      {/* Friend Updates */}
      <section className="px-4 mb-6">
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🎉</div>
              <span className="font-bold">Update teman</span>
            </div>
            <div className="text-slate-400">›</div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="px-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Statistik</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-orange-400">🔥</div>
              <span className="font-bold text-2xl">{userStats.dayStreak}</span>
            </div>
            <p className="text-slate-400 text-sm">Hari beruntun</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-yellow-400">⚡</div>
              <span className="font-bold text-2xl">{userStats.totalXP}</span>
            </div>
            <p className="text-slate-400 text-sm">Total XP</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-4 relative">
            <div className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold absolute top-2 right-2">
              MINGGU {userStats.weekNumber}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-yellow-400">🏆</div>
              <span className="font-bold text-2xl">{userStats.league}</span>
            </div>
            <p className="text-slate-400 text-sm">Liga</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-gray-400">🏅</div>
              <span className="font-bold text-2xl">{userStats.topFinishes}</span>
            </div>
            <p className="text-slate-400 text-sm">Top 3 finish</p>
          </div>
        </div>
      </section>

      {/* Friend Suggestions */}
      <section className="px-4">
        <h2 className="text-xl font-bold mb-4">Saran teman</h2>
        <div className="space-y-3">
          {friendSuggestions.map((friend, index) => (
            <div key={index} className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                    {friend.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold">{friend.name}</h3>
                    <p className="text-slate-400 text-sm">{friend.mutualFriends} teman bersama</p>
                  </div>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-600 transition-colors">
                  IKUTI
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
