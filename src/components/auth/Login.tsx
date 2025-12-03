// src/components/auth/Login.tsx

import { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { LogoIcon } from '../Logo';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AuthData } from '../../lib/types';
import { toast } from 'sonner';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) { setError('Completa todos los campos'); return; }
    
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userData = await getUserDataFromDB(user.email!);

      if (!userData) throw new Error("No se encontró perfil.");

      // Compatibilidad con usuarios viejos ('role') y nuevos ('userType')
      const finalUserData: AuthData = {
        email: user.email!,
        userType: userData.userType || userData.role, 
        name: userData.name,
        institutionName: userData.institutionName,
        ...userData 
      };

      toast.success("¡Bienvenido de nuevo!");
      onLogin(finalUserData);

    } catch (err: any) {
      console.error(err);
      setError("Email o contraseña incorrectos.");
      toast.error("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4"><LogoIcon size={60} /></div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">Bienvenido</h1>
        <p className="text-gray-600">Inicia sesión para continuar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
        <div>
          <Label className="mb-2 block">Email</Label>
          <Input type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
        </div>
        <div>
          <Label className="mb-2 block">Contraseña</Label>
          <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
        </div>
        <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
          {isLoading ? "Iniciando..." : "Iniciar sesión"} <ArrowRight size={20} className="ml-2" />
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">¿No tienes cuenta? <button onClick={onSwitchToRegister} className="text-primary font-semibold hover:underline">Regístrate</button></p>
      </div>
    </div>
  );
}