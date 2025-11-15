import { Zap, Users, Lightbulb, TrendingUp, Heart, Globe } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Detección inteligente', description: 'Algoritmos avanzados analizan tu forma de aprender con precisión.' },
  { icon: Users, title: 'Grupos compatibles', description: 'Te conectamos con personas que aprenden como tú.' },
  { icon: Lightbulb, title: 'Recursos personalizados', description: 'Contenido adaptado a tu estilo de aprendizaje específico.' },
  { icon: TrendingUp, title: 'Portal de Empleo', description: 'Conecta tu perfil con empresas que buscan tu talento.' },
  { icon: Heart, title: 'Experiencia motivadora', description: 'Aprende de forma natural y sin frustración.' },
  { icon: Globe, title: 'Comunidad Universitaria', description: 'Accede a eventos y charlas de tu institución.' },
];

export function Features() {
  return (
    <section id="caracteristicas" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Todo en un solo lugar
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Potencia tu aprendizaje con herramientas diseñadas para ti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="group p-8 rounded-3xl border-2 border-gray-100 bg-white hover:border-primary transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mb-6">
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}