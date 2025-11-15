import { useState } from 'react';
import { ArrowLeft, ArrowRight, User, Mail, GraduationCap, Building2, MapPin } from 'lucide-react';
import { OnboardingData } from './OnboardingFlow';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Props {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PersonalInfo({ data, updateData, onNext, onBack }: Props) {
  const [formData, setFormData] = useState({
    name: data.name,
    email: data.email,
    career: data.career,
    university: data.university,
    location: data.location,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Por favor ingresa tu nombre';
    if (!formData.email.trim()) newErrors.email = 'Por favor ingresa tu email';
    if (!formData.career.trim()) newErrors.career = 'Por favor ingresa tu carrera';
    if (!formData.university.trim()) newErrors.university = 'Por favor ingresa tu universidad';
    if (!formData.location.trim()) newErrors.location = 'Por favor ingresa tu ubicación';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      updateData(formData);
      onNext();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Información personal</h2>
            <p className="text-gray-600">Cuéntanos sobre ti para personalizar tu experiencia.</p>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="flex items-center gap-2 mb-2"><User size={18} />Nombre completo</Label>
              <Input id="name" placeholder="Ej: María García" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="email" className="flex items-center gap-2 mb-2"><Mail size={18} />Email</Label>
              <Input id="email" type="email" placeholder="tu.email@ejemplo.com" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} disabled />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="career" className="flex items-center gap-2 mb-2"><GraduationCap size={18} />Carrera</Label>
              <Input id="career" placeholder="Ej: Ingeniería en Software" value={formData.career} onChange={(e) => handleChange('career', e.target.value)} />
              {errors.career && <p className="text-sm text-red-500 mt-1">{errors.career}</p>}
            </div>
            <div>
              <Label htmlFor="university" className="flex items-center gap-2 mb-2"><Building2 size={18} />Universidad</Label>
              <Input id="university" placeholder="Ej: Universidad Siglo 21" value={formData.university} onChange={(e) => handleChange('university', e.target.value)} />
              {errors.university && <p className="text-sm text-red-500 mt-1">{errors.university}</p>}
            </div>
            <div>
              <Label htmlFor="location" className="flex items-center gap-2 mb-2"><MapPin size={18} />Ubicación</Label>
              <Input id="location" placeholder="Ej: Córdoba, Argentina" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} />
              {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
            </div>
          </div>

          <div className="flex justify-between gap-4 mt-8">
            <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={20} /> Atrás
            </Button>
            <Button onClick={handleNext} className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
              Continuar <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}