// --- NUEVO ARCHIVO: CreateGroupDialog.tsx ---

import { useState } from 'react';
import { X, Users, MapPin, Video, Eye, Volume2, Hand, BookCopy, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Grupo, LearningStyle, GroupMode } from '../../lib/types'; // Importa los tipos

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // Recibirá la función 'addGroup' desde el Dashboard
  onCreate: (data: Partial<Grupo>) => Promise<boolean>;
}

export function CreateGroupDialog({ isOpen, onClose, onCreate }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    maxMembers: '',
    style: 'visual' as LearningStyle,
    mode: 'presencial' as GroupMode,
    location: '',
    schedule: '',
    topics: '', // El usuario escribirá temas separados por coma
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.maxMembers || !formData.schedule || !formData.topics) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsLoading(true);
    
    // Convierte los temas (string) en un array
    const topicsArray = formData.topics.split(',').map(topic => topic.trim());

    const success = await onCreate({
      ...formData,
      maxMembers: parseInt(formData.maxMembers, 10), // Convierte a número
      topics: topicsArray,
    });

    setIsLoading(false);

    if (success) {
      toast.success('¡Grupo creado exitosamente!');
      onClose();
      // Reset form
      setFormData({
        name: '', maxMembers: '', style: 'visual', mode: 'presencial',
        location: '', schedule: '', topics: '',
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
          <h2 className="text-2xl text-gray-900">Crear nuevo grupo</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Nombre del Grupo */}
          <div>
            <Label htmlFor="group-name">Nombre del grupo *</Label>
            <Input
              id="group-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Grupo de Estudio - Matemáticas"
              disabled={isLoading}
            />
          </div>

          {/* Temas */}
          <div>
            <Label htmlFor="topics" className="flex items-center gap-2">
              <BookCopy size={16} />
              Temas (separados por coma) *
            </Label>
            <Input
              id="topics"
              value={formData.topics}
              onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
              placeholder="Ej: Cálculo, Álgebra, Física"
              disabled={isLoading}
            />
          </div>

          {/* Horario y Miembros */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="schedule" className="flex items-center gap-2">
                <Clock size={16} />
                Horario *
              </Label>
              <Input
                id="schedule"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                placeholder="Ej: Lunes 18:00hs"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="maxMembers" className="flex items-center gap-2">
                <Users size={16} />
                Miembros máx. *
              </Label>
              <Input
                id="maxMembers"
                type="number"
                min="2"
                value={formData.maxMembers}
                onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                placeholder="Ej: 10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Estilo de aprendizaje */}
          <div>
            <Label className="mb-3 block">Estilo de aprendizaje del grupo *</Label>
            <div className="grid grid-cols-3 gap-3">
              {styleOptions.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, style: style.value as LearningStyle })}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    formData.style === style.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  <style.icon size={20} className="mx-auto mb-2" />
                  <div className="text-sm text-gray-900">{style.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Modalidad */}
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
                <MapPin size={20} className="mx-auto mb-2 text-gray-700" />
                <div className="text-sm text-gray-900">Presencial</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, mode: 'virtual' })}
                className={`p-4 border-2 rounded-xl transition-all ${
                  formData.mode === 'virtual' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                disabled={isLoading}
              >
                <Video size={20} className="mx-auto mb-2 text-gray-700" />
                <div className="text-sm text-gray-900">Virtual</div>
              </button>
            </div>
          </div>

          {/* Ubicación (Condicional) */}
          {formData.mode === 'presencial' && (
            <div>
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin size={16} />
                Ubicación (si es presencial)
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ej: Biblioteca de la Facultad"
                disabled={isLoading}
              />
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:opacity-90" disabled={isLoading}>
              {isLoading ? "Creando grupo..." : "Crear grupo"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}