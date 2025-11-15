import { Brain, Users, Sparkles, Target } from 'lucide-react';

const steps = [
  { icon: Brain, title: '1. Descubre tu estilo', description: 'Completa nuestro test inteligente que identifica si eres visual, auditivo o kinestésico.' },
  { icon: Target, title: '2. Recibe tu perfil', description: 'Obtén un análisis detallado de tu estilo con recomendaciones personalizadas.' },
  { icon: Users, title: '3. Conéctate', description: 'Te emparejamos con grupos y compañeros que comparten tu forma de aprender.' },
  { icon: Sparkles, title: '4. Aprende mejor', description: 'Accede a recursos, eventos y empleos adaptados a tu estilo.' },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            En 4 simples pasos, transformamos tu forma de aprender.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all">
                <Icon size={32} className="text-primary mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}