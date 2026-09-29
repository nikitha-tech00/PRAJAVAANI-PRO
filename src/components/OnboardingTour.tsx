import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Check, X, Sparkles, Navigation, UserCheck, Mic, Search } from 'lucide-react';
import type { LanguageCode } from '../types';
import { getTranslation } from '../translations';
import { GovEmblem } from './GovEmblem';

interface OnboardingTourProps {
  language: LanguageCode;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCitizen: () => void;
  onNavigateToReport: () => void;
  onNavigateToTrack: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  language,
  isOpen,
  onClose,
  onNavigateToCitizen,
  onNavigateToReport,
  onNavigateToTrack,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const t = getTranslation(language);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (next === 2) onNavigateToCitizen();
      else if (next === 3) onNavigateToReport();
      else if (next === 4) onNavigateToTrack();
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(10, 25, 47, 0.78)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          maxWidth: '560px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(245, 158, 11, 0.3)',
          position: 'relative',
          border: '2px solid #f59e0b',
        }}
      >
        {/* Tricolor Ribbon Top Accent */}
        <div style={{ height: '4px', width: '100%', display: 'flex' }}>
          <div style={{ flex: 1, background: '#ff9933' }}></div>
          <div style={{ flex: 1, background: '#ffffff' }}></div>
          <div style={{ flex: 1, background: '#138808' }}></div>
        </div>

        {/* Modal Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0c1f4a 0%, #0f2b5c 100%)',
            color: '#ffffff',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <GovEmblem size={42} variant="ashoka" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.3px', color: '#fef08a' }}>
                  {t.brandName}
                </span>
                <span
                  style={{
                    background: '#f59e0b',
                    color: '#0c1f4a',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                  }}
                >
                  {currentStep} / {totalSteps}
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#93c5fd' }}>{t.tagline}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#ffffff',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Skip / Close Tour"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tour Step Body */}
        <div style={{ padding: '28px 24px' }}>
          {currentStep === 1 && (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                }}
              >
                <Sparkles size={32} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--gov-primary)', marginBottom: '10px' }}>
                {t.tourStep1Title}
              </h3>
              <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                {t.tourStep1Desc}
              </p>

              {/* Sovereign Heraldic Highlights */}
              <div
                style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '10px',
                }}
              >
                <div style={{ fontSize: '1.4rem' }}>🏛️</div>
                <div style={{ fontSize: '0.8rem', color: '#92400e', lineHeight: 1.4 }}>
                  <strong>{t.govtSealTitle}</strong> — {t.sovereignMotto}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                  }}
                >
                  <UserCheck size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--gov-primary)' }}>
                    {t.tourStep2Title}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 700 }}>
                    👉 {t.fullNameLabel} & {t.mobileNumberLabel}
                  </span>
                </div>
              </div>

              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '18px' }}>
                {t.tourStep2Desc}
              </p>

              {/* Animated Pointer Box */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '2px dashed #f59e0b',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    fontSize: '1.6rem',
                    animation: 'bounceRight 1s infinite alternate ease-in-out',
                  }}
                >
                  👉
                </div>
                <div style={{ fontSize: '0.82rem', color: '#1e293b' }}>
                  <strong>{t.aadhaarVerifiedBadge}</strong>: {t.aadhaarCompulsoryNote}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: '#ecfdf5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Mic size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--gov-primary)' }}>
                    {t.tourStep3Title}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
                    {t.btnSpeakVoice} + GPS
                  </span>
                </div>
              </div>

              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '18px' }}>
                {t.tourStep3Desc}
              </p>

              {/* Step Highlights */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    padding: '10px',
                    fontSize: '0.78rem',
                    color: '#166534',
                  }}
                >
                  🎙 <strong>{t.voiceNotesTitle}</strong>
                  <br />
                  {t.voiceNote1}
                </div>
                <div
                  style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '8px',
                    padding: '10px',
                    fontSize: '0.78rem',
                    color: '#1e40af',
                  }}
                >
                  📸 <strong>{t.evidenceNotesTitle}</strong>
                  <br />
                  {t.evidenceNote1}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: '#fef3c7',
                    color: '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Search size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--gov-primary)' }}>
                    {t.tourStep4Title}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: 700 }}>
                    {t.beforeAfterComparisonTitle}
                  </span>
                </div>
              </div>

              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '18px' }}>
                {t.tourStep4Desc}
              </p>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '12px',
                  fontSize: '0.8rem',
                  color: '#334155',
                  lineHeight: 1.5,
                }}
              >
                ⚖️ <strong>{t.verificationRightsTitle}</strong>
                <div style={{ marginTop: '4px', color: '#475569' }}>{t.verificationRight1}</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div
          style={{
            background: '#f8fafc',
            borderTop: '1px solid var(--border-color)',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Progress Indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                onClick={() => setCurrentStep(step)}
                style={{
                  width: currentStep === step ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: currentStep === step ? '#f59e0b' : '#cbd5e1',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {currentStep > 1 && (
              <button
                onClick={handlePrev}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#475569',
                  background: '#ffffff',
                  border: '1px solid var(--border-color)',
                }}
              >
                <ArrowLeft size={14} /> {t.tourBtnPrev}
              </button>
            )}

            <button
              onClick={handleNext}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 700,
                color: '#ffffff',
                background: currentStep === totalSteps ? '#059669' : '#0c1f4a',
                border: 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              }}
            >
              <span>{currentStep === totalSteps ? t.tourBtnFinish : t.tourBtnNext}</span>
              {currentStep === totalSteps ? <Check size={14} /> : <ArrowRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
