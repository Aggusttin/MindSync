import { Eye, Volume2, Hand } from 'lucide-react';

const styles = [
  { icon: Eye, title: 'Visual', color: 'blue', description: 'Aprendes mejor a través de imágenes, gráficos y contenido visual.', features: ['Mapas mentales', 'Infografías', 'Videos'] },
  { icon: Volume2, title: 'Auditivo', color: 'green', description: 'Tu aprendizaje es más efectivo mediante el sonido y explicaciones verbales.', features: ['Podcasts', 'Debates', 'Audiolibros'] },
  { icon: Hand, title: 'Kinestésico', color: 'orange', description: 'Aprendes haciendo, con actividades prácticas y experiencias táctiles.', features: ['Proyectos', 'Experimentos', 'Simulaciones'] },
];

const colors = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', gradient: 'from-blue-500 to-blue-600' },
  green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', gradient: 'from-green-500 to-green-600' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', gradient: 'from-orange-500 to-orange-600' },
}

export function LearningStyles() {
  return (
    <section id="estilos" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Tres estilos, infinitas posibilidades
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Identificamos tu estilo predominante para conectarte con recursos y personas que comparten tu forma de aprender.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {styles.map((style) => {
            const Icon = style.icon;
            const c = colors[style.color as keyof typeof colors] || colors.blue;
            return (
              <div key={style.title} className={`${c.bg} border-2 ${c.border} rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                <div className={`w-16 h-16 bg-gradient-to-br ${c.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon size={32} className="text-white" />
                </div>
                <h3 className={`text-2xl font-semibold mb-3 ${c.text}`}>{style.title}</h3>
                <p className="text-gray-700 mb-6">{style.description}</p>
                <div className="space-y-2">
                  {style.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 bg-gradient-to-br ${c.gradient} rounded-full`}></div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}