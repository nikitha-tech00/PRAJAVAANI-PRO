import React, { useEffect, useState } from 'react';
import { 
  Mic, Camera, MapPin, BrainCircuit, Clock, CheckCircle2, 
  ArrowRight, Search, FileText, BarChart3, Users, QrCode, WifiOff, 
  Sparkles, Layers, ShieldAlert, ChevronRight, Play 
} from 'lucide-react';
import { api } from '../api';
import type { SystemStats, LanguageCode } from '../types';
import { getTranslation } from '../translations';
import { GovEmblem } from '../components/GovEmblem';

interface LandingPageProps {
  onOpenCitizen: () => void;
  onOpenOfficial: () => void;
  onOpenTrackModal: () => void;
  onOpenReportModal: () => void;
  language: LanguageCode;
  onTriggerDemoFlow?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenCitizen,
  onOpenOfficial,
  onOpenTrackModal,
  onOpenReportModal,
  language,
  onTriggerDemoFlow,
}) => {
  const t = getTranslation(language);
  const [stats, setStats] = useState<SystemStats>({
    total_complaints: 12485,
    complaints_resolved: 11842,
    active_complaints: 643,
    pending_verification: 18,
    average_resolution_hours: 18.4,
    sla_compliance_rate: 98,
    departments_connected: 8,
    incident_clusters_active: 2,
    citizen_satisfaction_rate: 94.2,
  });

  useEffect(() => {
    api.getAnalytics()
      .then((res) => {
        if (res?.stats) setStats(res.stats);
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '64px', paddingBottom: '60px' }}>
      {/* HERO SECTION */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0c1f4a 0%, #0f2b5c 50%, #1e3a8a 100%)',
          color: 'white',
          padding: '64px 20px 84px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        {/* Subtle Ambient Radial Lighting */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '980px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* Sovereign Emblem & Top Badge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '10px',
                borderRadius: '50%',
                border: '2px solid rgba(251, 191, 36, 0.5)',
                boxShadow: '0 0 25px rgba(245, 158, 11, 0.35)',
                marginBottom: '16px',
              }}
            >
              <GovEmblem size={74} variant="ashoka" />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(37, 99, 235, 0.25)',
                border: '1px solid rgba(147, 197, 253, 0.4)',
                padding: '6px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#fef08a',
                backdropFilter: 'blur(8px)',
                letterSpacing: '0.4px',
              }}
            >
              <Sparkles size={14} color="#f59e0b" />
              <span>{t.heroBadge}</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              color: '#ffffff',
              fontWeight: 800,
              letterSpacing: '-1px',
              lineHeight: 1.18,
              marginBottom: '18px',
            }}
          >
            {t.heroHeadline}
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: '#e2e8f0',
              maxWidth: '820px',
              margin: '0 auto 34px',
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            {t.heroSub}
          </p>

          {/* Call to Actions with unique IDs for tour spotlight */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              marginBottom: '44px',
            }}
          >
            <button
              id="hero-report-btn"
              onClick={onOpenReportModal}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 800,
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.45)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <Mic size={20} />
              <span>{t.btnReportComplaint}</span>
            </button>

            <button
              id="hero-track-btn"
              onClick={onOpenTrackModal}
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                padding: '14px 24px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.25)',
              }}
            >
              <Search size={18} />
              <span>{t.btnTrackComplaint}</span>
            </button>

            <button
              id="hero-citizen-login-btn"
              onClick={onOpenCitizen}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                padding: '14px 24px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 800,
                fontSize: '0.95rem',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              }}
            >
              <span>{t.btnCitizenLogin}</span>
            </button>

            <button
              onClick={onOpenOfficial}
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                color: '#e2e8f0',
                padding: '14px 24px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <span>{t.btnOfficialLogin}</span>
            </button>
          </div>

          {/* 6-Stage Sovereign Workflow Sequence */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-lg)',
              padding: '12px 20px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '12px',
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '0.5px',
            }}
          >
            <span style={{ color: '#60a5fa' }}>{t.step1Title}</span>
            <ChevronRight size={14} color="#94a3b8" />
            <span style={{ color: '#38bdf8' }}>{t.step2Title}</span>
            <ChevronRight size={14} color="#94a3b8" />
            <span style={{ color: '#fbbf24' }}>{t.step3Title}</span>
            <ChevronRight size={14} color="#94a3b8" />
            <span style={{ color: '#a78bfa' }}>{t.step4Title}</span>
            <ChevronRight size={14} color="#94a3b8" />
            <span style={{ color: '#34d399' }}>{t.step5Title}</span>
          </div>
        </div>
      </section>

      {/* SECTION 7: ANIMATED DEMO STATISTICS */}
      <section style={{ maxWidth: '1240px', margin: '-40px auto 0', padding: '0 20px', width: '100%', zIndex: 3 }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '28px',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-color)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>{t.statsTotal}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--gov-primary)', marginTop: '4px' }}>
              {stats.total_complaints.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>100% Geotagged & Verified</div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>{t.statsResolved}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
              {stats.complaints_resolved.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>With Photographic Proof</div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>{t.statsActive}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>
              {stats.active_complaints}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 600 }}>In Active SLA Timers</div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>{t.statsPending}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
              {stats.pending_verification}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 600 }}>Awaiting Citizen Sign-off</div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>{t.statsAvgHours}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--gov-primary)', marginTop: '4px' }}>
              {stats.average_resolution_hours}h
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Benchmark &lt; 24h</div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>{t.statsSla}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>
              {stats.sla_compliance_rate}%
            </div>
            <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>Zero Unauthorized Closure</div>
          </div>
        </div>
      </section>

      {/* PRIMARY HACKATHON DEMO SPOTLIGHT CARD */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px', width: '100%' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #0c1f4a 0%, #1e3a8a 100%)',
            borderRadius: '24px',
            padding: '36px',
            color: '#ffffff',
            boxShadow: '0 20px 40px rgba(12, 31, 74, 0.25)',
            border: '2px solid #f59e0b',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <div style={{ maxWidth: '720px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span
                style={{
                  background: '#f59e0b',
                  color: '#0c1f4a',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                }}
              >
                {t.primaryDemoBadge}
              </span>
              <span style={{ color: '#fef08a', fontSize: '0.82rem', fontWeight: 700 }}>
                PV-2026-004821
              </span>
            </div>

            <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              {t.primaryDemoTitle}
            </h3>
            <p style={{ color: '#93c5fd', fontSize: '1rem', fontStyle: 'italic', marginBottom: '14px' }}>
              {t.primaryDemoScenario}
            </p>
            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6 }}>
              {t.primaryDemoDesc}
            </p>
          </div>

          <div>
            <button
              onClick={() => {
                if (onTriggerDemoFlow) onTriggerDemoFlow();
                else onOpenReportModal();
              }}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#ffffff',
                padding: '16px 28px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              <Play size={18} />
              <span>{t.btnLaunchPrimaryDemo}</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 8: HOW IT WORKS (5 VISUAL STEPS) */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span
            style={{
              background: '#eff6ff',
              color: '#1d4ed8',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
            }}
          >
            {t.brandSub}
          </span>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--gov-primary)', marginTop: '10px' }}>
            {t.pipelineTitle}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
            {t.pipelineSub}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {/* Step 1 */}
          <div
            style={{
              background: '#ffffff',
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
                marginBottom: '16px',
              }}
            >
              1
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', color: 'var(--gov-primary)' }}>
              {t.step1Title}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {t.step1Desc}
            </p>
          </div>

          {/* Step 2 */}
          <div
            style={{
              background: '#ffffff',
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#fef3c7',
                color: '#b45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
                marginBottom: '16px',
              }}
            >
              2
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', color: 'var(--gov-primary)' }}>
              {t.step2Title}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {t.step2Desc}
            </p>
          </div>

          {/* Step 3 */}
          <div
            style={{
              background: '#ffffff',
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#ede9fe',
                color: '#6d28d9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
                marginBottom: '16px',
              }}
            >
              3
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', color: 'var(--gov-primary)' }}>
              {t.step3Title}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {t.step3Desc}
            </p>
          </div>

          {/* Step 4 */}
          <div
            style={{
              background: '#ffffff',
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#dbeafe',
                color: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
                marginBottom: '16px',
              }}
            >
              4
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', color: 'var(--gov-primary)' }}>
              {t.step4Title}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {t.step4Desc}
            </p>
          </div>

          {/* Step 5 */}
          <div
            style={{
              background: '#ffffff',
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
                marginBottom: '16px',
              }}
            >
              5
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', color: 'var(--gov-primary)' }}>
              {t.step5Title}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {t.step5Desc}
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '40px 20px 20px',
          background: '#ffffff',
          color: '#64748b',
          fontSize: '0.85rem',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <GovEmblem size={44} variant="ashoka" />
            <div>
              <div style={{ fontWeight: 800, color: 'var(--gov-primary)', fontSize: '1.1rem' }}>
                {t.brandName}
              </div>
              <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                {t.tagline}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                {t.govtSealTitle} • {t.sovereignMotto}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', flexWrap: 'wrap' }}>
            <button onClick={onOpenReportModal} style={{ color: 'var(--gov-accent-blue)', fontWeight: 700 }}>
              {t.btnReportComplaint}
            </button>
            <button onClick={onOpenTrackModal} style={{ color: 'var(--gov-accent-blue)', fontWeight: 700 }}>
              {t.btnTrackComplaint}
            </button>
            <button onClick={onOpenCitizen} style={{ color: 'var(--gov-accent-blue)', fontWeight: 700 }}>
              {t.btnCitizenLogin}
            </button>
            <button onClick={onOpenOfficial} style={{ color: 'var(--gov-accent-blue)', fontWeight: 700 }}>
              {t.btnOfficialLogin}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
