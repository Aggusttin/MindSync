import { useState, useEffect } from 'react';
import { AuthData, OnboardingData } from '@/lib/types';
import { getProfileByEmail } from '@/lib/db-service';

const AUTH_KEY = 'mindsync_auth_data';
const USER_KEY = 'mindsync_user_data';

export function useAuthPersistence() {
  // 1. Inicializar estado leyendo de localStorage
  const [authData, setAuthData] = useState<AuthData | null>(() => {
    const storedAuth = localStorage.getItem(AUTH_KEY);
    return storedAuth ? JSON.parse(storedAuth) : null;
  });

  const [userData, setUserData] = useState<OnboardingData | null>(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  // 2. Efecto para rehidratar datos desde Firebase si es necesario
  useEffect(() => {
    const initializeAuth = async () => {
      // Si tenemos usuario logueado pero faltan detalles del perfil (ej: recarga de página)
      if (authData?.email && !userData) {
        try {
          const profile = await getProfileByEmail(authData.email);
          if (profile && profile.onboardingCompleted) {
            setUserData(profile as OnboardingData);
            localStorage.setItem(USER_KEY, JSON.stringify(profile));
          }
        } catch (error) {
          console.error("Error rehidratando sesión:", error);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [authData?.email]); // Se ejecuta cuando cambia el email o al inicio

  // 3. Helper para guardar Auth (Login/Registro)
  const setAuth = (data: AuthData | null) => {
    setAuthData(data);
    if (data) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(USER_KEY);
      setUserData(null);
    }
  };
  
  // 4. Helper para guardar Perfil (Onboarding)
  const setUser = (data: OnboardingData | null) => {
      setUserData(data);
      if (data) {
          localStorage.setItem(USER_KEY, JSON.stringify(data));
      } else {
          localStorage.removeItem(USER_KEY);
      }
  };

  return { authData, userData, loading, setAuth, setUser };
}