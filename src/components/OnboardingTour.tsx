import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Check, X, Sparkles, Navigation, UserCheck, Mic, Search, Globe } from 'lucide-react';
import type { LanguageCode } from '../types';
import { getTranslation, SUPPORTED_LANGUAGES } from '../translations';
import { GovEmblem } from './GovEmblem';

interface OnboardingTourProps {
  language: LanguageCode;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCitizen: () => void;
  onNavigateToReport: () => void;
  onNavigateToTrack: () => void;
  onLanguageChange?: (lang: LanguageCode) => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  language,
  isOpen,
  onClose,
  onNavigateToCitizen,
  onNavigateToReport,
  onNavigateToTrack,
  onLanguageChange,
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
        background: 'rgba(10, 25, 47, 0.82)',
        backdropFilter: 'blur(8px)',
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
          borderRadius: '24px',
          maxWidth: '580px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.45), 0 0 0 2px rgba(245, 158, 11, 0.4)',
          position: 'relative',
          border: '2px solid #f59e0b',
        }}
      >
        {/* Tricolor Ribbon Top Accent */}
        <div style={{ height: '5px', width: '100%', display: 'flex' }}>
          <div style={{ flex: 1, background: '#ff9933' }}></div>
          <div style={{ flex: 1, background: '#ffffff' }}></div>
          <div style={{ flex: 1, background: '#138808' }}></div>
        </div>

        {/* Modal Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0c1f4a 0%, #0f2b5c 100%)',
            color: '#ffffff',
            padding: '18px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.12)',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <GovEmblem size={44} variant="logo" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.3px', color: '#fef08a' }}>
                  {t.brandName}
                </span>
                <span
                  style={{
                    background: '#f59e0b',
                    color: '#0c1f4a',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                  }}
                >
                  Step {currentStep} / {totalSteps}
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#93c5fd' }}>{t.tagline}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Direct Language Switcher Inside Tour Modal */}
            {onLanguageChange && (
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <select
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  title="Change language directly"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} style={{ background: '#0c1f4a', color: '#ffffff' }}>
                      {l.name} ({l.englishName})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
              }}
              title="Skip / Close Guidance"
            >
              <X size={18} />
            </button>
          </div>
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

              {/* Sovereign Heraldic Highlights with Arrow */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                  border: '2px solid #f59e0b',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  marginTop: '14px',
                }}
              >
                <div
                  style={{
                    fontSize: '2rem',
                    animation: 'bounceRight 1s infinite alternate ease-in-out',
                    color: '#d97706',
                    flexShrink: 0,
                  }}
                >
                  ↗️
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#92400e' }}>
                    👉 {language === 'te' ? 'పైభాగంలో మీ ప్రాధాన్య భాషను మార్చుకోండి (13 భాషలు)' : 'Step 1: Choose Your Preferred Language (13 Languages)'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#78350f', marginTop: '2px', lineHeight: 1.4 }}>
                    {language === 'te'
                      ? 'భాషను ఎంచుకున్న వెంటనే అన్ని సూచనలు, బటన్లు మరియు వాయిస్ ఇన్‌పుట్ స్వయంచాలకంగా మారుతాయి!'
                      : 'All guidance steps, forms, and voice AI immediately adapt dynamically across all 13 Indian State languages.'}
                  </div>
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
                    👉 {t.fullNameLabel} & {t.mobileNumberLabel} / Gmail
                  </span>
                </div>
              </div>

              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
                {t.tourStep2Desc}
              </p>

              {/* Animated Pointer Box */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                  border: '2px solid #3b82f6',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    fontSize: '2rem',
                    animation: 'bounceRight 1s infinite alternate ease-in-out',
                    color: '#2563eb',
                    flexShrink: 0,
                  }}
                >
                  👉
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1e40af' }}>
                    👉 {language === 'te' ? 'ఆధార్ పేరు & మొబైల్ (+91) లేదా జీమెయిల్‌తో లాగిన్ చేయండి' : 'Step 2: Enter Aadhaar Name & Mobile or Gmail'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#1e3a8a', marginTop: '2px', lineHeight: 1.4 }}>
                    {language === 'te'
                      ? 'OTP మొబైల్ లేదా జీమెయిల్‌కు పంపబడుతుంది. 1 నిమిషం తర్వాత తిరిగి పంపే అవకాశం ఉంటుంది. లాగిన్ సమాచారం స్వయంచాలకంగా సుపాబేస్‌లో కనెక్ట్ అవుతుంది!'
                      : 'Receive OTP via Mobile or Gmail with a 1-minute resend timer. All login details connect in live Supabase cloud database.'}
                  </div>
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

              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
                {t.tourStep3Desc}
              </p>

              {/* Animated Pointer Box */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                  border: '2px solid #10b981',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    fontSize: '2rem',
                    animation: 'bounceRight 1s infinite alternate ease-in-out',
                    color: '#059669',
                    flexShrink: 0,
                  }}
                >
                  ⬇️
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#065f46' }}>
                    ⬇️ {language === 'te' ? 'వాయిస్ మైక్‌తో మాట్లాడండి & ఫోటోను అప్‌లోడ్ చేయండి' : 'Step 3: Speak via Voice Mic & Upload Geotagged Evidence'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#047857', marginTop: '2px', lineHeight: 1.4 }}>
                    {language === 'te'
                      ? 'మీ భాషలో సమస్యను చెప్పండి. కంప్యూటర్ విజన్ AI ఫోటో నాణ్యతను తనిఖీ చేసి తగిన శాఖకు ఆటో-రౌట్ చేస్తుంది.'
                      : 'Speak in your native language. AI grades defect severity and routes directly to departmental engineers.'}
                  </div>
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

              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
                {t.tourStep4Desc}
              </p>

              {/* Animated Pointer Box */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)',
                  border: '2px solid #eab308',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    fontSize: '2rem',
                    animation: 'bounceRight 1s infinite alternate ease-in-out',
                    color: '#ca8a04',
                    flexShrink: 0,
                  }}
                >
                  👉
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#854d0e' }}>
                    👉 {language === 'te' ? 'BEFORE / AFTER ఫోటోలను సరిచూసి పరిష్కారాన్ని ధృవీకరించండి' : 'Step 4: Inspect Before vs After Proof & Signoff'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#713f12', marginTop: '2px', lineHeight: 1.4 }}>
                    {language === 'te'
                      ? 'క్షేత్ర స్థాయి పనుల తర్వాత ఫోటోను చూసి మాత్రమే మీరు సంతృప్తి చెంది క్లోజ్ చేయవచ్చు లేదా రీఓపెన్ చేయవచ్చు!'
                      : 'Inspect photographic field evidence. Citizens hold the sovereign right to mark Issue Resolved or Reopen.'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '12px',
                  fontSize: '0.8rem',
                  color: '#334155',
                  lineHeight: 1.5,
                  marginTop: '14px',
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
