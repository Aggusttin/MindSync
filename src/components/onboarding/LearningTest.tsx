import { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { OnboardingData } from './OnboardingFlow';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    value: 'visual' | 'auditivo' | 'kinestesico';
  }[];
}

// Este es el Test VARK (Visual, Aural, Read/Write, Kinesthetic)
// Simplificado a V-A-K
const questions: Question[] = [
  {
    id: 1,
    question: 'Prefieres un profesor que...',
    options: [
      { text: 'Usa diagramas, gráficos y esquemas en la pizarra.', value: 'visual' },
      { text: 'Explica verbalmente, debate y cuenta historias.', value: 'auditivo' },
      { text: 'Organiza actividades, visitas o proyectos prácticos.', value: 'kinestesico' },
    ],
  },
  {
    id: 2,
    question: 'Cuando armas un mueble, tú...',
    options: [
      { text: 'Sigues los diagramas e imágenes del manual.', value: 'visual' },
      { text: 'Le pides a alguien que te lea las instrucciones en voz alta.', value: 'auditivo' },
      { text: 'Simplemente empiezas a ensamblar las piezas.', value: 'kinestesico' },
    ],
  },
  {
    id: 3,
    question: '¿Qué te ayuda más a recordar algo?',
    options: [
      { text: 'Verlo (una foto, una imagen mental).', value: 'visual' },
      { text: 'Escucharlo (una canción, una rima, una voz).', value: 'auditivo' },
      { text: 'Hacerlo (escribirlo, actuarlo, moverte).', value: 'kinestesico' },
    ],
  },
  {
    id: 4,
    question: 'En tu tiempo libre, prefieres...',
    options: [
      { text: 'Ver películas, ir a museos o dibujar.', value: 'visual' },
      { text: 'Escuchar música, podcasts o charlar con amigos.', value: 'auditivo' },
      { text: 'Hacer deporte, bailar, cocinar o construir algo.', value: 'kinestesico' },
    ],
  },
   {
    id: 5,
    question: 'Al aprender una nueva habilidad, prefieres:',
    options: [
      { text: 'Ver un video tutorial.', value: 'visual' },
      { text: 'Escuchar a un experto explicarlo.', value: 'auditivo' },
      { text: 'Intentarlo tú mismo de inmediato.', value: 'kinestesico' },
    ],
  },
   {
    id: 6,
    question: '¿Cómo recuerdas mejor a una persona?',
    options: [
      { text: 'Por su cara.', value: 'visual' },
      { text: 'Por su nombre y el sonido de su voz.', value: 'auditivo' },
      { text: 'Por lo que hicieron o la sensación que te dieron.', value: 'kinestesico' },
    ],
  },
];

interface Props {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function LearningTest({ data, updateData, onNext, onBack }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(data.testAnswers);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // --- LÓGICA DE CÁLCULO DE ESTILO ---
      const counts = {
        visual: 0,
        auditivo: 0,
        kinestesico: 0,
      };

      answers.forEach(answer => {
        if (answer in counts) {
          counts[answer as keyof typeof counts]++;
        }
      });

      // Encuentra el estilo con el conteo más alto
      const learningStyle = Object.keys(counts).reduce((a, b) => 
        counts[a as keyof typeof counts] > counts[b as keyof typeof counts] ? a : b
      ) as OnboardingData['learningStyle'];

      updateData({ 
        learningStyle,
        testAnswers: answers,
      });
      onNext();
    }
  };

  const question = questions[currentQuestion];
  const currentAnswer = answers[currentQuestion];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Test de Aprendizaje</h2>
            <span className="text-sm text-gray-500">
              Pregunta {currentQuestion + 1} de {questions.length}
            </span>
          </div>

          <div className="mb-8">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
              {question.question}
            </h3>

            <RadioGroup value={currentAnswer} onValueChange={handleAnswer} className="space-y-4">
              {question.options.map((option, index) => (
                <Label
                  key={index}
                  htmlFor={`q${question.id}-${index}`}
                  className={`relative flex items-start p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    currentAnswer === option.value
                      ? 'border-primary bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`q${question.id}-${index}`}
                    className="mt-1"
                  />
                  <span className="flex-1 ml-3 cursor-pointer text-gray-700 text-base">{option.text}</span>
                  {currentAnswer === option.value && (
                    <CheckCircle2 className="text-primary flex-shrink-0" size={20} />
                  )}
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between gap-4">
            <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={20} /> Atrás
            </Button>
            <Button
              onClick={handleNext}
              disabled={!currentAnswer}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
            >
              {currentQuestion === questions.length - 1 ? 'Finalizar test' : 'Siguiente'}
              <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}