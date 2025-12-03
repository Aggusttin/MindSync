import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  organizerName: string; 
  userType: 'universidad' | 'empresa';
  onCreate: (data: any) => Promise<boolean>;
}

export function CreateEventDialog({ isOpen, onClose, organizerName, userType, onCreate }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    capacity: '',
    type: 'visual',
    mode: 'presencial',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.title || !formData.date || !formData.time || !formData.capacity) {
      toast.error("Por favor completa los campos obligatorios (Título, Fecha, Hora, Capacidad)");
      return;
    }
    if (formData.mode === 'presencial' && !formData.location) {
      toast.error("Si es presencial, debes indicar la ubicación");
      return;
    }

    setIsLoading(true);
    try {
      const eventData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        organizer: organizerName,
        organizerType: userType,
      };

      const success = await onCreate(eventData);
      
      if (success) {
        setFormData({
            title: '',
            date: '',
            time: '',
            capacity: '',
            type: 'visual',
            mode: 'presencial',
            location: '',
        });
        onClose();
      }
      
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* CLAVE: max-h-[90vh] y overflow-y-auto permiten el scroll */}
      <DialogContent className="sm:max-w-[500px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear nuevo evento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título del evento *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Taller de Liderazgo"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Fecha *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacidad *</Label>
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
            <div className="grid gap-2">
              <Label htmlFor="type">Estilo de aprendizaje</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visual">Visual</SelectItem>
                  <SelectItem value="auditivo">Auditivo</SelectItem>
                  <SelectItem value="kinestesico">Kinestésico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Modalidad</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="presencial"
                  checked={formData.mode === 'presencial'}
                  onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                  disabled={isLoading}
                />
                <span>Presencial</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="virtual"
                  checked={formData.mode === 'virtual'}
                  onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                  disabled={isLoading}
                />
                <span>Virtual</span>
              </label>
            </div>
          </div>

          {formData.mode === 'presencial' && (
            <div className="grid gap-2">
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

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary text-white hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear evento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}