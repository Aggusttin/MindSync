// src/components/dashboard/CreateEventDialog.tsx

import { useState } from 'react';
import { X, Eye, Volume2, Hand } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Evento } from '../../lib/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userType: 'universidad' | 'empresa';
  // NUEVO: Recibimos el nombre del organizador
  organizerName: string;
  onCreate: (data: Partial<Evento>) => Promise<boolean>; 
}

export function CreateEventDialog({ isOpen, onClose, userType, organizerName, onCreate }: Props) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    capacity: '',
    type: 'visual' as 'visual' | 'auditivo' | 'kinestesico', // Cambiado de 'style' a 'type' para coincidir con la interfaz Evento
    mode: 'presencial' as 'presencial' | 'virtual',
    location: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación simple
    if (!formData.title || !formData.date || !formData.time || !formData.capacity) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    if (formData.mode === 'presencial' && !formData.location) {
      toast.error('Si el evento es presencial, debes indicar la ubicación');
      return;
    }

    setIsLoading(true);
    
    // Preparamos los datos completos
    const eventData = {
      ...formData,
      capacity: parseInt(formData.capacity, 10),
      organizer: organizerName, // Añadimos el organizador aquí
    };

    const success = await onCreate(eventData);

    setIsLoading(false);

    if (success) {
      toast.success('¡Evento creado exitosamente!');
      onClose();
      // Reset form
      setFormData({
        title: '',
        date: '',
        time: '',
        capacity: '',
        type: 'visual',
        mode: 'presencial',
        location: '',
      });
    }
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Fecha *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="time">Hora *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="capacity">Capacidad máxima *</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              placeholder="Ej: 50"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label className="mb-3 block">Estilo de aprendizaje enfocado *</Label>
            <div className="grid grid-cols-3 gap-3">
              {styleOptions.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: style.value as any })}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    formData.type === style.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  <style.icon size={20} className="mx-auto mb-2" />
                  <div className="text-sm text-gray-900">{style.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Modalidad *</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, mode: 'presencial' })}
                className={`p-4 border-2 rounded-xl transition-all ${
                  formData.mode === 'presencial' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                disabled={isLoading}
              >
                <div className="text-sm text-gray-900 font-medium">Presencial</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, mode: 'virtual' })}
                className={`p-4 border-2 rounded-xl transition-all ${
                  formData.mode === 'virtual' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                disabled={isLoading}
              >
                <div className="text-sm text-gray-900 font-medium">Virtual</div>
              </button>
            </div>
          </div>

          {formData.mode === 'presencial' && (
            <div>
              <Label htmlFor="location">Ubicación *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ej: Aula Magna, Edificio A"
                disabled={isLoading}
              />
            </div>
          )}

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