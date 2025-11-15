import { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { LogoIcon } from '../Logo';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AuthData } from '../../lib/types';
import { toast } from 'sonner'; // <-- Importa toast (opcional)

// --- NUEVOS IMPORTS ---
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase'; // <-- Importa el servicio de Auth
import { getUserDataFromDB } from '../../lib/db-service'; // <-- Importa la función de DB
// ---

interface Props {
  onLogin: (data: AuthData) => void;
  onSwitchToRegister: () => void;
}

export function Login({ onLogin, onSwitchToRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // <-- Añadido para feedback

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    setIsLoading(true); // <-- Bloquea el formulario

    try {
      // --- LÓGICA DE LOGIN ACTUALIZADA ---

      // 1. Iniciar sesión con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        email, 
        password
      );
      
      const user = userCredential.user;
      toast.success("¡Inicio de sesión exitoso!");

      // 2. Obtener los datos (rol) de Firestore
      const userData = await getUserDataFromDB(user.email!);

      if (!userData) {
        // Esto no debería pasar si el registro fue correcto
        throw new Error("No se encontraron datos de perfil para este usuario.");
      }

      // 3. Llamar a onLogin con los datos REALES (incluyendo el rol)
      onLogin({
        email: user.email!,
        name: userData.name,
        userType: userData.userType,
        institutionName: userData.institutionName,
      });

    } catch (err: any) {
      console.error(err);
      // Maneja errores comunes de Firebase Auth
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Email o contraseña incorrectos.");
      } else {
        setError("Error al iniciar sesión. Revisa la consola.");
      }
      toast.error("Error al iniciar sesión");
    } finally {
      setIsLoading(false); // <-- Desbloquea el formulario
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
          {/* Añadido 'disabled' */}
          <Input id="email" type="email" placeholder="tu.email@ejemplo.com" value={email} onChange={(e) => {setEmail(e.target.value); setError('');}} disabled={isLoading} />
        </div>

        <div>
          <Label htmlFor="password" className="flex items-center gap-2 mb-2">
            <Lock size={18} className="text-gray-500" />Contraseña
          </Label>
          {/* Añadido 'disabled' */}
          <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => {setPassword(e.target.value); setError('');}} disabled={isLoading} />
        </div>

        {/* Añadido 'disabled' y texto dinámico */}
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
      
      {/* El bloque de "Demo Rápida" puede quedarse como ayuda al usuario */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-xs text-gray-700 mb-2"><strong>Demo Rápida (Emails de registro):</strong></p>
        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
          <li>Registra `test@universidad.edu` (Rol Universidad)</li>
          <li>Registra `test@empresa.com` (Rol Empresa)</li>
          <li>Registra `test@gmail.com` (Rol Estudiante)</li>
        </ul>
      </div>
    </div>
  );
}