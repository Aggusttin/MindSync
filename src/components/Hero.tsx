import { LogoIcon } from './Logo';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

export function Hero({ onStartOnboarding }: { onStartOnboarding?: () => void }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 mb-6">
              <LogoIcon size={60} />
              <h1 className="text-5xl lg:text-6xl font-bold">
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
                  MindSync
                </span>
              </h1>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-6">
              Transformamos grupos en experiencias de aprendizaje compatibles
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Descubre tu estilo de aprendizaje único y conéctate con grupos, personas y recursos 
              adaptados perfectamente a tu forma de aprender.
            </p>
            
            <div className="flex justify-center lg:justify-start">
              <Button onClick={onStartOnboarding} size="lg" className="px-8 py-4 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
                Comenzar gratis
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 p-1 rounded-[3rem] shadow-2xl">
              <div className="bg-white rounded-[2.8rem] p-6 w-[300px] h-[600px] flex flex-col justify-center items-center text-center">
                 <LogoIcon size={80} />
                 <h3 className="text-xl font-semibold mt-4 text-gray-900">¿Cómo aprendes mejor?</h3>
                 <p className="text-sm text-gray-500 mt-2">Descubre tu estilo único</p>
                 <div className="space-y-3 mt-6 w-full">
                    <div className="bg-blue-100 text-blue-800 rounded-2xl p-4 text-left font-medium">Visual</div>
                    <div className="bg-green-100 text-green-800 rounded-2xl p-4 text-left font-medium">Auditivo</div>
                    <div className="bg-orange-100 text-orange-800 rounded-2xl p-4 text-left font-medium">Kinestésico</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}