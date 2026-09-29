import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, AlertTriangle, ShieldCheck, MapPin, Building, QrCode } from 'lucide-react';
import type { Complaint, LanguageCode } from '../types';
import { api } from '../api';
import { getTranslation } from '../translations';
import { GovEmblem } from './GovEmblem';

interface PublicTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialComplaintNumber?: string;
  language?: LanguageCode;
}

export const PublicTrackingModal: React.FC<PublicTrackingModalProps> = ({
  isOpen,
  onClose,
  initialComplaintNumber = 'PV-2026-004821',
  language = 'en',
}) => {
  const t = getTranslation(language);
  const [searchId, setSearchId] = useState(initialComplaintNumber);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (idToSearch?: string) => {
    const id = idToSearch || searchId;
    if (!id.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await api.getComplaintById(id.trim());
      setComplaint(data);
    } catch {
      setError(`No grievance found with reference ID "${id}". Please verify and try again.`);
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '16px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          width: '740px',
          maxWidth: '100%',
          maxHeight: '90vh',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
        }}
        className="animate-slide-down"
      >
        {/* Modal Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0a2540 0%, #1e3a8a 100%)',
            color: 'white',
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <GovEmblem size={40} variant="ashoka" />
            <div>
              <h3 style={{ color: 'white', fontSize: '1.18rem', fontWeight: 800 }}>{t.publicTrackingTitle}</h3>
              <p style={{ fontSize: '0.74rem', color: '#93c5fd' }}>
                {t.zeroPiiNotice}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              color: 'white',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '50%',
              padding: '6px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '18px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={18}
                color="#64748b"
                style={{ position: 'absolute', left: '14px', top: '12px' }}
              />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter Complaint ID (e.g. PV-2026-004821)"
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 42px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              style={{
                background: 'var(--gov-accent-blue)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </div>

          {/* Quick presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontSize: '0.75rem', color: '#64748b' }}>
            <span>Demo presets:</span>
            {['PV-2026-004821', 'PV-2026-004519', 'PV-2026-004102'].map((id) => (
              <button
                key={id}
                onClick={() => {
                  setSearchId(id);
                  handleSearch(id);
                }}
                style={{
                  background: '#e2e8f0',
                  color: '#334155',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 600,
                }}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {error && (
            <div
              style={{
                background: '#fef2f2',
                color: '#b91c1c',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #fecaca',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          {!complaint && !error && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <Search size={48} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ color: 'var(--gov-primary)' }}>Search Any Public Grievance</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
                Enter the formal Complaint ID generated upon submission to inspect verified timeline, SLA compliance, and photographic proof.
              </p>
            </div>
          )}

          {complaint && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Complaint Overview Card */}
              <div
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px',
                  background: '#ffffff',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--gov-primary)' }}>
                        {complaint.complaint_number}
                      </span>
                      <span className={`badge badge-${complaint.status.toLowerCase()}`}>
                        {complaint.status}
                      </span>
                      <span className={`badge badge-priority-${complaint.priority.toLowerCase()}`}>
                        {complaint.priority} Priority
                      </span>
                    </div>
                    <h4 style={{ marginTop: '8px', color: 'var(--text-main)', fontSize: '1.05rem' }}>
                      {complaint.title}
                    </h4>
                  </div>

                  {/* QR Tracking Code */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.75rem',
                      color: '#475569',
                    }}
                  >
                    <QrCode size={22} color="var(--gov-primary)" />
                    <div>
                      <div style={{ fontWeight: 700 }}>QR Track Verified</div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Secure Public URL</div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    marginTop: '16px',
                    padding: '12px',
                    background: '#f8fafc',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.82rem',
                  }}
                >
                  <div>
                    <span style={{ color: '#64748b' }}>Department:</span>
                    <div style={{ fontWeight: 700, color: 'var(--gov-primary)' }}>{complaint.department_name}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Location:</span>
                    <div style={{ fontWeight: 600 }}>{complaint.address}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>SLA Timeframe:</span>
                    <div style={{ fontWeight: 700, color: '#b45309' }}>
                      {complaint.sla_hours_allotted} Hours Allotted
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Assigned Officer:</span>
                    <div style={{ fontWeight: 600 }}>
                      {complaint.assigned_officer_name || 'Departmental Review Queue'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Before & After Evidence Chain */}
              {complaint.evidence && complaint.evidence.length > 0 && (
                <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '18px' }}>
                  <h4 style={{ marginBottom: '12px', fontSize: '0.95rem' }}>Photographic Verification Evidence Chain</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                    {complaint.evidence.map((ev, i) => (
                      <div
                        key={i}
                        style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          background: '#f8fafc',
                        }}
                      >
                        <div style={{ position: 'relative', height: '140px', background: '#e2e8f0' }}>
                          <img
                            src={ev.file_url}
                            alt={ev.evidence_stage}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <span
                            style={{
                              position: 'absolute',
                              top: '8px',
                              left: '8px',
                              background: ev.evidence_stage === 'AFTER' ? '#059669' : '#0f172a',
                              color: 'white',
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '4px',
                            }}
                          >
                            {ev.evidence_stage} PROOF
                          </span>
                        </div>
                        <div style={{ padding: '8px 10px', fontSize: '0.72rem', color: '#64748b' }}>
                          <div>Uploaded by: {ev.uploaded_by}</div>
                          <div style={{ marginTop: '2px' }}>
                            {new Date(ev.uploaded_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Public Timeline */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '18px' }}>
                <h4 style={{ marginBottom: '16px', fontSize: '0.95rem' }}>Transparent Progress Timeline</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                  {complaint.history.map((h, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: '#10b981',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          flexShrink: 0,
                        }}
                      >
                        <CheckCircle2 size={16} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--gov-primary)' }}>
                            {h.new_status}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '2px' }}>
                          {h.note}
                        </p>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          Actor: {h.changed_by}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
