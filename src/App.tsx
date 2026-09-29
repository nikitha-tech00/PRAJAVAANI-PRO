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
import type { UserRole, NotificationItem, LanguageCode } from './types';
import { api } from './api';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'citizen' | 'official' | 'transparency'>('landing');
  const [activeRole, setActiveRole] = useState<UserRole>('citizen');
  
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

  // Guided Walkthrough Onboarding Tour (Auto shows on first visit or via #tour)
  const [isTourOpen, setIsTourOpen] = useState(() => {
    const hasSeen = localStorage.getItem('prajavaani_tour_seen');
    if (window.location.hash === '#tour') return true;
    return !hasSeen;
  });

  const handleCloseTour = () => {
    setIsTourOpen(false);
    localStorage.setItem('prajavaani_tour_seen', 'true');
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
