import { LogoIcon } from './Logo';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from './ui/sheet'; // Usamos Sheet para móvil

export function Navbar({ onStartOnboarding }: { onStartOnboarding?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsOpen(false);
    }
  };

  const navItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'estilos', label: 'Estilos' },
    { id: 'como-funciona', label: 'Cómo funciona' },
    { id: 'perfiles', label: 'Perfiles' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <button onClick={() => scrollToSection('inicio')} className="flex items-center gap-3 cursor-pointer">
            <LogoIcon size={40} />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              MindSync
            </span>
          </button>
          
          {/* Menú Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map(item => (
              <Button key={item.id} variant="ghost" onClick={() => scrollToSection(item.id)}>
                {item.label}
              </Button>
            ))}
            <Button onClick={onStartOnboarding} className="ml-4 bg-primary text-primary-foreground hover:bg-primary/90">
              Comenzar gratis
            </Button>
          </div>
          
          {/* Menú Móvil (con Sheet) */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col gap-4 py-8">
                  <div className="flex items-center gap-3 mb-4 px-4">
                    <LogoIcon size={32} />
                    <span className="text-xl font-bold">MindSync</span>
                  </div>
                  {navItems.map(item => (
                    <SheetClose asChild key={item.id}>
                      <Button variant="ghost" onClick={() => scrollToSection(item.id)} className="justify-start text-lg px-4 py-2">
                        {item.label}
                      </Button>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <Button onClick={onStartOnboarding} className="bg-primary text-primary-foreground text-lg px-4 py-2">
                      Comenzar gratis
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}