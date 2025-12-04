import { useState } from 'react';
import { X, MapPin, Video, Eye, Volume2, Hand } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { Grupo, LearningStyle, GroupMode } from '../../lib/types'; 

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: Partial<Grupo>) => Promise<boolean>;
}

export function CreateGroupDialog({ isOpen, onClose, onCreate }: Props) {
  // Estados separados para día y hora para facilitar la entrada
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    maxMembers: '',
    style: 'visual' as LearningStyle,
    mode: 'presencial' as GroupMode,
    location: '',
    topics: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.name || !formData.maxMembers || !day || !time || !formData.topics) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }
    
    if (formData.mode === 'presencial' && !formData.location) {
      toast.error('Si es presencial, debes indicar la ubicación');
      return;
    }

    setIsLoading(true);
    
    // Construimos el string de horario combinando día y hora
    const scheduleString = `${day} ${time}hs`;
    
    const topicsArray = formData.topics.split(',').map(topic => topic.trim());
    
    const success = await onCreate({
      ...formData,
      schedule: scheduleString, // Usamos el horario combinado
      maxMembers: parseInt(formData.maxMembers, 10),
      topics: topicsArray,
    });

    setIsLoading(false);

    if (success) {
      toast.success('¡Grupo creado exitosamente!');
      onClose();
      // Resetear formulario
      setFormData({ name: '', maxMembers: '', style: 'visual', mode: 'presencial', location: '', topics: '' });
      setDay('');
      setTime('');
    }
  };

  if (!isOpen) return null;

  const styleOptions = [
    { value: 'visual', label: 'Visual', icon: Eye },
    { value: 'auditivo', label: 'Auditivo', icon: Volume2 },
    { value: 'kinestesico', label: 'Kinestésico', icon: Hand },
  ];

  const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl text-gray-900 font-bold">Crear nuevo grupo</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del grupo *</Label>
            <Input 
              id="name" 
              placeholder="Ej: Grupo de Matemáticas Avanzadas" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              disabled={isLoading} 
            />
          </div>

          {/* Temas */}
          <div className="space-y-2">
            <Label htmlFor="topics">Temas (separados por coma) *</Label>
            <Input 
              id="topics" 
              placeholder="Ej: Álgebra, Cálculo, Geometría" 
              value={formData.topics} 
              onChange={(e) => setFormData({ ...formData, topics: e.target.value })} 
              disabled={isLoading} 
            />
          </div>

          {/* Horario (Día y Hora separados) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Día *</Label>
              <Select value={day} onValueChange={setDay} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el día" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Hora *</Label>
              <Input 
                id="time" 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
                disabled={isLoading} 
                className="block"
              />
            </div>
          </div>

          {/* Miembros máximos */}
          <div className="space-y-2">
            <Label htmlFor="maxMembers">Miembros máximos *</Label>
            <Input 
              id="maxMembers" 
              type="number" 
              min="2" 
              placeholder="Ej: 5" 
              value={formData.maxMembers} 
              onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })} 
              disabled={isLoading} 
            />
          </div>

          {/* Modalidad (Radio Buttons visuales) */}
          <div className="space-y-2">
            <Label>Modalidad *</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, mode: 'presencial' })}
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${
                  formData.mode === 'presencial' 
                    ? 'border-primary bg-purple-50 text-primary' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <MapPin size={24} className="mb-2" />
                <span className="font-medium">Presencial</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, mode: 'virtual' })}
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${
                  formData.mode === 'virtual' 
                    ? 'border-primary bg-purple-50 text-primary' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Video size={24} className="mb-2" />
                <span className="font-medium">Virtual</span>
              </button>
            </div>
          </div>

          {/* Ubicación (Condicional) */}
          {formData.mode === 'presencial' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label htmlFor="location">Ubicación (Aula / Dirección) *</Label>
              <Input 
                id="location" 
                placeholder="Ej: Biblioteca Central, Mesa 4" 
                value={formData.location} 
                onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                disabled={isLoading} 
              />
            </div>
          )}

          {/* Estilo de Aprendizaje */}
          <div className="space-y-2">
            <Label>Estilo de aprendizaje principal *</Label>
            <div className="grid grid-cols-3 gap-3">
              {styleOptions.map((s) => (
                <button 
                  key={s.value} 
                  type="button" 
                  onClick={() => setFormData({ ...formData, style: s.value as LearningStyle })} 
                  className={`flex flex-col items-center p-3 border-2 rounded-xl transition-all ${
                    formData.style === s.value 
                      ? 'border-primary bg-purple-50 text-primary' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-500'
                  }`} 
                  disabled={isLoading}
                >
                  <s.icon size={20} className="mb-1" />
                  <div className="text-xs font-medium">{s.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-white hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear grupo"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}