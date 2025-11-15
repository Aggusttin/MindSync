// --- CÓDIGO CORREGIDO: StudentDashboard.tsx ---

import { useState } from 'react';
import { 
  Users, Calendar, BookOpen, Briefcase, Settings, 
  LogOut, Eye, Volume2, Hand, TrendingUp, Bell,
  Search, Filter, MapPin, Video, Plus // Importa el icono Plus
} from 'lucide-react';
import { LogoIcon } from '../Logo';
// Importa todos los tipos de datos que recibirá
import { OnboardingData, AuthData, Evento, Job, Grupo, Recurso } from '../../lib/types';
import { CreateGroupDialog } from './CreateGroupDialog'; // Importa el nuevo diálogo
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

interface Props {
  userData: OnboardingData | null;
  authData: AuthData;
  onLogout: () => void;
  // Recibe todos los datos reales como props
  allEvents: Evento[];
  allJobs: Job[];
  allGroups: Grupo[];
  allResources: Recurso[];
  onAddGroup: (data: any) => Promise<boolean>; // Recibe la función de crear
}

// --- TODOS LOS DATOS DE MAQUETA FUERON ELIMINADOS ---

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
  onAddGroup // Recibe la función
}: Props) {
  const [activeTab, setActiveTab] = useState<'inicio' | 'grupos' | 'eventos' | 'empleos' | 'recursos'>('inicio');
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false); // Estado para el diálogo

  const userStyle = userData?.learningStyle || 'visual';
  const StyleIcon = styleInfo[userStyle].icon;

  // Calcula los contadores dinámicamente
  const groupsCount = allGroups.length;
  const eventsCount = allEvents.length;
  const resourcesCount = allResources.length;
  const jobsCount = allJobs.length;

  return (
    <>
      {/* Renderiza el diálogo de creación de grupo */}
      <CreateGroupDialog 
        isOpen={isGroupDialogOpen} 
        onClose={() => setIsGroupDialogOpen(false)} 
        onCreate={onAddGroup} 
      />

      <div className="min-h-screen bg-gray-50">
        {/* ... (Navbar se mantiene igual) ... */}

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* ... (Welcome y Tabs se mantienen igual) ... */}

          {/* Content based on active tab */}
          {activeTab === 'inicio' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Stats */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <Users className="text-blue-500 mb-2" size={24} />
                  <div className="text-2xl text-gray-900 mb-1">{groupsCount}</div> {/* DINÁMICO */}
                  <div className="text-sm text-gray-600">Grupos activos</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <Calendar className="text-purple-500 mb-2" size={24} />
                  <div className="text-2xl text-gray-900 mb-1">{eventsCount}</div> {/* DINÁMICO */}
                  <div className="text-sm text-gray-600">Eventos próximos</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <BookOpen className="text-green-500 mb-2" size={24} />
                  <div className="text-2xl text-gray-900 mb-1">{resourcesCount}</div> {/* DINÁMICO */}
                  <div className="text-sm text-gray-600">Recursos guardados</div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <Briefcase className="text-orange-500 mb-2" size={24} />
                  <div className="text-2xl text-gray-900 mb-1">{jobsCount}</div> {/* DINÁMICO */}
                  <div className="text-sm text-gray-600">Ofertas laborales</div>
                </div>
              </div>

              {/* Compatible Groups Preview */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl text-gray-900">Grupos compatibles</h2>
                    <button onClick={() => setActiveTab('grupos')} className="text-purple-600 text-sm hover:text-purple-700">
                      Ver todos
                    </button>
                  </div>
                  <div className="space-y-3">
                    {/* Mapea sobre los datos reales de 'allGroups' */}
                    {allGroups.slice(0, 3).map((group) => {
                      const GroupStyleIcon = styleInfo[group.style].icon;
                      return (
                        <div key={group.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-sm text-gray-900">{group.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {group.members}/{group.maxMembers}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <GroupStyleIcon size={14} />
                            <span>{styleInfo[group.style].name}</span>
                            <span>•</span>
                            <MapPin size={14} />
                            <span>{group.location}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Upcoming Events */}
              <div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl text-gray-900">Próximos eventos</h2>
                    <button onClick={() => setActiveTab('eventos')} className="text-purple-600 text-sm hover:text-purple-700">
                      Ver todos
                    </button>
                  </div>
                  <div className="space-y-3">
                    {/* Mapea sobre los datos reales de 'allEvents' */}
                    {allEvents.slice(0, 3).map((event) => (
                      <div key={event.id} className="p-3 bg-gray-50 rounded-xl">
                        <h3 className="text-sm text-gray-900 mb-2">{event.title}</h3>
                        <div className="text-xs text-gray-600">
                          {new Date(event.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })} • {event.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'grupos' && (
            <div>
              <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                {/* Contenedor de búsqueda y filtro */}
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
                
                {/* Botón de Crear Grupo */}
                <Button 
                  onClick={() => setIsGroupDialogOpen(true)}
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:opacity-90 flex items-center gap-2 w-full sm:w-auto"
                >
                  <Plus size={20} />
                  Crear grupo
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mapea sobre los datos reales de 'allGroups' */}
                {allGroups.map((group) => {
                  const GroupStyleIcon = styleInfo[group.style].icon;
                  return (
                    <div key={group.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg text-gray-900 mb-2">{group.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <GroupStyleIcon size={16} />
                            <span>{styleInfo[group.style].name}</span>
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

                      <Button 
                        onClick={() => toast.success(`¡Solicitud enviada al grupo "${group.name}"!`)}
                        className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:opacity-90"
                      >
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
              {/* Mapea sobre los datos reales de 'allEvents' */}
              {allEvents.map((event) => {
                const EventStyleIcon = styleInfo[event.type].icon;
                return (
                  <div key={event.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className={`w-12 h-12 bg-gradient-to-br ${styleInfo[event.type].color} rounded-xl flex items-center justify-center mb-4`}>
                      <EventStyleIcon size={24} className="text-white" />
                    </div>
                    
                    <h3 className="text-lg text-gray-900 mb-2">{event.title}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="text-sm text-gray-600">
                        {new Date(event.date).toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-sm text-gray-600">{event.time}</div>
                      <div className="text-sm text-gray-600">Por: {event.organizer}</div>
                      <Badge variant="outline" className="text-xs">
                        {event.mode === 'presencial' ? 'Presencial' : 'Virtual'}
                      </Badge>
                    </div>

                    <Button 
                      onClick={() => toast.success(`¡Te has inscrito a "${event.title}"!`)}
                      className="w-full" 
                      variant="outline"
                    >
                      Inscribirse
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'empleos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mapea sobre los datos reales de 'allJobs' */}
              {allJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg text-gray-900 mb-1">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                    </div>
                    <Badge variant="secondary">{job.type}</Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {(() => {
                        const JobStyleIcon = styleInfo[job.style].icon;
                        return <JobStyleIcon size={16} />;
                      })()}
                      <span>Compatible con perfil {styleInfo[job.style].name}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => toast.info(`Detalles de "${job.title}" en ${job.company} (función en desarrollo)`)}
                    className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:opacity-90"
                  >
                    Ver detalles
                  </Button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'recursos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Mapea sobre los datos reales de 'allResources' */}
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
      </div>
    </>
  );
}