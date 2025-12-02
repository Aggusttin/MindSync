// src/lib/types.ts

export type UserRole = 'estudiante' | 'universidad' | 'empresa';

export interface AuthData {
  email: string;
  password?: string;
  userType: UserRole;
  name?: string;
  institutionName?: string;
  // Agregamos esto para saber si ya completó el test
  onboardingCompleted?: boolean;
  // Esto es CRÍTICO: permite que el objeto tenga propiedades extra (como learningStyle) sin dar error
  [key: string]: any; 
}

export interface OnboardingData {
  learningStyle: 'visual' | 'auditivo' | 'kinestesico' | null;
  testAnswers: string[];
  name: string;
  email: string;
  career: string;
  university: string;
  location: string;
  interests: string[];
  groupPreference: 'presencial' | 'virtual' | 'ambos' | null;
  onboardingCompleted?: boolean;
}

export interface Evento {
  id: string | number;
  title: string;
  date: string;
  time: string;
  capacity: number;
  attendees: number;
  type: 'visual' | 'auditivo' | 'kinestesico';
  mode: 'presencial' | 'virtual';
  organizer: string;
  status: 'publicado' | 'borrador';
  location?: string;
}

export interface Job {
  id: string | number;
  title: string;
  company: string;
  type: string;
  location: string;
  style: 'visual' | 'auditivo' | 'kinestesico';
  status: 'activo' | 'pausado' | 'borrador';
  applicants: number;
  postedDate: string;
  description?: string;
}

export interface Grupo {
  id: string | number;
  name: string;
  members: number;
  maxMembers: number;
  style: 'visual' | 'auditivo' | 'kinestesico';
  mode: 'presencial' | 'virtual';
  location?: string;
  schedule: string;
  topics: string[];
}

export interface Recurso {
  id: string | number;
  title: string;
  type: string;
  provider: string;
  style: 'visual' | 'auditivo' | 'kinestesico';
}

export type LearningStyle = 'visual' | 'auditivo' | 'kinestesico';
export type GroupMode = 'presencial' | 'virtual';