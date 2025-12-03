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
  const [userData, setUserData] = useState<OnboardingData | null>(null);
  const [authData, setAuthData] = useState<AuthData | null>(null);

  const { events, jobs, groups, resources, addEvent, addJob, addGroup, handleToggleEvent, handleToggleJob, handleToggleGroup, loading } = useSystemState();

  const handleLogin = (data: AuthData) => {
    setAuthData(data);
    setUserData(data as OnboardingData);
    if (data.userType === 'estudiante' && !data.onboardingCompleted) setView('onboarding');
    else setView('dashboard');
  };

  const handleRegister = (data: AuthData) => {
    setAuthData(data);
    if (data.userType === 'estudiante') setView('onboarding');
    else setView('dashboard');
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    setUserData(data); setView('dashboard');
  };

  const handleLogout = () => {
    setAuthData(null); setUserData(null); setView('landing'); 
  };

  if (view === 'auth') return <><Toaster /><AuthFlow onLogin={handleLogin} onRegister={handleRegister} /></>;
  if (view === 'onboarding') return <><Toaster /><OnboardingFlow onComplete={handleOnboardingComplete} authData={authData} /></>;

  if (view === 'dashboard' && authData) {
    if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

    if (authData.userType === 'estudiante') {
      return <><Toaster /><StudentDashboard userData={userData} authData={authData} onLogout={handleLogout} allEvents={events} allJobs={jobs} allGroups={groups} allResources={resources} onAddGroup={addGroup} onToggleEvent={handleToggleEvent} onToggleJob={handleToggleJob} onToggleGroup={handleToggleGroup} /></>;
    } 
    if (authData.userType === 'universidad') {
      return <><Toaster /><UniversityDashboard authData={authData} onLogout={handleLogout} events={events} onAddEvent={addEvent} /></>;
    } 
    if (authData.userType === 'empresa') {
      return <><Toaster /><CompanyDashboard authData={authData} onLogout={handleLogout} jobs={jobs} onAddJob={addJob} onAddEvent={addEvent} /></>;
    }
    return <div>Error de perfil <button onClick={handleLogout}>Salir</button></div>;
  }

  return (
    <><Toaster /><div className="min-h-screen bg-white"><Navbar onStartOnboarding={() => setView('auth')} /><main><Hero onStartOnboarding={() => setView('auth')} /><LearningStyles /><HowItWorks /><UserProfiles /><Features /><CTA onStartOnboarding={() => setView('auth')} /></main><Footer /></div></>
  );
}