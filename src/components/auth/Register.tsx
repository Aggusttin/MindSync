import { useState } from 'react';
import { Mail, Lock, User, Building2, ArrowRight, GraduationCap, Briefcase } from 'lucide-react';
import { LogoIcon } from '../Logo';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AuthData, UserRole } from '../../lib/types';
import { registerUserInDB } from '../../lib/db-service';
import { toast } from 'sonner';
// --- NUEVOS IMPORTS ---
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase'; // Importa el 'auth' que creamos
// ---




interface Props {
  onRegister: (data: AuthData) => void;
  onSwitchToLogin: () => void;
}

export function Register({ onRegister, onSwitchToLogin }: Props) {
  const [step, setStep] = useState<'type' | 'details'>('type');
  const [userType, setUserType] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    institutionName: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTypeSelection = (type: UserRole) => {
    setUserType(type);
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password || !formData.name) {
      setError('Por favor completa todos los campos obligatorios'); return;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres'); return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden'); return;
    }
    if ((userType === 'universidad' || userType === 'empresa') && !formData.institutionName) {
      setError('Por favor ingresa el nombre de la institución'); return;
    }

    setIsLoading(true);
    const newUserData: AuthData = {
      email: formData.email,
      password: formData.password,
      userType: userType!,
      name: formData.name,
      institutionName: formData.institutionName,
    };

    try {
     // --- LÓGICA DE REGISTRO ACTUALIZADA ---
      
      // 1. Crear el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      toast.success("¡Cuenta de autenticación creada!");

      // 2. Preparar los datos para la base de datos
      const newUserData: AuthData = {
        email: userCredential.user.email!,
        userType: userType!,
        name: formData.name,
        institutionName: formData.institutionName,
      };

      // 3. Guardar en Base de Datos (Firestore)
      await registerUserInDB(newUserData);
      toast.success("¡Perfil guardado en la base de datos!");
      
      // 4. Notificar a App.tsx para cambiar de vista
      // Le pasamos los datos sin la contraseña
      onRegister(newUserData);

    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Este email ya está en uso.");
      } else {
        setError("Error al registrar el usuario. Revisa la consola.");
      }
      toast.error("Error al registrar el usuario");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'type') {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4"><LogoIcon size={60} /></div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
            Crear cuenta
          </h1>
          <p className="text-gray-600">¿Cómo quieres usar MindSync?</p>
        </div>

        <div className="space-y-4">
          <button onClick={() => handleTypeSelection('estudiante')} className="w-full p-6 border-2 border-gray-200 rounded-2xl hover:border-primary hover:bg-purple-50 transition-all text-left group flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0"><GraduationCap className="text-white" size={24} /></div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Soy Estudiante</h3>
              <p className="text-sm text-gray-600">Descubre tu estilo y conéctate con grupos</p>
            </div>
          </button>
          <button onClick={() => handleTypeSelection('universidad')} className="w-full p-6 border-2 border-gray-200 rounded-2xl hover:border-primary hover:bg-purple-50 transition-all text-left group flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0"><Building2 className="text-white" size={24} /></div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Soy Universidad</h3>
              <p className="text-sm text-gray-600">Organiza eventos y mejora la experiencia</p>
            </div>
          </button>
          <button onClick={() => handleTypeSelection('empresa')} className="w-full p-6 border-2 border-gray-200 rounded-2xl hover:border-primary hover:bg-purple-50 transition-all text-left group flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0"><Briefcase className="text-white" size={24} /></div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Soy Empresa</h3>
              <p className="text-sm text-gray-600">Conecta con talento universitario compatible</p>
            </div>
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">¿Ya tienes cuenta?{' '}
            <button onClick={onSwitchToLogin} className="text-primary font-semibold hover:underline">
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
          Completa tu registro
        </h1>
        <p className="text-gray-600 capitalize">Cuenta de {userType}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
        
        <div>
          <Label htmlFor="name" className="flex items-center gap-2 mb-2">
            <User size={18} className="text-gray-500" />
            {userType === 'estudiante' ? 'Nombre completo *' : 'Nombre del contacto *'}
          </Label>
          <Input id="name" type="text" placeholder="Tu nombre" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        </div>

        {(userType === 'universidad' || userType === 'empresa') && (
          <div>
            <Label htmlFor="institution" className="flex items-center gap-2 mb-2">
              <Building2 size={18} className="text-gray-500" />
              {userType === 'universidad' ? 'Nombre de la universidad *' : 'Nombre de la empresa *'}
            </Label>
            <Input id="institution" type="text" placeholder={`Ej: ${userType === 'universidad' ? 'UBA' : 'TechCorp'}`} value={formData.institutionName} onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })} />
          </div>
        )}

        <div>
          <Label htmlFor="email" className="flex items-center gap-2 mb-2">
            <Mail size={18} className="text-gray-500" />Email *
          </Label>
          <Input id="email" type="email" placeholder="tu@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        </div>
        
        <div>
          <Label htmlFor="password" className="flex items-center gap-2 mb-2">
            <Lock size={18} className="text-gray-500" />Contraseña * (mín. 6 caracteres)
          </Label>
          <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="flex items-center gap-2 mb-2">
            <Lock size={18} className="text-gray-500" />Confirmar contraseña *
          </Label>
          <Input id="confirmPassword" type="password" placeholder="Repite tu contraseña" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" onClick={() => setStep('type')} variant="outline" className="flex-1" disabled={isLoading}>Atrás</Button>
          <Button type="submit" className="flex-1 bg-primary text-primary-foreground" disabled={isLoading}>
            {isLoading ? "Creando..." : "Crear cuenta"}
            {!isLoading && <ArrowRight size={20} className="ml-2" />}
          </Button>
        </div>
      </form>
    </div>
  );
}