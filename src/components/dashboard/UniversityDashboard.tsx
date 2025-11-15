// --- CÓDIGO CORREGIDO ---

import { useState } from 'react';
import {
  Calendar, Users, TrendingUp, FileText, Settings,
  LogOut, Plus, Eye, Volume2, Hand, BarChart3, Bell
} from 'lucide-react';
import { LogoIcon } from '../Logo';
import { AuthData } from '../../lib/types'; // Importación corregida (asumiendo ubicación)
import { Evento } from '../../lib/types'; // Importa el tipo Evento
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CreateEventDialog } from './CreateEventDialog';
import { toast } from 'sonner';

interface Props {
  authData: AuthData;
  onLogout: () => void;
  // Recibe los datos y funciones reales desde App.tsx
  events: Evento[];
  onAddEvent: (data: any) => Promise<boolean>;
}

// YA NO NECESITAMOS EL MOCK 'const events = [...]'

const styleStats = {
  visual: { count: 450, percentage: 35, icon: Eye, color: 'from-blue-500 to-blue-600' },
  auditivo: { count: 380, percentage: 30, icon: Volume2, color: 'from-green-500 to-green-600' },
  kinestesico: { count: 420, percentage: 35, icon: Hand, color: 'from-orange-500 to-orange-600' },
};

// Recibe las props reales
export function UniversityDashboard({ authData, onLogout, events, onAddEvent }: Props) {
  const [activeTab, setActiveTab] = useState<'inicio' | 'eventos' | 'estudiantes' | 'analytics'>('inicio');
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  return (
    <>
      {/* Pasa la función 'onAddEvent' al 'onCreate' del modal */}
      <CreateEventDialog 
        isOpen={isEventDialogOpen} 
        onClose={() => setIsEventDialogOpen(false)} 
        userType="universidad"
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
            {/* ... (Style Distribution se mantiene igual) ... */}

            {/* Recent Events */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl text-gray-900">Eventos recientes</h2>
                <Button onClick={() => setActiveTab('eventos')} variant="outline" size="sm">
                  Ver todos
                </Button>
              </div>
              <div className="space-y-3">
                {/* Usa los 'events' reales de las props */}
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
              {/* Usa los 'events' reales de las props */}
              {events.map((event) => {
                const StyleIcon = styleStats[event.type].icon;
                return (
                  <div key={event.id} className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      {/* ... (resto del JSX del evento) ... */}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ... (Resto de las pestañas 'estudiantes' y 'analytics' se mantienen igual) ... */}
      </div>
    </div>
    </>
  );
}