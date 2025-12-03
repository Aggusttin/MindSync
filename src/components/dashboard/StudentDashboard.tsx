// src/components/dashboard/StudentDashboard.tsx

import { useState } from 'react';
import { 
  Users, Calendar, BookOpen, Briefcase, 
  Eye, Volume2, Hand, Search, Filter, MapPin, Video, Plus, CheckCircle2 
} from 'lucide-react';
import { OnboardingData, AuthData, Evento, Job, Grupo, Recurso } from '../../lib/types';
import { CreateGroupDialog } from './CreateGroupDialog';
import { JobDetailsDialog } from './JobDetailsDialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';

interface Props {
  userData: OnboardingData | null;
  authData: AuthData;
  onLogout: () => void;
  allEvents: Evento[];
  allJobs: Job[];
  allGroups: Grupo[];
  allResources: Recurso[];
  onAddGroup: (data: any) => Promise<boolean>;
  onToggleEvent: (eventId: string | number, userId: string, isRegistering: boolean) => Promise<void>;
  onToggleJob: (jobId: string | number, userId: string, isApplying: boolean) => Promise<void>;
}

const styleInfo = {
  visual: { icon: Eye, color: 'from-blue-500 to-blue-600', name: 'Visual' },
  auditivo: { icon: Volume2, color: 'from-green-500 to-green-600', name: 'Auditivo' },
  kinestesico: { icon: Hand, color: 'from-orange-500 to-orange-600', name: 'Kinestésico' },
};

