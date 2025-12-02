import { LogoIcon } from './Logo';
import { Menu, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from './ui/sheet';

interface NavbarProps {
  onStartOnboarding?: () => void;
  onLogout?: () => void;
  userName?: string;
}

export function Navbar({ onStartOnboarding, onLogout, userName }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = !!onLogout;

  const scrollToSection = (id: string) => {
    if (isLoggedIn) return; // No hacer scroll si estamos en el dashboard
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
          
          <div className="flex items-center gap-3">
            <LogoIcon size={40} />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              MindSync
            </span>
          </div>
          
          {/* Menú Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                {navItems.map(item => (
                  <Button key={item.id} variant="ghost" onClick={() => scrollToSection(item.id)}>
                    {item.label}
                  </Button>
                ))}
                <Button onClick={onStartOnboarding} className="ml-4 bg-primary text-primary-foreground hover:bg-primary/90">
                  Comenzar gratis
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                  <User size={18} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{userName || 'Usuario'}</span>
                </div>
                <Button onClick={onLogout} variant="outline" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut size={18} />
                  Cerrar Sesión
                </Button>
              </>
            )}
          </div>
          
          {/* Menú Móvil */}
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
                  
                  {!isLoggedIn ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 text-gray-600 font-medium border-b mb-2">
                        Hola, {userName}
                      </div>
                      <SheetClose asChild>
                        <Button onClick={onLogout} variant="destructive" className="justify-start text-lg px-4 py-2">
                          <LogOut size={20} className="mr-2" />
                          Cerrar Sesión
                        </Button>
                      </SheetClose>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}