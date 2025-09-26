import { Clock, Users } from "lucide-react"

interface EkskulCardProps {
  ekskul: {
    id: string
    name: string
    description: string
    color: string
    icon: string
    progress: number
    level: number
    xp: number
    nextSession: string
    members: number
    status: string
  }
}

export default function EkskulCard({ ekskul }: EkskulCardProps) {
  return (
    <div className="bg-slate-800 rounded-2xl p-4 lg:p-6 border border-slate-700 hover:border-slate-600 hover:shadow-lg transition-all duration-300 cursor-pointer">
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-r ${ekskul.color} flex items-center justify-center text-2xl lg:text-3xl shadow-lg`}
          >
            {ekskul.icon}
          </div>
          <div>
            <h3 className="font-bold text-lg lg:text-xl">{ekskul.name}</h3>
            <p className="text-slate-400 text-sm lg:text-base">{ekskul.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Level {ekskul.level}</div>
          <div className="text-sm lg:text-base font-bold text-yellow-400">{ekskul.xp} XP</div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3 lg:mb-4 text-sm text-slate-400">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{ekskul.nextSession}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={14} />
          <span>{ekskul.members} anggota</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-700 rounded-full h-2 lg:h-3 mb-2">
        <div
          className={`h-2 lg:h-3 rounded-full bg-gradient-to-r ${ekskul.color} transition-all duration-500`}
          style={{ width: `${ekskul.progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-xs lg:text-sm text-slate-400">{ekskul.progress}% progress</div>
        <div
          className={`text-xs lg:text-sm px-2 py-1 rounded-full font-medium ${
            ekskul.status === "active" ? "bg-green-500/20 text-green-400" : "bg-slate-600 text-slate-400"
          }`}
        >
          {ekskul.status === "active" ? "Aktif" : "Tidak Aktif"}
        </div>
      </div>
    </div>
  )
}
