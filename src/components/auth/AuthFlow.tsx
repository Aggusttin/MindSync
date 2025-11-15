import { useState } from 'react';
import { Login } from './Login';
import { Register } from './Register';
import { AuthData } from '../../lib/types';

interface Props {
  onLogin: (data: AuthData) => void;
  onRegister: (data: AuthData) => void;
}

// Este componente actúa como un interruptor entre Login y Register
export function AuthFlow({ onLogin, onRegister }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {isLogin ? (
          <Login onLogin={onLogin} onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <Register onRegister={onRegister} onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}