import { ArrowRight } from 'lucide-react';
import { LogoIcon } from './Logo';
import { Button } from './ui/button';

export function CTA({ onStartOnboarding }: { onStartOnboarding?: () => void }) {
  return (
    <section id="cta" className="py-20 px-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 text-center">
            <div className="flex justify-center mb-6">
              <LogoIcon size={80} />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Comienza tu viaje de aprendizaje
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Únete a miles de estudiantes que ya están aprendiendo de forma más efectiva con MindSync.
            </p>
            <Button onClick={onStartOnboarding} size="lg" className="px-8 py-4 text-lg bg-white text-primary hover:bg-gray-200">
              Comenzar gratis
              <ArrowRight size={20} className="ml-2" />
            </Button>
        </div>
      </div>
    </section>
  );
}