"use client"

import { useState } from "react"
import { Plus, User, Mail, Phone, Save, X, Edit, Trash2 } from "lucide-react"

interface AdminMemberPageProps {
  adminRole: string
}

interface Member {
  id: number
  name: string
  class: string
  email: string
  phone: string
  joinDate: string
  role: string
  status: "active" | "inactive"
}

export default function AdminMemberPage({ adminRole }: AdminMemberPageProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [newMember, setNewMember] = useState({
    name: "",
    class: "",
    email: "",
    phone: "",
    joinDate: "",
    role: "Anggota",
    status: "active" as "active" | "inactive",
  })

  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      name: "Ahmad Rizki",
      class: "XII IPA 1",
      email: "ahmad.rizki@email.com",
      phone: "081234567890",
      joinDate: "2024-01-15",
      role: "Ketua",
      status: "active",
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      class: "XI IPS 2",
      email: "siti.nur@email.com",
      phone: "081234567891",
      joinDate: "2024-01-20",
      role: "Sekretaris",
      status: "active",
    },
    {
      id: 3,
      name: "Budi Santoso",
      class: "X MIPA 3",
      email: "budi.santoso@email.com",
      phone: "081234567892",
      joinDate: "2024-02-01",
      role: "Anggota",
      status: "active",
    },
  ])

  const getEkskulName = () => {
    switch (adminRole) {
      case "admin-silat":
        return "Pencak Silat"
      case "admin-robotik":
        return "Robotik"
      case "admin-futsal":
        return "Futsal"
      case "admin-musik":
        return "Musik"
      default:
        return "Semua Ekstrakurikuler"
    }
  }

  const handleAddMember = () => {
    if (newMember.name && newMember.class && newMember.joinDate) {
      const member: Member = {
        id: Date.now(),
        ...newMember,
      }
      setMembers([...members, member])
      resetForm()
    }
  }

  const handleEditMember = (member: Member) => {
    setEditingMember(member)
    setNewMember({
      name: member.name,
      class: member.class,
      email: member.email,
      phone: member.phone,
      joinDate: member.joinDate,
      role: member.role,
      status: member.status,
    })
    setShowAddForm(true)
  }

  const handleUpdateMember = () => {
    if (editingMember && newMember.name && newMember.class && newMember.joinDate) {
      setMembers(members.map((m) => (m.id === editingMember.id ? { ...editingMember, ...newMember } : m)))
      resetForm()
    }
  }

  const handleDeleteMember = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus member ini?")) {
      setMembers(members.filter((m) => m.id !== id))
    }
  }

  const resetForm = () => {
    setNewMember({
      name: "",
      class: "",
      email: "",
      phone: "",
      joinDate: "",
      role: "Anggota",
      status: "active",
    })
    setShowAddForm(false)
    setEditingMember(null)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Member {getEkskulName()}</h1>
          <p className="text-slate-400">Kelola data anggota ekstrakurikuler</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Member
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editingMember ? "Edit Member" : "Tambah Member Baru"}</h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-green-500"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Kelas</label>
                  <input
                    type="text"
                    value={newMember.class}
                    onChange={(e) => setNewMember({ ...newMember, class: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-green-500"
                    placeholder="Contoh: XII IPA 1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-green-500"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">No. Telepon</label>
                  <input
                    type="tel"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-green-500"
                    placeholder="081234567890"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tanggal Bergabung</label>
                  <input
                    type="date"
                    value={newMember.joinDate}
                    onChange={(e) => setNewMember({ ...newMember, joinDate: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Jabatan</label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="Ketua">Ketua</option>
                    <option value="Wakil Ketua">Wakil Ketua</option>
                    <option value="Sekretaris">Sekretaris</option>
                    <option value="Bendahara">Bendahara</option>
                    <option value="Anggota">Anggota</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                  <select
                    value={newMember.status}
                    onChange={(e) => setNewMember({ ...newMember, status: e.target.value as "active" | "inactive" })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={editingMember ? handleUpdateMember : handleAddMember}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {editingMember ? "Update" : "Simpan"}
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Nama</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Kelas</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Jabatan</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Kontak</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{member.name}</div>
                        <div className="text-slate-400 text-sm">
                          Bergabung: {new Date(member.joinDate).toLocaleDateString("id-ID")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{member.class}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">{member.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-300 text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="w-4 h-4" />
                        {member.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {member.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        member.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {member.status === "active" ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditMember(member)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {members.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">Belum Ada Member</h3>
          <p className="text-slate-500">Tambahkan member pertama untuk ekstrakurikuler ini</p>
        </div>
      )}
    </div>
  )
}
