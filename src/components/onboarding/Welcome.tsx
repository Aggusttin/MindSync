import { ArrowRight, Brain, Users, Sparkles } from 'lucide-react';
import { LogoIcon } from '../Logo';
import { Button } from '../ui/button';

export function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6"><LogoIcon size={80} /></div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              ¡Bienvenido a MindSync!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Estás a punto de descubrir tu estilo de aprendizaje único y conectarte con una comunidad que aprende como tú.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="text-white" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Descubre tu estilo</h3>
              <p className="text-sm text-gray-600">Test científico que identifica cómo aprendes mejor</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Conecta</h3>
              <p className="text-sm text-gray-600">Encuentra grupos y compañeros compatibles</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-white" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aprende mejor</h3>
              <p className="text-sm text-gray-600">Recursos personalizados para tu forma de aprender</p>
            </div>
          </div>

          <div className="text-center">
            <Button onClick={onNext} size="lg" className="px-10 py-4 text-lg bg-primary text-primary-foreground">
              Comenzar ahora
              <ArrowRight size={20} className="ml-2" />
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Toma solo 5 minutos completar el proceso
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}