import { useState } from 'react';
import { Progress } from '../ui/progress';
import { Welcome } from './Welcome';
import { LearningTest } from './LearningTest';
import { PersonalInfo } from './PersonalInfo';
import { Preferences } from './Preferences';
import { Results } from './Results';
import { OnboardingData, AuthData } from '../../lib/types';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';

const TOTAL_STEPS = 5;

// Este componente es el "Jefe" del flujo de bienvenida.
// Controla qué pantalla se muestra (Bienvenida, Test, Info, etc.)
export function OnboardingFlow({ 
  onComplete, 
  authData 
}: { 
  onComplete: (data: OnboardingData) => void, 
  authData: AuthData | null 
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    learningStyle: null,
    testAnswers: [],
    name: authData?.name || '',
    email: authData?.email || '',
    career: '',
    university: '',
    location: '',
    interests: [],
    groupPreference: null,
  });

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Esta es la función final
  const handleComplete = async () => {
    if (!authData?.email) {
      toast.error("Error: no se encontró email de usuario.");
      return;
    }
    
    try {
      // Actualiza el documento del usuario en Firebase con los datos del test
      const userRef = doc(db, "users", authData.email);
      await updateDoc(userRef, {
        ...data,
        onboardingCompleted: true // Marcamos que ya hizo el test
      });
      toast.success("¡Perfil guardado!");
      onComplete(data);
    } catch (error) {
      console.error("Error guardando datos de onboarding:", error);
      toast.error("Error al guardar tu perfil.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30">
      {/* Barra de Progreso */}
      {currentStep > 0 && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 min-w-fit">
                Paso {currentStep + 1} de {TOTAL_STEPS}
              </span>
              <Progress value={progress} className="flex-1" />
            </div>
          </div>
        </div>
      )}

      {/* Contenido (cambia según el paso) */}
      <div className={`${currentStep > 0 ? 'pt-24' : ''}`}>
        {currentStep === 0 && <Welcome onNext={nextStep} />}
        {currentStep === 1 && <LearningTest data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />}
        {currentStep === 2 && <PersonalInfo data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />}
        {currentStep === 3 && <Preferences data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />}
        {currentStep === 4 && <Results data={data} onComplete={handleComplete} onBack={prevStep} />}
      </div>
    </div>
  );
}