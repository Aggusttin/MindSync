import { useState } from 'react';
import { ArrowLeft, ArrowRight, Users, Video, MapPin, Sparkles, Tag } from 'lucide-react';
import { OnboardingData } from './OnboardingFlow';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

const interestOptions = [
  'Programación', 'Matemáticas', 'Física', 'Química', 'Biología', 'Historia',
  'Literatura', 'Arte', 'Música', 'Deportes', 'Idiomas', 'Economía',
  'Psicología', 'Filosofía', 'Ingeniería', 'Medicina', 'Derecho',
  'Arquitectura', 'Diseño', 'Marketing',
];

interface Props {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Preferences({ data, updateData, onNext, onBack }: Props) {
  const [interests, setInterests] = useState<string[]>(data.interests);
  const [groupPreference, setGroupPreference] = useState<OnboardingData['groupPreference']>(data.groupPreference);

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleNext = () => {
    if (interests.length < 3) {
      toast.error("Selecciona al menos 3 temas de interés");
      return;
    }
    if (!groupPreference) {
      toast.error("Selecciona tu preferencia de grupo");
      return;
    }
    updateData({ interests, groupPreference });
    onNext();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Preferencias de aprendizaje</h2>
            <p className="text-gray-600">Ayúdanos a conectarte con los grupos y recursos adecuados.</p>
          </div>

          <div className="mb-10">
            <Label className="flex items-center gap-2 mb-4 text-lg font-semibold">
              <Tag size={20} className="text-gray-500" />
              Temas de interés (elige 3 o más)
            </Label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map(interest => (
                <Badge
                  key={interest}
                  variant={interests.includes(interest) ? 'default' : 'outline'}
                  className={`cursor-pointer px-4 py-2 text-sm transition-all rounded-full ${
                    interests.includes(interest)
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'hover:border-primary'
                  }`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <Label className="flex items-center gap-2 mb-4 text-lg font-semibold">
              <Users size={20} className="text-gray-500" />
              ¿Cómo prefieres formar grupos? *
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button type="button" onClick={() => setGroupPreference('presencial')}
                className={`p-6 rounded-2xl border-2 text-center cursor-pointer transition-all ${groupPreference === 'presencial' ? 'border-primary bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <MapPin className="text-green-600 mx-auto" size={24} />
                <h3 className="text-lg font-semibold text-gray-900 mt-2">Presencial</h3>
              </button>
              <button type="button" onClick={() => setGroupPreference('virtual')}
                className={`p-6 rounded-2xl border-2 text-center cursor-pointer transition-all ${groupPreference === 'virtual' ? 'border-primary bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <Video className="text-blue-600 mx-auto" size={24} />
                <h3 className="text-lg font-semibold text-gray-900 mt-2">Virtual</h3>
              </button>
              <button type="button" onClick={() => setGroupPreference('ambos')}
                className={`p-6 rounded-2xl border-2 text-center cursor-pointer transition-all ${groupPreference === 'ambos' ? 'border-primary bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <Sparkles className="text-purple-600 mx-auto" size={24} />
                <h3 className="text-lg font-semibold text-gray-900 mt-2">Ambos</h3>
              </button>
            </div>
          </div>

          <div className="flex justify-between gap-4 mt-8">
            <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={20} /> Atrás
            </Button>
            <Button onClick={handleNext} className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
              Ver resultados <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}