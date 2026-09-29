import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './views/LandingPage';
import { CitizenPortal } from './views/CitizenPortal';
import { OfficialPortal } from './views/OfficialPortal';
import { PublicTransparency } from './components/PublicTransparency';
import { PublicTrackingModal } from './components/PublicTrackingModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { DemoFlowModal } from './components/DemoFlowModal';
import { NotificationsModal } from './components/NotificationsModal';
import { OnboardingTour } from './components/OnboardingTour';
import { LoginGateway } from './components/LoginGateway';
import { disconnectUserFromSupabase } from './supabase';
import type { User, UserRole, NotificationItem, LanguageCode } from './types';
import { api } from './api';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'citizen' | 'official' | 'transparency'>('landing');
  const [activeRole, setActiveRole] = useState<UserRole>('citizen');

  // Authentication Gate State (App opens ONLY after successful login)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('prajavaani_logged_in') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('prajavaani_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return null;
  });

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('prajavaani_logged_in', 'true');
    localStorage.setItem('prajavaani_user', JSON.stringify(user));
    // Trigger Guidance Tour with arrow marks right after entering credentials!
    setIsTourOpen(true);
  };

  const handleLogout = async () => {
    if (currentUser) {
      try {
        await disconnectUserFromSupabase({
          id: currentUser.id,
          name: currentUser.name,
          role: currentUser.role,
        });
      } catch (e) {
        console.warn('Disconnect error:', e);
      }
    }
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('prajavaani_logged_in');
    localStorage.removeItem('prajavaani_user');
  };
  
  // 13 Indian State Languages - Default to Telugu (or stored preference)
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('prajavaani_lang') as LanguageCode;
    return saved || 'te';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('prajavaani_lang', lang);
  };

  // Modals & Navigation
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackComplaintId, setTrackComplaintId] = useState('PV-2026-004821');
  const [isDemoFlowOpen, setIsDemoFlowOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [openCreateWizardDirectly, setOpenCreateWizardDirectly] = useState(false);

  // Guided Walkthrough Onboarding Tour (Auto shows on app entry, or after entering login credentials)
  const [isTourOpen, setIsTourOpen] = useState(true);

  const handleCloseTour = () => {
    setIsTourOpen(false);
    if (window.location.hash === '#tour') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#tour') {
        setIsTourOpen(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [activeRole]);

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch {
      // Fallback
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleOpenTrackModal = (complaintNumber: string = 'PV-2026-004821') => {
    setTrackComplaintId(complaintNumber);
    setIsTrackModalOpen(true);
  };

  const handleResetDemoData = async () => {
    if (confirm('Reset all demo grievances and audit logs back to pristine initial demo state?')) {
      await api.resetDemo();
      loadNotifications();
      alert('Demo data successfully reset! Primary demo scenario PV-2026-004821 restored.');
      window.location.reload();
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Show Sovereign Login Gateway FIRST.
  // The app will NOT open until the citizen enters credentials and logs in to Supabase!
  if (!isLoggedIn) {
    return (
      <LoginGateway
        language={language}
        onLanguageChange={setLanguage}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Government Navigation & Quick Evaluator Switcher */}
      <Header
        currentView={currentView}
        setCurrentView={(view) => {
          setOpenCreateWizardDirectly(false);
          setCurrentView(view);
        }}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        language={language}
        setLanguage={setLanguage}
        unreadCount={unreadCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenTrackModal={() => handleOpenTrackModal('PV-2026-004821')}
        onResetDemo={handleResetDemoData}
        onTriggerDemoFlow={() => setIsDemoFlowOpen(true)}
        onOpenTour={() => setIsTourOpen(true)}
        onLogout={handleLogout}
        userName={currentUser?.name}
      />

      {/* Main View Router */}
      <main style={{ flex: 1 }}>
        {currentView === 'landing' && (
          <LandingPage
            language={language}
            onOpenCitizen={() => {
              setActiveRole('citizen');
              setOpenCreateWizardDirectly(false);
              setCurrentView('citizen');
            }}
            onOpenOfficial={() => {
              if (activeRole === 'citizen') setActiveRole('field_officer');
              setCurrentView('official');
            }}
            onOpenTrackModal={() => handleOpenTrackModal('PV-2026-004821')}
            onOpenReportModal={() => {
              setActiveRole('citizen');
              setOpenCreateWizardDirectly(true);
              setCurrentView('citizen');
            }}
            onTriggerDemoFlow={() => setIsDemoFlowOpen(true)}
          />
        )}

        {currentView === 'citizen' && (
          <CitizenPortal
            language={language}
            onOpenTrackModal={handleOpenTrackModal}
            openCreateWizardImmediately={openCreateWizardDirectly}
            onTriggerTour={() => setIsTourOpen(true)}
            onLogout={handleLogout}
          />
        )}

        {currentView === 'official' && (
          <OfficialPortal
            activeRole={activeRole}
            setActiveRole={setActiveRole}
            language={language}
            onOpenTrackModal={handleOpenTrackModal}
          />
        )}

        {currentView === 'transparency' && <PublicTransparency language={language} />}
      </main>

      {/* Guided Walkthrough Onboarding Tour */}
      <OnboardingTour
        language={language}
        isOpen={isTourOpen}
        onClose={handleCloseTour}
        onLanguageChange={setLanguage}
        onNavigateToCitizen={() => {
          setActiveRole('citizen');
          setCurrentView('citizen');
        }}
        onNavigateToReport={() => {
          setActiveRole('citizen');
          setOpenCreateWizardDirectly(true);
          setCurrentView('citizen');
        }}
        onNavigateToTrack={() => {
          handleOpenTrackModal('PV-2026-004821');
        }}
      />

      {/* Public Tracking Modal */}
      <PublicTrackingModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        initialComplaintNumber={trackComplaintId}
        language={language}
      />

      {/* Notifications Drawer */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotificationRead}
        onOpenTrack={handleOpenTrackModal}
      />

      {/* Primary Hackathon Demo Flow Walkthrough Modal */}
      <DemoFlowModal
        isOpen={isDemoFlowOpen}
        onClose={() => setIsDemoFlowOpen(false)}
        onSetRoleAndView={(role, view) => {
          setActiveRole(role);
          setCurrentView(view);
        }}
        onOpenTrackModal={handleOpenTrackModal}
      />

      {/* Floating AI Citizen Assistant Bot (ChatGPT-style Sahayak) */}
      <AIAssistantModal
        language={language}
        onLodgeComplaint={() => {
          setActiveRole('citizen');
          setOpenCreateWizardDirectly(true);
          setCurrentView('citizen');
        }}
      />
    </div>
  );
}

export default App;
