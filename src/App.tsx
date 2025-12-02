// src/App.tsx

import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LearningStyles } from './components/LearningStyles';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { UserProfiles } from './components/UserProfiles';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { AuthFlow } from './components/auth/AuthFlow';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { UniversityDashboard } from './components/dashboard/UniversityDashboard';
import { CompanyDashboard } from './components/dashboard/CompanyDashboard';

import { useSystemState } from './hooks/useSystemState'; 
import { AuthData, OnboardingData } from './lib/types'; 

type AppView = 'landing' | 'auth' | 'onboarding' | 'dashboard';

export default function App() {
  const [view, setView] = useState<AppView>('landing');
  
  // State de Sesión
  const [userData, setUserData] = useState<OnboardingData | null>(null);
  const [authData, setAuthData] = useState<AuthData | null>(null);

  const { 
    events, 
    jobs, 
    groups, 
    resources, 
    addEvent, 
    addJob, 
    addGroup, 
    loading 
  } = useSystemState();

  const handleStartOnboarding = () => {
    setView('onboarding');
  };

  const handleShowAuth = () => {
    setView('auth');
  };

  const handleLogin = (data: AuthData) => {
    console.log("App recibió login:", data); // Debug
    setAuthData(data);
    
    // Al usar ...userData en Login, 'data' ahora tiene todo el perfil
    const fullUserData = data as OnboardingData; 
    setUserData(fullUserData);

    // Lógica de redirección
    if (data.userType === 'estudiante' && !data.onboardingCompleted) {
      setView('onboarding');
    } else {
      setView('dashboard');
    }
  };

  const handleRegister = (data: AuthData) => {
    setAuthData(data);
    if (data.userType === 'estudiante') {
      setView('onboarding');
    } else {
      setView('dashboard');
    }
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    setUserData(data);
    setView('dashboard');
  };

  const handleLogout = () => {
    setAuthData(null);
    setUserData(null);
    setView('landing'); 
  };

  // --- Renderizado de Vistas ---

  if (view === 'auth') {
    return (
      <>
        <Toaster />
        <AuthFlow onLogin={handleLogin} onRegister={handleRegister} />
      </>
    );
  }

  if (view === 'onboarding') {
    return (
      <>
        <Toaster />
        <OnboardingFlow onComplete={handleOnboardingComplete} authData={authData} />
      </>
    );
  }

  if (view === 'dashboard' && authData) {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p>Cargando datos del sistema...</p>
        </div>
      );
    }

    if (authData.userType === 'estudiante') {
      return (
        <>
          <Toaster />
          <StudentDashboard 
            userData={userData} 
            authData={authData} 
            onLogout={handleLogout}
            allEvents={events}
            allJobs={jobs}
            allGroups={groups}
            allResources={resources}
            onAddGroup={addGroup}
          />
        </>
      );
    } 
    
    if (authData.userType === 'universidad') {
      return (
        <>
          <Toaster />
          <UniversityDashboard 
            authData={authData} 
            onLogout={handleLogout}
            events={events}
            onAddEvent={addEvent}
          />
        </>
      );
    } 
    
    if (authData.userType === 'empresa') {
      return (
        <>
          <Toaster />
          <CompanyDashboard 
            authData={authData} 
            onLogout={handleLogout}
            jobs={jobs}
            onAddJob={addJob}
            onAddEvent={addEvent}
          />
        </>
      );
    }

    // Si llegamos aquí, hay un usuario pero el rol no coincide con ninguno
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-bold text-red-600">Error de Perfil</h1>
        <p>El usuario <strong>{authData.email}</strong> tiene un rol desconocido: "{authData.userType || 'Sin rol'}"</p>
        <button onClick={handleLogout} className="underline text-blue-600">Cerrar sesión</button>
      </div>
    );
  }

  // Vista por defecto: Landing Page
  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-white">
        <Navbar onStartOnboarding={handleShowAuth} />
        <main>
          <div id="inicio">
            <Hero onStartOnboarding={handleShowAuth} />
          </div>
          <div id="estilos">
            <LearningStyles />
          </div>
          <div id="como-funciona">
            <HowItWorks />
          </div>
          <div id="perfiles">
            <UserProfiles />
          </div>
          <div id="caracteristicas">
            <Features />
          </div>
          <CTA onStartOnboarding={handleShowAuth} />
        </main>
        <Footer />
      </div>
    </>
  );
}