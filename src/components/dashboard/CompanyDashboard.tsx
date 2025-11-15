// --- CÓDIGO CORREGIDO ---

import { useState } from 'react';
import {
  Briefcase, Users, TrendingUp, FileText,
  LogOut, Plus, Eye, Volume2, Hand, Target, Bell, Search
} from 'lucide-react';
import { LogoIcon } from '../Logo';
import { AuthData, Job } from '../../lib/types'; // Importación corregida
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { CreateJobDialog } from './CreateJobDialog';
import { CreateEventDialog } from './CreateEventDialog';
import { toast } from 'sonner';

interface Props {
  authData: AuthData;
  onLogout: () => void;
  // Recibe los datos y funciones reales desde App.tsx
  jobs: Job[];
  onAddJob: (data: any) => Promise<boolean>;
  onAddEvent: (data: any) => Promise<boolean>;
}

// YA NO NECESITAMOS EL MOCK 'const jobPostings = [...]'

// Mocks para 'candidates' y 'styleInfo' (se pueden quedar por ahora)
const candidates = [ /* ... */ ];
const styleInfo = { /* ... */ };

// Recibe las props reales
export function CompanyDashboard({ authData, onLogout, jobs, onAddJob, onAddEvent }: Props) {
  const [activeTab, setActiveTab] = useState<'inicio' | 'vacantes' | 'candidatos' | 'eventos'>('inicio');
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  return (
    <>
      {/* Pasa las funciones a los 'onCreate' de los modales */}
      <CreateJobDialog 
        isOpen={isJobDialogOpen} 
        onClose={() => setIsJobDialogOpen(false)} 
        onCreate={onAddJob}
      />
      <CreateEventDialog 
        isOpen={isEventDialogOpen} 
        onClose={() => setIsEventDialogOpen(false)} 
        userType="empresa"
        onCreate={onAddEvent}
      />
    <div className="min-h-screen bg-gray-50">
      {/* ... (Navbar se mantiene igual) ... */}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ... (Welcome y Tabs se mantienen igual) ... */}

        {/* Content */}
        {activeTab === 'inicio' && (
          <div className="space-y-6">
            {/* ... (Stats se mantiene igual) ... */}

            {/* Active Job Postings */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl text-gray-900">Vacantes activas</h2>
                <Button onClick={() => setActiveTab('vacantes')} variant="outline" size="sm">
                  Ver todas
                </Button>
              </div>
              <div className="space-y-3">
                {/* Usa los 'jobs' reales de las props */}
                {jobs.filter(j => j.status === 'activo').slice(0, 3).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <h3 className="text-sm text-gray-900 mb-1">{job.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span>{job.type}</span>
                        <span>•</span>
                        <span>{job.applicants} postulantes</span>
                        <span>•</span>
                        <span className="capitalize">{job.style}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Ver detalles</Button>
                  </div>
                ))}
              </div>
            </div>

            {/* ... (Top Candidates se mantiene igual con mocks) ... */}
          </div>
        )}

        {activeTab === 'vacantes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl text-gray-900">Gestión de vacantes</h2>
              <Button 
                onClick={() => setIsJobDialogOpen(true)}
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:opacity-90 flex items-center gap-2"
              >
                <Plus size={20} />
                Nueva vacante
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Usa los 'jobs' reales de las props */}
              {jobs.map((job) => {
                const StyleIcon = styleInfo[job.style].icon;
                return (
                  <div key={job.id} className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      {/* ... (resto del JSX del job) ... */}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ... (Resto de las pestañas 'candidatos' y 'eventos' se mantienen igual) ... */}
      </div>
    </div>
    </>
  );
}