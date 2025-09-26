import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"
import type { Member, Documentation, Achievement, Attendance, Schedule } from "@/types"

// Members
export const addMember = async (member: Omit<Member, "id" | "createdAt" | "updatedAt">) => {
  const docRef = await addDoc(collection(db, "members"), {
    ...member,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export const updateMember = async (id: string, updates: Partial<Member>) => {
  const docRef = doc(db, "members", id)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}

export const deleteMember = async (id: string) => {
  await deleteDoc(doc(db, "members", id))
}

export const getMembers = async (ekskulType?: string) => {
  let q = query(collection(db, "members"), orderBy("createdAt", "desc"))

  if (ekskulType) {
    q = query(collection(db, "members"), where("ekskulType", "==", ekskulType), orderBy("createdAt", "desc"))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Member)
}

// Documentation
export const addDocumentation = async (doc: Omit<Documentation, "id" | "createdAt" | "updatedAt">) => {
  const docRef = await addDoc(collection(db, "documentation"), {
    ...doc,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export const updateDocumentation = async (id: string, updates: Partial<Documentation>) => {
  const docRef = doc(db, "documentation", id)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}

export const deleteDocumentation = async (id: string) => {
  await deleteDoc(doc(db, "documentation", id))
}

export const getDocumentation = async (ekskulType?: string) => {
  let q = query(collection(db, "documentation"), orderBy("createdAt", "desc"))

  if (ekskulType) {
    q = query(collection(db, "documentation"), where("ekskulType", "==", ekskulType), orderBy("createdAt", "desc"))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Documentation)
}

export const addAchievement = async (achievement: Omit<Achievement, "id" | "createdAt" | "updatedAt">) => {
  const docRef = await addDoc(collection(db, "achievements"), {
    ...achievement,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export const updateAchievement = async (id: string, updates: Partial<Achievement>) => {
  const docRef = doc(db, "achievements", id)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}

export const deleteAchievement = async (id: string) => {
  await deleteDoc(doc(db, "achievements", id))
}

export const getAchievements = async (ekskulType?: string) => {
  let q = query(collection(db, "achievements"), orderBy("createdAt", "desc"))

  if (ekskulType) {
    q = query(collection(db, "achievements"), where("ekskulType", "==", ekskulType), orderBy("createdAt", "desc"))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Achievement)
}

export const addAttendance = async (attendance: Omit<Attendance, "id" | "createdAt">) => {
  const docRef = await addDoc(collection(db, "attendance"), {
    ...attendance,
    createdAt: Timestamp.now(),
  })
  return docRef.id
}

export const updateAttendance = async (id: string, updates: Partial<Attendance>) => {
  const docRef = doc(db, "attendance", id)
  await updateDoc(docRef, updates)
}

export const deleteAttendance = async (id: string) => {
  await deleteDoc(doc(db, "attendance", id))
}

export const getAttendance = async (ekskulType?: string, memberId?: string) => {
  let q = query(collection(db, "attendance"), orderBy("createdAt", "desc"))

  if (ekskulType && memberId) {
    q = query(
      collection(db, "attendance"),
      where("ekskulType", "==", ekskulType),
      where("memberId", "==", memberId),
      orderBy("createdAt", "desc"),
    )
  } else if (ekskulType) {
    q = query(collection(db, "attendance"), where("ekskulType", "==", ekskulType), orderBy("createdAt", "desc"))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Attendance)
}

export const addSchedule = async (schedule: Omit<Schedule, "id" | "createdAt" | "updatedAt">) => {
  const docRef = await addDoc(collection(db, "schedules"), {
    ...schedule,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export const updateSchedule = async (id: string, updates: Partial<Schedule>) => {
  const docRef = doc(db, "schedules", id)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}

export const deleteSchedule = async (id: string) => {
  await deleteDoc(doc(db, "schedules", id))
}

export const getSchedules = async (ekskulType?: string) => {
  let q = query(collection(db, "schedules"), orderBy("date", "asc"))

  if (ekskulType) {
    q = query(collection(db, "schedules"), where("ekskulType", "==", ekskulType), orderBy("date", "asc"))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Schedule)
}

export const getMemberById = async (id: string): Promise<Member | null> => {
  try {
    const docRef = doc(db, "members", id)
    const docSnap = await getDocs(query(collection(db, "members"), where("__name__", "==", id)))
    if (!docSnap.empty) {
      const memberDoc = docSnap.docs[0]
      return { id: memberDoc.id, ...memberDoc.data() } as Member
    }
    return null
  } catch (error) {
    console.error("Error getting member:", error)
    return null
  }
}

export const getActiveMembers = async (ekskulType?: string) => {
  let q = query(collection(db, "members"), where("status", "==", "active"), orderBy("createdAt", "desc"))

  if (ekskulType) {
    q = query(
      collection(db, "members"),
      where("ekskulType", "==", ekskulType),
      where("status", "==", "active"),
      orderBy("createdAt", "desc"),
    )
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Member)
}

export const getRecentDocumentation = async (ekskulType?: string, limit = 10) => {
  let q = query(collection(db, "documentation"), orderBy("createdAt", "desc"))

  if (ekskulType) {
    q = query(collection(db, "documentation"), where("ekskulType", "==", ekskulType), orderBy("createdAt", "desc"))
  }

  const snapshot = await getDocs(q)
  const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Documentation)
  return docs.slice(0, limit)
}
