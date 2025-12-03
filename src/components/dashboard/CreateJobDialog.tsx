// src/components/dashboard/CreateJobDialog.tsx

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea'; // Asegúrate de tener este componente, si no usa Input
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => Promise<boolean>;
  companyName: string; // Nuevo: Recibimos el nombre de la empresa
}

export function CreateJobDialog({ isOpen, onClose, onCreate, companyName }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Tiempo completo',
    location: '',
    description: '',
    style: 'visual',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.title || !formData.location || !formData.description) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsLoading(true);

    try {
      // Preparamos los datos incluyendo el nombre de la empresa
      const jobData = {
        ...formData,
        company: companyName, // Guardamos quién publica
      };
      
      const success = await onCreate(jobData);

      if (success) {
        toast.success('¡Vacante creada exitosamente!');
        // Reset del formulario
        setFormData({
          title: '',
          type: 'Tiempo completo',
          location: '',
          description: '',
          style: 'visual',
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
      {/* CORRECCIÓN VISUAL CLAVE:
          Agregamos 'max-h-[90vh]' y 'overflow-y-auto' para evitar que se corte el contenido
          y permitir hacer scroll si la pantalla es pequeña.
      */}
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Publicar nueva vacante</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          
          {/* Título */}
          <div className="grid gap-2">
            <Label htmlFor="title">Título del puesto *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Desarrollador Frontend Jr."
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tipo de contrato */}
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo de contrato</Label>
              <Select
                value={formData.type}
                onValueChange={(val) => setFormData({ ...formData, type: val })}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tiempo completo">Tiempo completo</SelectItem>
                  <SelectItem value="Medio tiempo">Medio tiempo</SelectItem>
                  <SelectItem value="Pasantía">Pasantía</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estilo de aprendizaje sugerido */}
            <div className="grid gap-2">
              <Label htmlFor="style">Perfil ideal</Label>
              <Select
                value={formData.style}
                onValueChange={(val) => setFormData({ ...formData, style: val })}
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

          {/* Ubicación */}
          <div className="grid gap-2">
            <Label htmlFor="location">Ubicación *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ej: Remoto / Buenos Aires"
              disabled={isLoading}
            />
          </div>

          {/* Descripción */}
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción del puesto *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe las responsabilidades y requisitos..."
              className="min-h-[100px]"
              disabled={isLoading}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary text-white hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Publicando..." : "Publicar vacante"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}