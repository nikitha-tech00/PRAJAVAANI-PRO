import React, { useState } from 'react';
import { Bell, Globe, Search, RefreshCw, Sparkles, Navigation, ChevronDown, Check, LogOut } from 'lucide-react';
import type { UserRole, LanguageCode } from '../types';
import { getTranslation, SUPPORTED_LANGUAGES } from '../translations';
import { GovEmblem } from './GovEmblem';

interface HeaderProps {
  currentView: 'landing' | 'citizen' | 'official' | 'transparency';
  setCurrentView: (view: 'landing' | 'citizen' | 'official' | 'transparency') => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenTrackModal: () => void;
  onResetDemo: () => void;
  onTriggerDemoFlow: () => void;
  onOpenTour?: () => void;
  onLogout?: () => void;
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  activeRole,
  setActiveRole,
  language,
  setLanguage,
  unreadCount,
  onOpenNotifications,
  onOpenTrackModal,
  onResetDemo,
  onTriggerDemoFlow,
  onOpenTour,
  onLogout,
  userName,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const t = getTranslation(language);

  const roleLabels: Record<UserRole, { title: string; name: string; badgeColor: string }> = {
    citizen: { title: t.navCitizen, name: 'Ramesh Reddy', badgeColor: '#2563eb' },
    field_officer: { title: t.roleFieldOfficer, name: 'K. Suresh Kumar', badgeColor: '#059669' },
    panchayat_staff: { title: t.rolePanchayat, name: 'M. Lakshmi Devi', badgeColor: '#0891b2' },
    department_officer: { title: t.roleDeptOfficer, name: 'P. Venkat Rao', badgeColor: '#7c3aed' },
    district_admin: { title: t.roleDistrictCollector, name: 'Dr. Ananya Sharma, IAS', badgeColor: '#c026d3' },
    super_admin: { title: t.roleSuperAdmin, name: 'Rajesh Varma', badgeColor: '#dc2626' },
  };

  const currentLangMeta = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
      {/* Indian National Tricolor Ribbon */}
      <div style={{ height: '4px', width: '100%', display: 'flex' }}>
        <div style={{ flex: 1, background: '#ff9933' }}></div>
        <div style={{ flex: 1, background: '#ffffff' }}></div>
        <div style={{ flex: 1, background: '#138808' }}></div>
      </div>

