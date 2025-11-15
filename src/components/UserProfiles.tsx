import { GraduationCap, Building2, Briefcase } from 'lucide-react';

const profiles = [
  { icon: GraduationCap, title: 'Estudiantes', description: 'Descubre tu estilo, conéctate con grupos compatibles y accede a recursos personalizados.', color: 'blue' },
  { icon: Building2, title: 'Universidades', description: 'Organiza eventos segmentados por estilo de aprendizaje y mejora la experiencia educativa.', color: 'purple' },
  { icon: Briefcase, title: 'Empresas', description: 'Conecta con talento universitario compatible con tu cultura organizacional.', color: 'orange' },
];

const colors = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
}

export function UserProfiles() {
  return (
    <section id="perfiles" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Una plataforma para todos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            MindSync conecta los tres pilares del ecosistema educativo y profesional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {profiles.map((profile) => {
            const Icon = profile.icon;
            const colorClass = colors[profile.color as keyof typeof colors] || colors.blue;
            return (
              <div key={profile.title} className="group relative overflow-hidden bg-gray-50 border-2 border-gray-200 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className={`w-16 h-16 ${colorClass} rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{profile.title}</h3>
                <p className="text-gray-600 mb-6">{profile.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}