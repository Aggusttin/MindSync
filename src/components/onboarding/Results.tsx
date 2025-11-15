import { ArrowLeft, ArrowRight, Eye, Volume2, Hand, Sparkles, CheckCircle2 } from 'lucide-react';
import { OnboardingData } from './OnboardingFlow';
import { Button } from '../ui/button';
import { LogoIcon } from '../Logo';

interface Props {
  data: OnboardingData;
  onComplete: () => void;
  onBack: () => void;
}

// Información para mostrar en la tarjeta de resultados
const learningStyleInfo = {
  visual: {
    icon: Eye,
    title: 'Aprendiz Visual',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Aprendes mejor a través de imágenes, gráficos y contenido visual.',
    strengths: [
      'Excelente memoria fotográfica',
      'Facilidad para interpretar gráficos y diagramas',
      'Preferencia por material visual organizado',
    ],
    tips: [
      'Usa colores y resaltadores en tus apuntes',
      'Crea mapas mentales y diagramas',
      'Mira videos educativos',
    ],
  },
  auditivo: {
    icon: Volume2,
    title: 'Aprendiz Auditivo',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: 'Tu aprendizaje es más efectivo mediante el sonido y las explicaciones verbales.',
    strengths: [
      'Excelente comprensión oral',
      'Facilidad para recordar conversaciones',
      'Habilidad para explicar conceptos verbalmente',
    ],
    tips: [
      'Graba y escucha tus clases',
      'Explica conceptos en voz alta',
      'Participa en grupos de discusión',
    ],
  },
  kinestesico: {
    icon: Hand,
    title: 'Aprendiz Kinestésico',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    description: 'Aprendes mejor haciendo, con actividades prácticas y experiencias táctiles.',
    strengths: [
      'Excelente en aplicaciones prácticas',
      'Memoria muscular fuerte',
      'Aprendizaje mediante la acción',
    ],
    tips: [
      'Realiza ejercicios prácticos',
      'Toma descansos activos',
      'Usa simuladores y proyectos hands-on',
    ],
  },
};

export function Results({ data, onComplete, onBack }: Props) {
  // Maneja el caso de que el estilo sea null (aunque no debería pasar)
  const styleKey = data.learningStyle || 'visual';
  const styleInfo = learningStyleInfo[styleKey];
  const Icon = styleInfo.icon;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4"><LogoIcon size={80} /></div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¡Felicitaciones, {data.name.split(' ')[0]}!
            </h2>
            <p className="text-xl text-gray-600">
              Hemos completado tu perfil de aprendizaje
            </p>
          </div>

          <div className={`${styleInfo.bgColor} border-2 ${styleInfo.borderColor} rounded-3xl p-8 mb-8`}>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className={`w-24 h-24 bg-gradient-to-br ${styleInfo.color} rounded-3xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={48} className="text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{styleInfo.title}</h3>
                <p className="text-lg text-gray-700">{styleInfo.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-green-500" size={24} /> Tus fortalezas
              </h4>
              <ul className="space-y-3">
                {styleInfo.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 bg-gradient-to-br ${styleInfo.color} rounded-full mt-2 flex-shrink-0`}></div>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="text-yellow-500" size={24} /> Consejos para ti
              </h4>
              <ul className="space-y-3">
                {styleInfo.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 bg-gradient-to-br ${styleInfo.color} rounded-full mt-2 flex-shrink-0`}></div>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Tu perfil completo:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-600">Carrera:</span> <span className="font-medium text-gray-900">{data.career}</span></div>
              <div><span className="text-gray-600">Universidad:</span> <span className="font-medium text-gray-900">{data.university}</span></div>
              <div><span className="text-gray-600">Ubicación:</span> <span className="font-medium text-gray-900">{data.location}</span></div>
              <div><span className="text-gray-600">Preferencia:</span> <span className="font-medium text-gray-900 capitalize">{data.groupPreference}</span></div>
            </div>
            <div className="mt-3"><span className="text-gray-600">Intereses:</span> <span className="font-medium text-gray-900">{data.interests.join(', ')}</span></div>
          </div>

          <div className="flex justify-between gap-4">
            <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={20} /> Atrás
            </Button>
            <Button onClick={onComplete} className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
              Ir a mi dashboard <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}