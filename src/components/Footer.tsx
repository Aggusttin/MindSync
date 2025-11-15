import { LogoIcon } from './Logo';
import { Instagram, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <LogoIcon size={40} />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                MindSync
              </h3>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Transformamos grupos en experiencias de aprendizaje compatibles.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"><Instagram size={20} /></a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"><Twitter size={20} /></a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Producto</h4>
            <ul className="space-y-3">
              <li><a href="#estilos" className="text-gray-400 hover:text-white transition-colors">Estilos de Aprendizaje</a></li>
              <li><a href="#como-funciona" className="text-gray-400 hover:text-white transition-colors">Cómo funciona</a></li>
              <li><a href="#perfiles" className="text-gray-400 hover:text-white transition-colors">Perfiles</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Términos de Uso</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 MindSync. Proyecto para Seminario de Práctica de Analista en Software.
          </p>
        </div>
      </div>
    </footer>
  );
}