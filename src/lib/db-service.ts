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
  query
} from "firebase/firestore";
import { db } from "./firebase"; 
import { Evento, Job, AuthData, Grupo, Recurso } from "./types"; 

// Nombres de las "carpetas" en la base de datos
const USERS_COLLECTION = "users";
const EVENTS_COLLECTION = "events";
const JOBS_COLLECTION = "jobs";
const GROUPS_COLLECTION = "groups";
const RESOURCES_COLLECTION = "resources"; 

/**
 * Guarda un nuevo usuario en la colección 'users'.
 * CORREGIDO: Ahora guarda 'userType' en lugar de 'role'.
 */
export const registerUserInDB = async (userData: AuthData) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userData.email);
    await setDoc(userRef, {
      email: userData.email,
      name: userData.name || '',
      // --- CORRECCIÓN AQUÍ: Usamos userType ---
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

/**
 * Obtiene los datos de un usuario desde Firestore usando su email.
 */
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

/**
 * Crea un nuevo documento en la colección 'events'.
 */
export const createEventInDB = async (eventData: any) => {
  try {
    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
      ...eventData,
      attendees: 0,
      status: 'publicado',
      createdAt: Timestamp.now()
    });
    return { id: docRef.id, ...eventData, attendees: 0, status: 'publicado' };
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
      status: 'activo',
      postedDate: new Date().toISOString().split('T')[0], 
      createdAt: Timestamp.now()
    });
    return { id: docRef.id, ...jobData, applicants: 0, status: 'activo', postedDate: new Date().toISOString().split('T')[0] };
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