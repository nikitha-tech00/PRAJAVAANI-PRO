import React, { useState } from 'react';
import { 
  X, Sparkles, CheckCircle2, ChevronRight, Mic, Camera, MapPin, 
  UserCheck, AlertTriangle, ArrowRight, ShieldCheck, Star 
} from 'lucide-react';
import type { UserRole } from '../types';

interface DemoFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetRoleAndView: (role: UserRole, view: 'landing' | 'citizen' | 'official' | 'transparency') => void;
  onOpenTrackModal: (id: string) => void;
}

export const DemoFlowModal: React.FC<DemoFlowModalProps> = ({
  isOpen,
  onClose,
  onSetRoleAndView,
  onOpenTrackModal,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: 'Citizen Voice Complaint & AI Processing',
      actor: 'Citizen (Ramesh Reddy)',
      description:
        'Citizen speaks in Telugu: "పాఠశాల దగ్గర పెద్ద గుంత ఉంది..." AI transcribes, translates to English, and evaluates road asphalt damage (91% confidence, High Priority).',
      actionLabel: 'Open Citizen Portal',
      onExecute: () => {
        onSetRoleAndView('citizen', 'citizen');
        onClose();
      },
    },
    {
      step: 2,
      title: 'Department AI Routing Review & Officer Assignment',
      actor: 'Department Officer (P. Venkat Rao, EE)',
      description:
        'Department Executive Engineer inspects AI routing recommendation, reviews explainability (School Zone proximity), and accepts assignment to Field Officer K. Suresh Kumar.',
      actionLabel: 'Open Department Review',
      onExecute: () => {
        onSetRoleAndView('department_officer', 'official');
        onClose();
      },
    },
    {
      step: 3,
      title: 'Field Officer Inspection & Resolution Proof',
      actor: 'Field Officer (K. Suresh Kumar)',
      description:
        'Field Officer navigates to site using GPS map, marks Work In Progress, uploads asphalt batch progress proof, completes repair, and uploads AFTER photo for AI comparison.',
      actionLabel: 'Open Field Officer Command',
      onExecute: () => {
        onSetRoleAndView('field_officer', 'official');
        onClose();
      },
    },
    {
      step: 4,
      title: 'Citizen Verification & 5-Star Feedback',
      actor: 'Citizen (Ramesh Reddy)',
      description:
        'Citizen receives resolution notification, inspects Before vs After evidence, selects "YES, ISSUE RESOLVED", rates 5 Stars, and finalizes complaint closure!',
      actionLabel: 'Open Citizen Verification',
      onExecute: () => {
        onSetRoleAndView('citizen', 'citizen');
        onClose();
      },
    },
    {
      step: 5,
      title: 'District Command Center & Public Transparency',
      actor: 'District Collector & Super Admin',
      description:
        'District Administrator views updated SLA compliance, GIS heatmap density, emerging incident clusters, and immutable audit logs.',
      actionLabel: 'Open District Command Center',
      onExecute: () => {
        onSetRoleAndView('district_admin', 'official');
        onClose();
      },
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 25, 47, 0.85)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
        padding: '16px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '780px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-color)',
        }}
        className="animate-slide-down"
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0a2540 0%, #1e3a8a 100%)',
            color: 'white',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={20} color="white" />
            </div>
            <div>
              <h3 style={{ color: 'white', fontSize: '1.2rem' }}>
                Primary Hackathon Scenario: "Dangerous Pothole Near School"
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#93c5fd' }}>
                End-to-End Walkthrough (PV-2026-004821) • Sections 61 - 65
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'white', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Steps List */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {steps.map((st) => (
            <div
              key={st.step}
              style={{
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                background: '#f8fafc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', maxWidth: '520px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--gov-accent-blue)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    flexShrink: 0,
                  }}
                >
                  {st.step}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--gov-primary)' }}>
                      {st.title}
                    </span>
                    <span
                      style={{
                        background: '#e0f2fe',
                        color: '#0369a1',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {st.actor}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px', lineHeight: 1.5 }}>
                    {st.description}
                  </p>
                </div>
              </div>

              <button
                onClick={st.onExecute}
                style={{
                  background: 'var(--gov-primary)',
                  color: 'white',
                  padding: '9px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{st.actionLabel}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          ))}

          {/* Quick Track Action */}
          <div
            style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-md)',
              padding: '12px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '0.82rem', color: '#1e40af' }}>
              Want to see the complete verified timeline immediately?
            </div>
            <button
              onClick={() => {
                onOpenTrackModal('PV-2026-004821');
                onClose();
              }}
              style={{
                background: '#2563eb',
                color: 'white',
                padding: '6px 14px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.78rem',
              }}
            >
              Track PV-2026-004821
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
