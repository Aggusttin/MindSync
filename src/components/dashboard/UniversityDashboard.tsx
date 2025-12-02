import { useState } from 'react';
import { Plus, Eye, Volume2, Hand } from 'lucide-react';
import { AuthData, Evento } from '../../lib/types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CreateEventDialog } from './CreateEventDialog';
// --- NUEVOS IMPORTS ---
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';

interface Props {
  authData: AuthData;
  onLogout: () => void;
  events: Evento[];
  onAddEvent: (data: any) => Promise<boolean>;
}

const styleStats = {
  visual: { count: 450, percentage: 35, icon: Eye, color: 'from-blue-500 to-blue-600' },
  auditivo: { count: 380, percentage: 30, icon: Volume2, color: 'from-green-500 to-green-600' },
  kinestesico: { count: 420, percentage: 35, icon: Hand, color: 'from-orange-500 to-orange-600' },
};

export function UniversityDashboard({ authData, onLogout, events, onAddEvent }: Props) {
  const [activeTab, setActiveTab] = useState<'inicio' | 'eventos' | 'estudiantes' | 'analytics'>('inicio');
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  return (
    <>
      <CreateEventDialog 
        isOpen={isEventDialogOpen} 
        onClose={() => setIsEventDialogOpen(false)} 
        userType="universidad"
        onCreate={onAddEvent} 
      />
      
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* --- NAVBAR --- */}
        <Navbar onLogout={onLogout} userName={authData.institutionName || authData.name} />

        <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
          {/* Header del Dashboard */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Panel de {authData.institutionName}
            </h1>
            <p className="text-gray-600 mb-6">Gestiona eventos y visualiza estadísticas de tus estudiantes.</p>
            
            {/* Tabs simplificados */}
            <div className="flex gap-4 border-b border-gray-200 pb-1">
              <Button variant={activeTab === 'inicio' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('inicio')}>Inicio</Button>
              <Button variant={activeTab === 'eventos' ? 'secondary' : 'ghost'} onClick={() => setActiveTab('eventos')}>Eventos</Button>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'inicio' && (
            <div className="space-y-6">
              {/* Recent Events */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl text-gray-900">Eventos recientes</h2>
                  <Button onClick={() => setActiveTab('eventos')} variant="outline" size="sm">
                    Ver todos
                  </Button>
                </div>
                <div className="space-y-3">
                  {events.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <h3 className="text-sm text-gray-900 mb-1">{event.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span>{new Date(event.date).toLocaleDateString('es-ES')}</span>
                          <span>•</span>
                          <span>{event.attendees}/{event.capacity} asistentes</span>
                        </div>
                      </div>
                      <Badge variant={event.status === 'publicado' ? 'default' : 'secondary'}>
                        {event.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'eventos' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl text-gray-900">Gestión de eventos</h2>
                <Button 
                  onClick={() => setIsEventDialogOpen(true)}
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:opacity-90 flex items-center gap-2"
                >
                  <Plus size={20} />
                  Crear evento
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {events.map((event) => {
                  return (
                    <div key={event.id} className="bg-white rounded-2xl p-6 border border-gray-200 flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                      <Badge>{event.type}</Badge>
                    </div>
                  );
                })}
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