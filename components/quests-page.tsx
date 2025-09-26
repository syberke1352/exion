export default function QuestsPage() {
  const dailyQuests = [
    {
      id: 1,
      title: "Dapatkan 30 XP",
      description: "Selesaikan latihan untuk mendapatkan XP",
      progress: 15,
      target: 30,
      reward: "💎",
      icon: "⚡",
    },
    {
      id: 2,
      title: "Jawab 5 soal berturut-turut dengan benar",
      description: "Dalam 2 pelajaran",
      progress: 2,
      target: 5,
      reward: "💎",
      icon: "🎯",
    },
    {
      id: 3,
      title: "Skor 90% atau lebih tinggi",
      description: "Dalam 5 pelajaran",
      progress: 1,
      target: 5,
      reward: "🏅",
      icon: "🎖️",
    },
  ]

  const monthlyQuest = {
    title: "Perjalanan Cepat Lin",
    description: "Selesaikan 30 misi",
    progress: 4,
    target: 30,
    daysLeft: 19,
    month: "AGUSTUS",
  }

  const friendQuest = {
    title: "Selesaikan 60 pelajaran",
    progress: 25,
    target: 60,
    timeLeft: "16 jam",
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="p-4 bg-slate-800">
        <div className="flex justify-center gap-8 mb-4">
          <button className="text-white font-bold border-b-2 border-white pb-2">MISI</button>
          <button className="text-slate-400 font-bold pb-2">LENCANA</button>
        </div>
      </header>

      {/* Monthly Quest */}
      <section className="p-4">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 mb-6">
          <div className="bg-white text-red-500 px-3 py-1 rounded-full text-xs font-bold inline-block mb-2">
            {monthlyQuest.month}
          </div>
          <h2 className="text-2xl font-bold mb-2">{monthlyQuest.title}</h2>
          <p className="text-red-100 mb-4">🕐 {monthlyQuest.daysLeft} HARI</p>

          <div className="bg-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold">{monthlyQuest.description}</span>
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">👨‍🎓</div>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-3">
              <div
                className="h-3 bg-red-500 rounded-full"
                style={{ width: `${(monthlyQuest.progress / monthlyQuest.target) * 100}%` }}
              ></div>
            </div>
            <div className="text-right text-sm mt-1 text-slate-300">
              {monthlyQuest.progress} / {monthlyQuest.target}
            </div>
          </div>
        </div>
      </section>

      {/* Daily Quests */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Misi Harian</h2>
          <div className="text-yellow-400 font-bold">⏰ 16 jam</div>
        </div>

        <div className="space-y-4">
          {dailyQuests.map((quest) => (
            <div key={quest.id} className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{quest.icon}</div>
                  <div>
                    <h3 className="font-bold">{quest.title}</h3>
                    <p className="text-slate-400 text-sm">{quest.description}</p>
                  </div>
                </div>
                <div className="text-2xl">{quest.reward}</div>
              </div>

              <div className="w-full bg-slate-600 rounded-full h-2">
                <div
                  className="h-2 bg-green-500 rounded-full"
                  style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                ></div>
              </div>
              <div className="text-right text-sm mt-1 text-slate-300">
                {quest.progress} / {quest.target}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Friend Quest */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Misi Teman</h2>
          <div className="text-slate-400 text-sm">SELANJUTNYA DALAM {friendQuest.timeLeft}</div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">{friendQuest.title}</h3>
            <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">👥</div>
          </div>

          <div className="w-full bg-slate-600 rounded-full h-2">
            <div
              className="h-2 bg-blue-500 rounded-full"
              style={{ width: `${(friendQuest.progress / friendQuest.target) * 100}%` }}
            ></div>
          </div>
          <div className="text-right text-sm mt-1 text-slate-300">
            {friendQuest.progress} / {friendQuest.target}
          </div>
        </div>
      </section>
    </div>
  )
}