      {/* Evaluator / Judge Quick Demo Bar */}
      <div
        style={{
          background: '#0c1f4a',
          color: '#e2e8f0',
          padding: '6px 16px',
          fontSize: '0.78rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span
            style={{
              background: '#f59e0b',
              color: '#0c1f4a',
              padding: '2px 8px',
              borderRadius: '4px',
              fontWeight: 800,
              fontSize: '0.7rem',
              letterSpacing: '0.5px',
            }}
          >
            {t.demoBarLabel}
          </span>
          <span style={{ color: '#93c5fd' }}>{t.switchPerspective}</span>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {(Object.keys(roleLabels) as UserRole[]).map((r) => {
              const info = roleLabels[r];
              const isSelected = activeRole === r;
              return (
                <button
                  key={r}
                  onClick={() => {
                    setActiveRole(r);
                    if (r === 'citizen') setCurrentView('citizen');
                    else setCurrentView('official');
                  }}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.73rem',
                    fontWeight: isSelected ? 700 : 500,
                    background: isSelected ? info.badgeColor : 'rgba(255,255,255,0.08)',
                    color: isSelected ? '#ffffff' : '#cbd5e1',
                    border: isSelected ? `1px solid ${info.badgeColor}` : '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.15s',
                  }}
                >
                  {info.title}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onOpenTour && (
            <button
              onClick={onOpenTour}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(255,255,255,0.12)',
                color: '#fef08a',
                border: '1px solid rgba(254, 240, 138, 0.4)',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '0.73rem',
                fontWeight: 700,
              }}
              title="First-Time User Walkthrough Guide"
            >
              <Navigation size={11} /> {t.tourGuideBtn}
            </button>
          )}

          <button
            onClick={onTriggerDemoFlow}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#ffffff',
              padding: '3px 10px',
              borderRadius: '4px',
              fontWeight: 700,
              fontSize: '0.73rem',
              boxShadow: '0 2px 6px rgba(245,158,11,0.3)',
            }}
          >
            <Sparkles size={12} /> {t.runPrimaryDemo}
          </button>

          <button
            onClick={onResetDemo}
            title="Reset complaints and audit logs to pristine initial demo state"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(255,255,255,0.1)',
              color: '#94a3b8',
              padding: '3px 8px',
              borderRadius: '4px',
              fontSize: '0.73rem',
            }}
          >
            <RefreshCw size={11} /> {t.resetData}
          </button>
        </div>
      </div>

      {/* Main Government Navbar */}
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Sovereign Crest & Title */}
        <div
          onClick={() => setCurrentView('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
        >
          {/* Sovereign Emblem (Lion Capital of Ashoka with Satyameva Jayate) */}
          <GovEmblem size={48} variant="ashoka" />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  letterSpacing: '-0.5px',
                  color: 'var(--gov-primary)',
                }}
              >
                {t.brandName}{' '}
                <span style={{ color: 'var(--gov-accent-blue)' }}>PRO</span>
              </span>
              <span
                style={{
                  background: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #a7f3d0',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '4px',
                  letterSpacing: '0.4px',
                }}
              >
                {t.brandSub}
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {t.tagline}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setCurrentView('landing')}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              fontWeight: currentView === 'landing' ? 700 : 500,
              color: currentView === 'landing' ? 'var(--gov-accent-blue)' : 'var(--text-main)',
              background: currentView === 'landing' ? '#eff6ff' : 'transparent',
              fontSize: '0.88rem',
            }}
          >
            {t.navHome}
          </button>

          <button
            id="nav-citizen-portal-btn"
            onClick={() => {
              setActiveRole('citizen');
              setCurrentView('citizen');
            }}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              fontWeight: currentView === 'citizen' ? 700 : 500,
              color: currentView === 'citizen' ? 'var(--gov-accent-blue)' : 'var(--text-main)',
              background: currentView === 'citizen' ? '#eff6ff' : 'transparent',
              fontSize: '0.88rem',
            }}
          >
            {t.navCitizen}
          </button>

          <button
            onClick={() => {
              if (activeRole === 'citizen') setActiveRole('field_officer');
              setCurrentView('official');
            }}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              fontWeight: currentView === 'official' ? 700 : 500,
              color: currentView === 'official' ? 'var(--gov-accent-blue)' : 'var(--text-main)',
              background: currentView === 'official' ? '#eff6ff' : 'transparent',
              fontSize: '0.88rem',
            }}
          >
            {t.navOfficial}
          </button>

          <button
            onClick={() => setCurrentView('transparency')}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              fontWeight: currentView === 'transparency' ? 700 : 500,
              color: currentView === 'transparency' ? 'var(--gov-accent-blue)' : 'var(--text-main)',
              background: currentView === 'transparency' ? '#eff6ff' : 'transparent',
              fontSize: '0.88rem',
            }}
          >
            {t.navTransparency}
          </button>
        </nav>

        {/* Utilities: Search Track, 13 State Language Dropdown, Notifications */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
          {/* Quick Track Button */}
          <button
            id="nav-track-btn"
            onClick={onOpenTrackModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f8fafc',
              border: '1px solid var(--border-color)',
              padding: '7px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--text-main)',
            }}
          >
            <Search size={14} color="var(--gov-accent-blue)" />
            <span>{t.btnTrackGrievance}</span>
          </button>

          {/* All Indian State Languages Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#0c1f4a',
                background: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
              title="Select State Language / భాషను ఎంచుకోండి"
            >
              <Globe size={15} color="#2563eb" />
              <span>{currentLangMeta.name}</span>
              <ChevronDown size={14} color="#64748b" />
            </button>

            {langMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 12px 32px rgba(12, 31, 74, 0.25)',
                  border: '1px solid #e2e8f0',
                  width: '260px',
                  maxHeight: '380px',
                  overflowY: 'auto',
                  zIndex: 200,
                  padding: '6px',
                }}
              >
                <div
                  style={{
                    padding: '8px 12px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#64748b',
                    borderBottom: '1px solid #f1f5f9',
                    letterSpacing: '0.5px',
                  }}
                >
                  ALL INDIAN STATE LANGUAGES (13)
                </div>
                {SUPPORTED_LANGUAGES.map((item) => {
                  const isSelected = item.code === language;
                  return (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLanguage(item.code);
                        setLangMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: isSelected ? '#eff6ff' : 'transparent',
                        color: isSelected ? '#2563eb' : '#1e293b',
                        fontWeight: isSelected ? 800 : 500,
                        fontSize: '0.86rem',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div>
                        <div>{item.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          {item.englishName} • {item.region}
                        </div>
                      </div>
                      {isSelected && <Check size={16} color="#2563eb" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            style={{
              position: 'relative',
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              background: '#f8fafc',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
            }}
            title={t.notificationsTitle}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--gov-danger)',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(220,38,38,0.4)',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Supabase Realtime Live Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.74rem',
              color: '#065f46',
              fontWeight: 700,
            }}
            title="Session active and synchronized to Supabase Cloud"
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#10b981',
                display: 'inline-block',
                boxShadow: '0 0 6px #10b981',
              }}
            />
            <span>Supabase Live</span>
          </div>

          {/* Disconnect & Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#b91c1c',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Disconnect session in Supabase cloud and return to login"
            >
              <LogOut size={13} />
              <span>Disconnect</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
