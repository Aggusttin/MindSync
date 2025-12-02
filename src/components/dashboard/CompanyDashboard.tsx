import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AuthData, Job } from '../../lib/types';
import { Button } from '../ui/button';
import { CreateJobDialog } from './CreateJobDialog';
import { CreateEventDialog } from './CreateEventDialog';
// --- NUEVOS IMPORTS ---
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';

interface Props {
  authData: AuthData;
  onLogout: () => void;
  jobs: Job[];
  onAddJob: (data: any) => Promise<boolean>;
  onAddEvent: (data: any) => Promise<boolean>;
}

export function CompanyDashboard({ authData, onLogout, jobs, onAddJob, onAddEvent }: Props) {
  const [activeTab, setActiveTab] = useState<'inicio' | 'vacantes'>('inicio');
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  return (
    <>
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
      
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* --- NAVBAR --- */}
        <Navbar onLogout={onLogout} userName={authData.institutionName || authData.name} />

        <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Empresa</h1>
            <p className="text-gray-600 mb-4">Gestiona tus vacantes y eventos para atraer talento.</p>
             <div className="flex gap-4 border-b border-gray-200 pb-1">
              <Button variant={activeTab === 'inicio' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('inicio')}>Inicio</Button>
              <Button variant={activeTab === 'vacantes' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('vacantes')}>Vacantes</Button>
            </div>
          </div>

          {activeTab === 'inicio' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl text-gray-900">Vacantes activas</h2>
                  <Button onClick={() => setActiveTab('vacantes')} variant="outline" size="sm">
                    Ver todas
                  </Button>
                </div>
                <div className="space-y-3">
                  {jobs.filter(j => j.status === 'activo').slice(0, 3).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <h3 className="text-sm text-gray-900 mb-1">{job.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span>{job.type}</span>
                          <span>•</span>
                          <span>{job.applicants} postulantes</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Ver detalles</Button>
                    </div>
                  ))}
                </div>
              </div>
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
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                      <span className="text-sm text-gray-500 capitalize">{job.style}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{job.company} - {job.location}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --- FOOTER --- */}
        <Footer />
      </div>
    </>
  );
}