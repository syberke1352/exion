"use client"

import { useState, useEffect } from "react"
import { Plus, Calendar, Users, MapPin, Camera, Save, X, Edit, Trash2 } from "lucide-react"
import { addDocumentation, getDocumentation, updateDocumentation, deleteDocumentation } from "@/lib/firebase-service"
import { CloudinaryUpload } from "@/components/cloudinary-upload"
import type { Documentation } from "@/types"

interface AdminDokumentasiPageProps {
  adminRole: string
}

export default function AdminDokumentasiPage({ adminRole }: AdminDokumentasiPageProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingDoc, setEditingDoc] = useState<Documentation | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newDoc, setNewDoc] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    participants: "",
    image: "",
  })

  const [dokumentasi, setDokumentasi] = useState<Documentation[]>([])

  const getEkskulType = () => {
    switch (adminRole) {
      case "silat_admin":
        return "silat"
      case "robotik_admin": // Fixed typo from "robotics_admin" to "robotik_admin"
        return "robotik"
      case "futsal_admin":
        return "futsal"
      case "band_admin":
        return "band"
      default:
        return ""
    }
  }

  const getEkskulName = () => {
    switch (adminRole) {
      case "silat_admin":
        return "Pencak Silat"
      case "robotik_admin": // Fixed typo from "robotics_admin" to "robotik_admin"
        return "Robotik"
      case "futsal_admin":
        return "Futsal"
      case "band_admin":
        return "Musik"
      default:
        return "Semua Ekstrakurikuler"
    }
  }

  useEffect(() => {
    loadDokumentasi()
  }, [adminRole])

  const loadDokumentasi = async () => {
    try {
      setLoading(true)
      const ekskulType = getEkskulType()
      const data = ekskulType ? await getDocumentation(ekskulType) : await getDocumentation()
      setDokumentasi(data)
    } catch (error) {
      console.error("Error loading documentation:", error)
      alert("Gagal memuat dokumentasi. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddDokumentasi = async () => {
    if (!newDoc.title || !newDoc.description || !newDoc.date) {
      alert("Mohon lengkapi semua field yang wajib diisi")
      return
    }

    try {
      setSaving(true)
      const docData = {
        title: newDoc.title,
        description: newDoc.description,
        ekskulType: getEkskulType(),
        image: newDoc.image,
        photoUrls: newDoc.image ? [newDoc.image] : [],
        date: new Date(newDoc.date),
        location: newDoc.location,
        participants: newDoc.participants,
        createdBy: "admin",
      }

      await addDocumentation(docData)
      await loadDokumentasi()
      resetForm()
      alert("Dokumentasi berhasil ditambahkan!")
    } catch (error) {
      console.error("Error adding documentation:", error)
      alert("Gagal menambahkan dokumentasi. Silakan coba lagi.")
    } finally {
      setSaving(false)
    }
  }

  const handleEditDoc = (doc: Documentation) => {
    setEditingDoc(doc)
    setNewDoc({
      title: doc.title,
      description: doc.description,
      date: doc.date.toISOString().split("T")[0],
      location: doc.location || "",
      participants: doc.participants || "",
      image: doc.image || "",
    })
    setShowAddForm(true)
  }

  const handleUpdateDoc = async () => {
    if (!editingDoc || !newDoc.title || !newDoc.description || !newDoc.date) {
      alert("Mohon lengkapi semua field yang wajib diisi")
      return
    }

    try {
      setSaving(true)
      const updates = {
        title: newDoc.title,
        description: newDoc.description,
        date: new Date(newDoc.date),
        location: newDoc.location,
        participants: newDoc.participants,
        image: newDoc.image,
        photoUrls: newDoc.image ? [newDoc.image] : [],
      }

      await updateDocumentation(editingDoc.id, updates)
      await loadDokumentasi()
      resetForm()
      alert("Dokumentasi berhasil diupdate!")
    } catch (error) {
      console.error("Error updating documentation:", error)
      alert("Gagal mengupdate dokumentasi. Silakan coba lagi.")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteDoc = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus dokumentasi ini?")) return

    try {
      await deleteDocumentation(id)
      await loadDokumentasi()
      alert("Dokumentasi berhasil dihapus!")
    } catch (error) {
      console.error("Error deleting documentation:", error)
      alert("Gagal menghapus dokumentasi. Silakan coba lagi.")
    }
  }

  const resetForm = () => {
    setNewDoc({
      title: "",
      description: "",
      date: "",
      location: "",
      participants: "",
      image: "",
    })
    setShowAddForm(false)
    setEditingDoc(null)
  }

  const handleImageUpload = (url: string) => {
    setNewDoc({ ...newDoc, image: url })
  }

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <span className="text-muted-foreground">Memuat dokumentasi...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dokumentasi {getEkskulName()}</h1>
          <p className="text-muted-foreground">Kelola dokumentasi kegiatan ekstrakurikuler</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Dokumentasi
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl p-6 w-full max-w-2xl border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {editingDoc ? "Edit Dokumentasi" : "Tambah Dokumentasi Baru"}
              </h2>
              <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Judul Kegiatan *</label>
                <input
                  type="text"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  placeholder="Masukkan judul kegiatan"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Deskripsi *</label>
                <textarea
                  value={newDoc.description}
                  onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary h-24 resize-none"
                  placeholder="Deskripsi kegiatan"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Upload Foto</label>
                <CloudinaryUpload
                  folder={`${getEkskulType()}/documentation`}
                  onUploadComplete={(results) => handleImageUpload(results[0].url)}
                  onUploadError={(error) => console.error("Upload error:", error)}
                  accept="image/*"
                  multiple={false}
                />
                {newDoc.image && (
                  <div className="mt-2">
                    <img
                      src={newDoc.image || "/placeholder.svg"}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Tanggal *</label>
                  <input
                    type="date"
                    value={newDoc.date}
                    onChange={(e) => setNewDoc({ ...newDoc, date: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Lokasi</label>
                  <input
                    type="text"
                    value={newDoc.location}
                    onChange={(e) => setNewDoc({ ...newDoc, location: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                    placeholder="Lokasi kegiatan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Jumlah Peserta</label>
                <input
                  type="text"
                  value={newDoc.participants}
                  onChange={(e) => setNewDoc({ ...newDoc, participants: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  placeholder="Contoh: 15 siswa"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={editingDoc ? handleUpdateDoc : handleAddDokumentasi}
                  disabled={saving}
                  className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {saving ? "Menyimpan..." : editingDoc ? "Update" : "Simpan"}
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dokumentasi.map((doc) => (
          <div
            key={doc.id}
            className="bg-card rounded-xl border overflow-hidden hover:border-primary/50 transition-colors"
          >
            <div className="aspect-video bg-muted flex items-center justify-center">
              {doc.image ? (
                <img src={doc.image || "/placeholder.svg"} alt={doc.title} className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-12 h-12 text-muted-foreground" />
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-foreground flex-1">{doc.title}</h3>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => handleEditDoc(doc)}
                    className="p-1 text-blue-500 hover:text-blue-400 hover:bg-blue-500/20 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="p-1 text-destructive hover:text-destructive/80 hover:bg-destructive/20 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{doc.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{doc.date.toLocaleDateString("id-ID")}</span>
                </div>
                {doc.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{doc.location}</span>
                  </div>
                )}
                {doc.participants && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{doc.participants}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {dokumentasi.length === 0 && (
        <div className="text-center py-12">
          <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">Belum Ada Dokumentasi</h3>
          <p className="text-muted-foreground">Tambahkan dokumentasi kegiatan pertama Anda</p>
        </div>
      )}
    </div>
  )
}
