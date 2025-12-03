import { useState } from 'react';
import { X, Users, MapPin, Video, Eye, Volume2, Hand, BookCopy, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Grupo, LearningStyle, GroupMode } from '../../lib/types'; 

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: Partial<Grupo>) => Promise<boolean>;
}

export function CreateGroupDialog({ isOpen, onClose, onCreate }: Props) {
  const [formData, setFormData] = useState({ name: '', maxMembers: '', style: 'visual' as LearningStyle, mode: 'presencial' as GroupMode, location: '', schedule: '', topics: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.maxMembers || !formData.schedule || !formData.topics) { toast.error('Completa los campos obligatorios'); return; }
    
    setIsLoading(true);
    const topicsArray = formData.topics.split(',').map(topic => topic.trim());
    const success = await onCreate({ ...formData, maxMembers: parseInt(formData.maxMembers, 10), topics: topicsArray });
    setIsLoading(false);

    if (success) {
      toast.success('¡Grupo creado!');
      onClose();
      setFormData({ name: '', maxMembers: '', style: 'visual', mode: 'presencial', location: '', schedule: '', topics: '' });
    }
  };

  if (!isOpen) return null;

  const styleOptions = [
    { value: 'visual', label: 'Visual', icon: Eye },
    { value: 'auditivo', label: 'Auditivo', icon: Volume2 },
    { value: 'kinestesico', label: 'Kinestésico', icon: Hand },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl text-gray-900">Crear nuevo grupo</h2>
          <button onClick={onClose} disabled={isLoading}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div><Label>Nombre *</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={isLoading} /></div>
          <div><Label>Temas (coma) *</Label><Input value={formData.topics} onChange={(e) => setFormData({ ...formData, topics: e.target.value })} disabled={isLoading} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Horario *</Label><Input value={formData.schedule} onChange={(e) => setFormData({ ...formData, schedule: e.target.value })} disabled={isLoading} /></div>
            <div><Label>Miembros máx *</Label><Input type="number" min="2" value={formData.maxMembers} onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })} disabled={isLoading} /></div>
          </div>
          <div>
            <Label className="mb-2 block">Estilo *</Label>
            <div className="grid grid-cols-3 gap-3">
              {styleOptions.map((s) => (
                <button key={s.value} type="button" onClick={() => setFormData({ ...formData, style: s.value as any })} className={`p-4 border-2 rounded-xl ${formData.style === s.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`} disabled={isLoading}>
                  <s.icon size={20} className="mx-auto mb-2" /><div className="text-sm">{s.label}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4"><Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button><Button type="submit" className="flex-1 bg-primary text-white" disabled={isLoading}>{isLoading ? "Creando..." : "Crear grupo"}</Button></div>
        </form>
      </div>
    </div>
  );
}