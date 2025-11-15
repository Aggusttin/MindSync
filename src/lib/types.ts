// Define los "contratos" de datos para toda la app
export type UserRole = 'estudiante' | 'universidad' | 'empresa';

export interface AuthData {
  email: string;
  password?: string;
  userType: UserRole;
  name?: string;
  institutionName?: string;
}

export interface OnboardingData {
  learningStyle: 'visual' | 'auditivo' | 'kinestesico' | null;
  testAnswers: string[]; // Guardamos el valor ('visual', 'auditivo', etc.)
  name: string;
  email: string;
  career: string;
  university: string;
  location: string;
  interests: string[];
  groupPreference: 'presencial' | 'virtual' | 'ambos' | null;
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