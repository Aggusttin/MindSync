import { 
  collection, 
  addDoc, 
  getDocs, 
  Timestamp,
  doc,
  setDoc,
  getDoc,
  orderBy,
  query,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { db } from "./firebase"; 
import { Evento, Job, AuthData, Grupo, Recurso } from "./types"; 

const USERS_COLLECTION = "users";
const EVENTS_COLLECTION = "events";
const JOBS_COLLECTION = "jobs";
const GROUPS_COLLECTION = "groups";
const RESOURCES_COLLECTION = "resources"; 

export const registerUserInDB = async (userData: AuthData) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userData.email);
    await setDoc(userRef, {
      email: userData.email,
      name: userData.name || '',
      userType: userData.userType, 
      institutionName: userData.institutionName || null,
      createdAt: Timestamp.now(),
      onboardingCompleted: false 
    });
  } catch (error) {
    console.error("Error registrando usuario:", error);
    throw error;
  }
};

export const getUserDataFromDB = async (email: string) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, email);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) return docSnap.data() as AuthData; 
    return null;
  } catch (error) {
    console.error("Error obteniendo datos:", error);
    throw error;
  }
};

export const createEventInDB = async (eventData: any) => {
  const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
    ...eventData, attendees: 0, attendeeIds: [], status: 'publicado', createdAt: Timestamp.now()
  });
  return { id: docRef.id, ...eventData, attendees: 0, attendeeIds: [], status: 'publicado' };
};

export const getEventsFromDB = async (): Promise<Evento[]> => {
  const q = query(collection(db, EVENTS_COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as Evento[];
};

export const createJobInDB = async (jobData: any) => {
  const docRef = await addDoc(collection(db, JOBS_COLLECTION), {
    ...jobData, applicants: 0, applicantIds: [], status: 'activo', postedDate: new Date().toISOString().split('T')[0], createdAt: Timestamp.now()
  });
  return { id: docRef.id, ...jobData, applicants: 0, applicantIds: [], status: 'activo' };
};

export const getJobsFromDB = async (): Promise<Job[]> => {
  const q = query(collection(db, JOBS_COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as Job[];
};

export const createGroupInDB = async (groupData: any) => {
  try {
    const initialMembers = groupData.creatorId ? [groupData.creatorId] : [];
    const { creatorId, ...cleanData } = groupData; // Limpiamos creatorId antes de guardar
    
    const docRef = await addDoc(collection(db, GROUPS_COLLECTION), {
      ...cleanData,
      members: 1, 
      memberIds: initialMembers,
      createdAt: Timestamp.now()
    });
    return { id: docRef.id, ...cleanData, members: 1, memberIds: initialMembers };
  } catch (error) {
    console.error("Error creando grupo:", error);
    throw error;
  }
};

export const getGroupsFromDB = async (): Promise<Grupo[]> => {
  const q = query(collection(db, GROUPS_COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as Grupo[];
};

export const getResourcesFromDB = async (): Promise<Recurso[]> => {
  const q = query(collection(db, RESOURCES_COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as Recurso[];
};

// --- FUNCIONES CLAVE DE INTERACCIÓN ---

export const toggleEventRegistrationInDB = async (eventId: string, userId: string, isRegistering: boolean) => {
  try {
    const ref = doc(db, EVENTS_COLLECTION, eventId);
    if (isRegistering) {
      await updateDoc(ref, { attendees: increment(1), attendeeIds: arrayUnion(userId) });
    } else {
      await updateDoc(ref, { attendees: increment(-1), attendeeIds: arrayRemove(userId) });
    }
    return true;
  } catch (error) {
    console.error("Error toggle evento:", error); return false;
  }
};

export const toggleJobApplicationInDB = async (jobId: string, userId: string, isApplying: boolean) => {
  try {
    const ref = doc(db, JOBS_COLLECTION, jobId);
    if (isApplying) {
      await updateDoc(ref, { applicants: increment(1), applicantIds: arrayUnion(userId) });
    } else {
      await updateDoc(ref, { applicants: increment(-1), applicantIds: arrayRemove(userId) });
    }
    return true;
  } catch (error) {
    console.error("Error toggle vacante:", error); return false;
  }
};

export const toggleGroupMembershipInDB = async (groupId: string, userId: string, isJoining: boolean) => {
  try {
    const ref = doc(db, GROUPS_COLLECTION, groupId);
    if (isJoining) {
      await updateDoc(ref, { members: increment(1), memberIds: arrayUnion(userId) });
    } else {
      await updateDoc(ref, { members: increment(-1), memberIds: arrayRemove(userId) });
    }
    return true;
  } catch (error) {
    console.error("Error toggle grupo:", error); return false;
  }
};