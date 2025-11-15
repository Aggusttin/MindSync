import { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { LogoIcon } from '../Logo';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AuthData } from '../../lib/types';
import { toast } from 'sonner';

// Importa los servicios reales de Firebase
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { getUserDataFromDB } from '../../lib/db-service';

interface Props {
  onLogin: (data: AuthData) => void;
  onSwitchToRegister: () => void;
}

export function Login({ onLogin, onSwitchToRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- NUEVA FUNCIÓN DE VALIDACIÓN ---
  const validateEmail = (email: string) => {
    // Esta es una expresión regular (RegEx) simple para validar el formato de un email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // --- 1. VALIDACIÓN DE CAMPOS VACÍOS ---
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    // --- 2. NUEVA VALIDACIÓN DE FORMATO DE EMAIL ---
    if (!validateEmail(email)) {
      setError('Por favor ingresa un formato de email válido (ej: tu@email.com)');
      return;
    }
    
    setIsLoading(true);

    try {
      // --- 3. LÓGICA DE LOGIN REAL (reemplaza la simulación) ---

      // Intenta iniciar sesión con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        email, 
        password
      );
      
      const user = userCredential.user;
      toast.success("¡Inicio de sesión exitoso!");

      // Obtiene los datos del rol (estudiante, empresa) de Firestore
      const userData = await getUserDataFromDB(user.email!);

      if (!userData) {
        throw new Error("No se encontraron datos de perfil para este usuario.");
      }

      // Llama a onLogin con los datos REALES
      onLogin({
        email: user.email!,
        name: userData.name,
        userType: userData.userType,
        institutionName: userData.institutionName,
      });

    } catch (err: any) {
      console.error(err);
      
      // --- 4. MANEJO DE ERRORES MEJORADO ---
      if (err.code === 'auth/invalid-email') {
        setError("El formato del email no es válido.");
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Email o contraseña incorrectos.");
      } else {
        setError("Error al iniciar sesión. Revisa la consola.");
      }
      toast.error("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4"><LogoIcon size={60} /></div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
          Bienvenido a MindSync
        </h1>
        <p className="text-gray-600">Inicia sesión para continuar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <div>
          <Label htmlFor="email" className="flex items-center gap-2 mb-2">
            <Mail size={18} className="text-gray-500" />Email
          </Label>
          <Input id="email" type="email" placeholder="tu.email@ejemplo.com" value={email} onChange={(e) => {setEmail(e.target.value); setError('');}} disabled={isLoading} />
        </div>

        <div>
          <Label htmlFor="password" className="flex items-center gap-2 mb-2">
            <Lock size={18} className="text-gray-500" />Contraseña
          </Label>
          <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => {setPassword(e.target.value); setError('');}} disabled={isLoading} />
        </div>

        <Button type="submit" className="w-full text-lg py-6 bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
          {isLoading ? "Iniciando..." : "Iniciar sesión"}
          {!isLoading && <ArrowRight size={20} className="ml-2" />}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          ¿No tienes cuenta?{' '}
          <button onClick={onSwitchToRegister} className="text-primary font-semibold hover:underline">
            Regístrate aquí
          </button>
        </p>
      </div>
      
      {/* ... (El bloque de "Demo Rápida" se mantiene igual) ... */}
    </div>
  );
}