export function StudentDashboard({ 
  userData, 
  authData, 
  onLogout, 
  allEvents, 
  allJobs, 
  allGroups, 
  allResources,
  onAddGroup,
  onToggleEvent,
  onToggleJob
}: Props) {
  const [activeTab, setActiveTab] = useState<'inicio' | 'grupos' | 'eventos' | 'empleos' | 'recursos'>('inicio');
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const userStyle = userData?.learningStyle || 'visual';
  const userId = authData.email; 

  const handleEventAction = (event: Evento) => {
    const isRegistered = event.attendeeIds?.includes(userId);
    onToggleEvent(event.id, userId, !isRegistered);
  };

  return (
    <>
      <CreateGroupDialog 
        isOpen={isGroupDialogOpen} 
        onClose={() => setIsGroupDialogOpen(false)} 
        onCreate={onAddGroup} 
      />

      <JobDetailsDialog 
        isOpen={!!selectedJob} 
        onClose={() => setSelectedJob(null)} 
        job={selectedJob}
        userId={userId}
        onToggleJob={onToggleJob}
      />

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar onLogout={onLogout} userName={authData.name} />

        <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Hola, {authData.name?.split(' ')[0]} 👋
            </h1>
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-1">
              {['inicio', 'grupos', 'eventos', 'empleos', 'recursos'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'inicio' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <Users className="text-blue-500 mb-2" size={24} />
                    <div className="text-2xl text-gray-900 mb-1">{allGroups.length}</div>
                    <div className="text-sm text-gray-600">Grupos activos</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <Calendar className="text-purple-500 mb-2" size={24} />
                    <div className="text-2xl text-gray-900 mb-1">{allEvents.length}</div>
                    <div className="text-sm text-gray-600">Eventos próximos</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <BookOpen className="text-green-500 mb-2" size={24} />
                    <div className="text-2xl text-gray-900 mb-1">{allResources.length}</div>
                    <div className="text-sm text-gray-600">Recursos guardados</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-gray-200">
                    <Briefcase className="text-orange-500 mb-2" size={24} />
                    <div className="text-2xl text-gray-900 mb-1">{allJobs.length}</div>
                    <div className="text-sm text-gray-600">Ofertas laborales</div>
                  </div>
               </div>
               
               <div className="lg:col-span-3"> 
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl text-gray-900">Próximos eventos</h2>
                    <button onClick={() => setActiveTab('eventos')} className="text-purple-600 text-sm hover:text-purple-700">Ver todos</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {allEvents.slice(0, 3).map((event) => {
                      const isRegistered = event.attendeeIds?.includes(userId);
                      return (
                        <div key={event.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-between h-full">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-1">{event.title}</h3>
                            <div className="text-xs text-gray-600 mb-3">
                              {new Date(event.date).toLocaleDateString()} • {event.attendees} asistentes
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant={isRegistered ? "destructive" : "default"}
                            className={`w-full h-8 text-xs ${isRegistered ? 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200' : 'bg-primary text-white'}`}
                            onClick={() => handleEventAction(event)}
                          >
                            {isRegistered ? "Anular inscripción" : "Inscribirse"}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'grupos' && (
            <div>
              <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex-1 flex gap-4 w-full">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input placeholder="Buscar grupos..." className="pl-10" />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter size={20} />
                    Filtrar
                  </Button>
                </div>
                <Button 
                  onClick={() => setIsGroupDialogOpen(true)}
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:opacity-90 flex items-center gap-2 w-full sm:w-auto"
                >
                  <Plus size={20} />
                  Crear grupo
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allGroups.map((group) => (
                    <div key={group.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg text-gray-900 mb-2">{group.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{styleInfo[group.style] ? styleInfo[group.style].name : group.style}</span>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {group.members}/{group.maxMembers} miembros
                        </Badge>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {group.mode === 'presencial' ? <MapPin size={16} /> : <Video size={16} />}
                          <span>{group.mode === 'presencial' ? group.location : 'Virtual'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} />
                          <span>{group.schedule}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {group.topics.map((topic, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      <Button onClick={() => toast.success(`¡Solicitud enviada al grupo "${group.name}"!`)} className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:opacity-90">
                        Unirse al grupo
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'eventos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allEvents.map((event) => {
                const EventStyleIcon = styleInfo[event.type].icon;
                const isRegistered = event.attendeeIds?.includes(userId);

                return (
                  <div key={event.id} className={`bg-white rounded-2xl p-6 border transition-shadow hover:shadow-lg ${isRegistered ? 'border-green-200 ring-1 ring-green-100' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${styleInfo[event.type].color} rounded-xl flex items-center justify-center`}>
                        <EventStyleIcon size={24} className="text-white" />
                      </div>
                      {isRegistered && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Inscrito</Badge>}
                    </div>
                    
                    <h3 className="text-lg text-gray-900 font-semibold mb-2">{event.title}</h3>
                    
                    <div className="space-y-2 mb-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2"><Calendar size={14}/> {new Date(event.date).toLocaleDateString()}</div>
                      <div className="flex items-center gap-2"><Users size={14}/> {event.attendees} / {event.capacity} cupos</div>
                    </div>

                    <Button 
                      onClick={() => handleEventAction(event)}
                      className={`w-full ${isRegistered ? 'bg-white border-red-200 text-red-600 hover:bg-red-50' : 'bg-primary text-white'}`} 
                      variant={isRegistered ? "outline" : "default"}
                    >
                      {isRegistered ? "Anular inscripción" : "Inscribirse"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'empleos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allJobs.map((job) => {
                const isApplied = job.applicantIds?.includes(userId);
                return (
                  <div key={job.id} className={`bg-white rounded-2xl p-6 border transition-shadow hover:shadow-lg ${isApplied ? 'border-green-200 ring-1 ring-green-100' : 'border-gray-200'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg text-gray-900 mb-1 font-semibold">{job.title}</h3>
                        <p className="text-gray-600">{job.company}</p>
                      </div>
                      {isApplied ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 gap-1">
                          <CheckCircle2 size={12}/> Postulado
                        </Badge>
                      ) : (
                        <Badge variant="secondary">{job.type}</Badge>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} /> <span>{job.location}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => setSelectedJob(job)}
                      className={`w-full ${isApplied ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 text-white hover:opacity-90'}`}
                      variant={isApplied ? "ghost" : "default"}
                    >
                      {isApplied ? "Ver detalles de postulación" : "Ver detalles y postular"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'recursos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allResources.map((resource) => {
                const ResourceStyleIcon = styleInfo[resource.style].icon;
                return (
                  <div key={resource.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className={`w-12 h-12 bg-gradient-to-br ${styleInfo[resource.style].color} rounded-xl flex items-center justify-center mb-4`}>
                      <ResourceStyleIcon size={24} className="text-white" />
                    </div>
                    <h3 className="text-lg text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{resource.type}</p>
                    <p className="text-sm text-gray-500 mb-4">Por: {resource.provider}</p>
                    <Button className="w-full" variant="outline">
                      Acceder
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

        </div>
        <Footer />
      </div>
    </>
  );
}