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
  visual: { icon: Eye, color: 'from-blue-500 to-blue-600', name: 'Visual', bg: 'bg-blue-100', text: 'text-blue-700' },
  auditivo: { icon: Volume2, color: 'from-green-500 to-green-600', name: 'Auditivo', bg: 'bg-green-100', text: 'text-green-700' },
  kinestesico: { icon: Hand, color: 'from-orange-500 to-orange-600', name: 'Kinestésico', bg: 'bg-orange-100', text: 'text-orange-700' },
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

  // Iconos para las tabs
  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: <Users size={18} /> }, // Usando icono genérico para inicio si no hay uno específico
    { id: 'grupos', label: 'Grupos', icon: <Users size={18} /> },
    { id: 'eventos', label: 'Eventos', icon: <Calendar size={18} /> },
    { id: 'empleos', label: 'Empleos', icon: <Briefcase size={18} /> },
    { id: 'recursos', label: 'Recursos', icon: <BookOpen size={18} /> },
  ];

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
          
          {/* HEADER DE BIENVENIDA */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
              Hola, {authData.name?.split(' ')[0]} <span className="text-2xl">👋</span>
            </h1>
            <p className="text-gray-600 mb-6">
              Tu perfil de aprendizaje: <span className={`font-semibold capitalize text-${userStyle === 'visual' ? 'blue' : userStyle === 'auditivo' ? 'green' : 'orange'}-600`}>{userStyle}</span>
            </p>

            {/* TABS DE NAVEGACIÓN */}
            <div className="flex flex-wrap gap-6 border-b border-gray-200 pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium transition-all border-b-2 ${
                    activeTab === tab.id 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* CONTENIDO PRINCIPAL - INICIO */}
          {activeTab === 'inicio' && (
            <div className="space-y-8">
               {/* 1. TARJETAS DE ESTADÍSTICAS (STATS) */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                        <Users className="text-blue-500" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{allGroups.length}</div>
                    <div className="text-sm text-gray-500">Grupos activos</div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-purple-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                        <Calendar className="text-purple-500" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{allEvents.length}</div>
                    <div className="text-sm text-gray-500">Eventos próximos</div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-green-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                        <BookOpen className="text-green-500" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{allResources.length}</div>
                    <div className="text-sm text-gray-500">Recursos guardados</div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-orange-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                        <Briefcase className="text-orange-500" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{allJobs.length}</div>
                    <div className="text-sm text-gray-500">Ofertas laborales</div>
                  </div>
               </div>
               
               {/* 2. GRID PRINCIPAL (GRUPOS A LA IZQ, EVENTOS A LA DER) */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* COLUMNA IZQUIERDA: GRUPOS COMPATIBLES (Ocupa 2 espacios) */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Grupos compatibles</h2>
                        <button onClick={() => setActiveTab('grupos')} className="text-sm text-purple-600 font-medium hover:text-purple-700">Ver todos</button>
                    </div>
                    
                    <div className="space-y-4">
                        {allGroups.slice(0, 3).map((group) => {
                            const styleData = styleInfo[group.style];
                            const GroupIcon = styleData.icon;
                            return (
                                <div key={group.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-gray-200 transition-colors">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">{group.name}</h3>
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <GroupIcon size={14} className={styleData.text} />
                                                <span>{styleData.name}</span>
                                            </div>
                                            <span>•</span>
                                            <div className="flex items-center gap-1">
                                                <MapPin size={14} />
                                                <span>{group.location || 'Virtual'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-normal">
                                        {group.members}/{group.maxMembers}
                                    </Badge>
                                </div>
                            );
                        })}
                        {allGroups.length === 0 && (
                            <p className="text-gray-500 text-sm italic">No hay grupos disponibles por el momento.</p>
                        )}
                    </div>
                  </div>

                  {/* COLUMNA DERECHA: PRÓXIMOS EVENTOS (Ocupa 1 espacio) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Próximos eventos</h2>
                        <button onClick={() => setActiveTab('eventos')} className="text-sm text-purple-600 font-medium hover:text-purple-700">Ver todos</button>
                    </div>

                    <div className="space-y-4">
                        {allEvents.slice(0, 3).map((event) => (
                            <div key={event.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-gray-200 transition-colors">
                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
                                <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                                    <span className="capitalize">{new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                                    <span>•</span>
                                    <span>{event.time}</span>
                                </div>
                                <Button 
                                    size="sm" 
                                    variant="secondary"
                                    className="w-full bg-gray-50 hover:bg-gray-100 text-gray-900 font-medium h-9"
                                    onClick={() => setActiveTab('eventos')} // O llevar al detalle
                                >
                                    Ver detalles
                                </Button>
                            </div>
                        ))}
                         {allEvents.length === 0 && (
                            <p className="text-gray-500 text-sm italic">No hay eventos próximos.</p>
                        )}
                    </div>
                  </div>

               </div>
            </div>
          )}

          {/* --- OTRAS PESTAÑAS (GRUPOS, EVENTOS, EMPLEOS...) --- */}
          {/* Mantenemos el código anterior para el resto de pestañas, que ya funcionaba bien */}
          
          {activeTab === 'grupos' && (
            <div>
              {/* ... (Código de grupos de la respuesta anterior) ... */}
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
                {allGroups.map((group) => {
                    const styleData = styleInfo[group.style];
                    const GroupIcon = styleData.icon;
                    return (
                        <div key={group.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                            <h3 className="text-lg text-gray-900 mb-2">{group.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <GroupIcon size={16} className={styleData.text}/>
                                <span>{styleData.name}</span>
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
                    );
                })}
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