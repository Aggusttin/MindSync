// --- CÓDIGO CORREGIDO: App.tsx ---

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

// Importa el "Cerebro" y todos los tipos
import { useSystemState } from './hooks/useSystemState'; 
import { AuthData, OnboardingData, Evento, Job, Grupo, Recurso } from './lib/types'; 

type AppView = 'landing' | 'auth' | 'onboarding' | 'dashboard';

export default function App() {
  // State de Vistas
  const [view, setView] = useState<AppView>('landing');
  
  // State de Sesión
  const [userData, setUserData] = useState<OnboardingData | null>(null);
  const [authData, setAuthData] = useState<AuthData | null>(null);

  // Llama al "Cerebro" de Datos y obtén todo
  const { 
    events, 
    jobs, 
    groups, 
    resources, 
    addEvent, 
    addJob, 
    loading 
  } = useSystemState();

  // --- Handlers de Vistas ---
  
  const handleStartOnboarding = () => {
    setView('onboarding');
  };

  const handleShowAuth = () => {
    setView('auth');
  };

  const handleLogin = (data: AuthData) => {
    setAuthData(data);
    
    // Asumimos que 'data' (que viene de getUserDataFromDB) contiene el perfil completo
    const fullUserData = data as OnboardingData; 
    setUserData(fullUserData);

    // Si es estudiante Y no ha completado el onboarding, lo enviamos allí
    if (data.userType === 'estudiante' && !fullUserData.onboardingCompleted) {
      setView('onboarding');
    } else {
      // Si ya lo completó o es otro rol, va al dashboard
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
    // Aquí deberías agregar 'signOut(auth)' de Firebase
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
          <p>Cargando datos...</p>
          {/* Aquí podrías poner un componente <Spinner /> */}
        </div>
      );
    }

    // Dashboard de Estudiante
    if (authData.userType === 'estudiante') {
      return (
        <>
          <Toaster />
          <StudentDashboard 
            userData={userData} 
            authData={authData} 
            onLogout={handleLogout}
            allEvents={events}     // Pasa eventos
            allJobs={jobs}         // Pasa trabajos
            allGroups={groups}     // Pasa grupos
            allResources={resources} // Pasa recursos
          />
        </>
      );
    } 
    
    // Dashboard de Universidad
    else if (authData.userType === 'universidad') {
      return (
        <>
          <Toaster />
          <UniversityDashboard 
            authData={authData} 
            onLogout={handleLogout}
            events={events}       // Pasa eventos
            onAddEvent={addEvent} // Pasa función de crear
          />
        </>
      );
    } 
    
    // Dashboard de Empresa
    else if (authData.userType === 'empresa') {
      return (
        <>
          <Toaster />
          <CompanyDashboard 
            authData={authData} 
            onLogout={handleLogout}
            jobs={jobs}           // Pasa trabajos
            onAddJob={addJob}     // Pasa función de crear trabajo
            onAddEvent={addEvent} // Pasa función de crear evento
          />
        </>
      );
    }
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