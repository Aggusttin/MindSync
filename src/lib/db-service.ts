// src/lib/db-service.ts

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
    console.log("Usuario registrado en DB:", userData.email);
  } catch (error) {
    console.error("Error registrando usuario:", error);
    throw new Error("Error en Firebase al registrar usuario.");
  }
};

export const getUserDataFromDB = async (email: string) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, email);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return docSnap.data() as AuthData; 
    } else {
      console.warn("No se encontraron datos para el usuario:", email);
      return null;
    }
  } catch (error) {
    console.error("Error obteniendo datos de usuario:", error);
    throw new Error("Error en Firebase al obtener datos de usuario.");
  }
};

export const createEventInDB = async (eventData: any) => {
  try {
    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
      ...eventData,
      attendees: 0,
      attendeeIds: [],
      status: 'publicado',
      createdAt: Timestamp.now()
    });
    return { id: docRef.id, ...eventData, attendees: 0, attendeeIds: [], status: 'publicado' };
  } catch (error) {
    console.error("Error creando evento:", error);
    throw new Error("Error en Firebase al crear evento.");
  }
};

export const getEventsFromDB = async (): Promise<Evento[]> => {
  try {
    const q = query(collection(db, EVENTS_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as unknown as Evento[];
  } catch (error) {
    console.error("Error obteniendo eventos:", error);
    return [];
  }
};

export const createJobInDB = async (jobData: any) => {
  try {
    const docRef = await addDoc(collection(db, JOBS_COLLECTION), {
      ...jobData,
      applicants: 0,
      applicantIds: [],
      status: 'activo',
      postedDate: new Date().toISOString().split('T')[0], 
      createdAt: Timestamp.now()
    });
    return { id: docRef.id, ...jobData, applicants: 0, applicantIds: [], status: 'activo', postedDate: new Date().toISOString().split('T')[0] };
  } catch (error) {
    console.error("Error publicando vacante:", error);
    throw new Error("Error en Firebase al crear vacante.");
  }
};

export const getJobsFromDB = async (): Promise<Job[]> => {
  try {
    const q = query(collection(db, JOBS_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as unknown as Job[];
  } catch (error) {
    console.error("Error obteniendo vacantes:", error);
    return [];
  }
};

export const createGroupInDB = async (groupData: any) => {
  try {
    const docRef = await addDoc(collection(db, GROUPS_COLLECTION), {
      ...groupData,
      members: 1, 
      createdAt: Timestamp.now()
    });
    return { id: docRef.id, ...groupData, members: 1 };
  } catch (error) {
    console.error("Error creando grupo:", error);
    throw new Error("Error en Firebase al crear grupo.");
  }
};

export const getGroupsFromDB = async (): Promise<Grupo[]> => {
  try {
    const q = query(collection(db, GROUPS_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as unknown as Grupo[];
  } catch (error) {
    console.error("Error obteniendo grupos:", error);
    return [];
  }
};

export const getResourcesFromDB = async (): Promise<Recurso[]> => {
  try {
    const q = query(collection(db, RESOURCES_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as unknown as Recurso[];
  } catch (error) {
    console.error("Error obteniendo recursos:", error);
    return [];
  }
};

// --- NUEVAS FUNCIONES PARA TOGGLE ---

export const toggleEventRegistrationInDB = async (eventId: string, userId: string, isRegistering: boolean) => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    
    if (isRegistering) {
      await updateDoc(eventRef, {
        attendees: increment(1),
        attendeeIds: arrayUnion(userId)
      });
    } else {
      await updateDoc(eventRef, {
        attendees: increment(-1),
        attendeeIds: arrayRemove(userId)
      });
    }
    return true;
  } catch (error) {
    console.error("Error actualizando inscripción al evento:", error);
    return false;
  }
};

export const toggleJobApplicationInDB = async (jobId: string, userId: string, isApplying: boolean) => {
  try {
    const jobRef = doc(db, JOBS_COLLECTION, jobId);
    
    if (isApplying) {
      await updateDoc(jobRef, {
        applicants: increment(1),
        applicantIds: arrayUnion(userId)
      });
    } else {
      await updateDoc(jobRef, {
        applicants: increment(-1),
        applicantIds: arrayRemove(userId)
      });
    }
    return true;
  } catch (error) {
    console.error("Error actualizando postulación a vacante:", error);
    return false;
  }
};