// --- CÓDIGO CORREGIDO ---

import { useState } from 'react';
import { X, Calendar, Clock, MapPin, Users, Eye, Volume2, Hand } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Evento } from '../../lib/types'; // Importa el tipo

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userType: 'universidad' | 'empresa';
  // Recibe la función para crear eventos desde el Dashboard
  onCreate: (data: Partial<Evento>) => Promise<boolean>; 
}

export function CreateEventDialog({ isOpen, onClose, userType, onCreate }: Props) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    capacity: '',
    style: 'visual' as 'visual' | 'auditivo' | 'kinestesico',
    mode: 'presencial' as 'presencial' | 'virtual',
    location: '',
  });
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.time || !formData.capacity) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsLoading(true); // Activa el estado de carga
    
    // Llama a la función 'onCreate' (que viene de App.tsx)
    const success = await onCreate({
      ...formData,
      capacity: parseInt(formData.capacity, 10), // Asegura que 'capacity' sea un número
    });

    setIsLoading(false); // Desactiva el estado de carga

    if (success) {
      toast.success('¡Evento creado exitosamente!');
      onClose();
      // Reset form
      setFormData({
        title: '',
        date: '',
        time: '',
        capacity: '',
        style: 'visual',
        mode: 'presencial',
        location: '',
      });
    }
    // Si 'success' es falso, el hook useSystemState ya habrá mostrado un toast de error
  };

  if (!isOpen) return null;

  const styleOptions = [
    { value: 'visual', label: 'Visual', icon: Eye, color: 'from-blue-500 to-blue-600' },
    { value: 'auditivo', label: 'Auditivo', icon: Volume2, color: 'from-green-500 to-green-600' },
    { value: 'kinestesico', label: 'Kinestésico', icon: Hand, color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl text-gray-900">Crear nuevo evento</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* ... (Todo el JSX del formulario se mantiene igual) ... */}
          
          {/* Ejemplo de campo 'title' (se mantiene igual) */}
          <div>
            <Label htmlFor="title">Título del evento *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Workshop de Aprendizaje Visual"
              disabled={isLoading}
            />
          </div>

          {/* ... (Todos los demás campos del formulario aquí, añade 'disabled={isLoading}') ... */}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:opacity-90" disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear evento"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}