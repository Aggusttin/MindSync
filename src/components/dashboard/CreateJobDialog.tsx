// --- CÓDIGO CORREGIDO ---

import { useState } from 'react';
import { X, Briefcase, MapPin, Eye, Volume2, Hand } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Job } from '../../lib/types'; // Importa el tipo

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // Recibe la función para crear vacantes desde el Dashboard
  onCreate: (data: Partial<Job>) => Promise<boolean>;
}

export function CreateJobDialog({ isOpen, onClose, onCreate }: Props) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Tiempo completo',
    location: '',
    description: '',
    style: 'visual' as 'visual' | 'auditivo' | 'kinestesico',
  });
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.location || !formData.description) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsLoading(true); // Activa el estado de carga
    
    // Llama a la función 'onCreate' (que viene de App.tsx)
    const success = await onCreate(formData);

    setIsLoading(false); // Desactiva el estado de carga

    if (success) {
      toast.success('¡Vacante creada exitosamente!');
      onClose();
      // Reset form
      setFormData({
        title: '',
        type: 'Tiempo completo',
        location: '',
        description: '',
        style: 'visual',
      });
    }
  };

  if (!isOpen) return null;

  const styleOptions = [
    { value: 'visual', label: 'Visual', icon: Eye, color: 'from-blue-500 to-blue-600' },
    { value: 'auditivo', label: 'Auditivo', icon: Volume2, color: 'from-green-500 to-green-600' },
    { value: 'kinestesico', label: 'Kinestésico', icon: Hand, color: 'from-orange-500 to-orange-600' },
  ];

  const jobTypes = ['Tiempo completo', 'Medio tiempo', 'Pasantía', 'Freelance', 'Proyecto'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl text-gray-900">Publicar vacante</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* ... (Todo el JSX del formulario se mantiene igual, pero añade 'disabled={isLoading}' a los inputs) ... */}
          
          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:opacity-90" disabled={isLoading}>
              {isLoading ? "Publicando..." : "Publicar vacante"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}