// --- CÓDIGO CORREGIDO: db-service.ts ---

import { 
  collection, 
  addDoc, 
  getDocs, 
  Timestamp,
  doc,
  setDoc,
  getDoc, // Importante para leer usuarios
  orderBy,
  query
} from "firebase/firestore";
import { db } from "./firebase"; // Asume que firebase.ts exporta 'db'
import { Evento, Job, AuthData, Grupo, Recurso } from "./types"; // Importa todos los tipos

// Nombres de las "carpetas" en la base de datos
const USERS_COLLECTION = "users";
const EVENTS_COLLECTION = "events";
const JOBS_COLLECTION = "jobs";
const GROUPS_COLLECTION = "groups"; // Añadido
const RESOURCES_COLLECTION = "resources"; // Añadido

/**
 * Guarda un nuevo usuario en la colección 'users'.
 * Usa el email como ID para evitar duplicados.
 */
export const registerUserInDB = async (userData: AuthData) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userData.email);
    await setDoc(userRef, {
      email: userData.email,
      name: userData.name || '',
      role: userData.userType,
      institutionName: userData.institutionName || null,
      createdAt: Timestamp.now(),
      onboardingCompleted: false // Valor inicial
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
      return docSnap.data() as AuthData; // Devuelve los datos del usuario
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
    // Devuelve el objeto completo para actualizar el estado local
    return { id: docRef.id, ...eventData, attendees: 0, status: 'publicado' };
  } catch (error) {
    console.error("Error creando evento:", error);
    throw new Error("Error en Firebase al crear evento.");
  }
};

/**
 * Obtiene todos los eventos de la base de datos, ordenados por fecha de creación (nuevos primero).
 */
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

/**
 * Crea un nuevo documento en la colección 'jobs'.
 */
export const createJobInDB = async (jobData: any) => {
  try {
    const docRef = await addDoc(collection(db, JOBS_COLLECTION), {
      ...jobData,
      applicants: 0,
      status: 'activo',
      postedDate: new Date().toISOString().split('T')[0], // "YYYY-MM-DD"
      createdAt: Timestamp.now()
    });
    return { id: docRef.id, ...jobData, applicants: 0, status: 'activo', postedDate: new Date().toISOString().split('T')[0] };
  } catch (error) {
    console.error("Error publicando vacante:", error);
    throw new Error("Error en Firebase al crear vacante.");
  }
};

/**
 * Obtiene todas las vacantes de la base de datos, ordenadas por fecha de creación.
 */
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

/**
 * Obtiene todos los grupos de la base de datos, ordenados por fecha de creación.
 */
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

/**
 * Obtiene todos los recursos de la base de datos, ordenados por fecha de creación.
 */
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