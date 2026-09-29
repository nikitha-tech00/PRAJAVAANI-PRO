import React, { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle2, Clock, AlertTriangle, MapPin, Camera, 
  Upload, FileText, Send, UserCheck, Layers, RefreshCw, Eye, 
  AlertCircle, ChevronRight, Activity, Wifi, WifiOff, Sparkles, Building2 
} from 'lucide-react';
import type { Complaint, User, UserRole, Department, IncidentCluster, AuditLog, LanguageCode } from '../types';
import { api } from '../api';
import { LeafletMap } from '../components/LeafletMap';
import { getTranslation } from '../translations';
import { GovEmblem } from '../components/GovEmblem';

interface OfficialPortalProps {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  language: LanguageCode;
  onOpenTrackModal: (id: string) => void;
}

export const OfficialPortal: React.FC<OfficialPortalProps> = ({
  activeRole,
  setActiveRole,
  language,
  onOpenTrackModal,
}) => {
  const t = getTranslation(language);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [clusters, setClusters] = useState<IncidentCluster[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  // Field Officer Actions
  const [fieldNote, setFieldNote] = useState('');
  const [afterPhotoUrl, setAfterPhotoUrl] = useState('https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Sub-tabs for Admin Command Center
  const [adminTab, setAdminTab] = useState<'overview' | 'heatmap' | 'clusters' | 'audit' | 'departments'>('overview');

  useEffect(() => {
    loadData();
  }, [activeRole]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [compList, clusList, auditList, deptList] = await Promise.all([
        api.getComplaints(),
        api.getClusters(),
        api.getAuditLogs(),
        api.getDepartments(),
      ]);
      setComplaints(compList);
      setClusters(clusList);
      setAuditLogs(auditList);
      setDepartments(deptList);

      // Auto-select demo complaint PV-2026-004821 if none selected
      if (!selectedComplaint && compList.length > 0) {
        const primary = compList.find((c) => c.complaint_number === 'PV-2026-004821') || compList[0];
        setSelectedComplaint(primary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Field Officer: Start Work
  const handleMarkWorkStarted = async () => {
    if (!selectedComplaint) return;
    try {
      const updated = await api.updateComplaintStatus(
        selectedComplaint.id,
        'IN_PROGRESS',
        'K. Suresh Kumar (Field Officer)',
        'field_officer',
        'Field inspection completed. Repair crew on site.'
      );
      setSelectedComplaint(updated);
      setActionSuccess('Status updated to IN_PROGRESS. Work has commenced.');
      loadData();
    } catch (err) {
      alert('Error updating status');
    }
  };

  // Field Officer: Add Note
  const handleAddFieldNote = async () => {
    if (!selectedComplaint || !fieldNote.trim()) return;
    try {
      const updated = await api.addFieldNote(selectedComplaint.id, fieldNote);
      setSelectedComplaint(updated);
      setFieldNote('');
      setActionSuccess('Field inspection note recorded.');
      loadData();
    } catch (err) {
      alert('Error saving note');
    }
  };

  // Field Officer: Submit Resolution (Upload AFTER evidence)
  const handleSubmitResolution = async () => {
    if (!selectedComplaint) return;
    try {
      const updated = await api.uploadEvidence(selectedComplaint.id, {
        uploaded_by: 'K. Suresh Kumar',
        uploaded_by_role: 'field_officer',
        file_url: afterPhotoUrl,
        file_type: 'image',
        file_name: 'repaired_asphalt_after.jpg',
        file_size_kb: 480,
        evidence_stage: 'AFTER',
        notes: 'Pothole asphalt patch completed and compacted. Surface leveled.',
      });
      setSelectedComplaint(updated);
      setActionSuccess('Resolution proof submitted! Citizen notification dispatched for verification.');
      loadData();
    } catch (err) {
      alert('Error submitting resolution');
    }
  };

  // Department Officer: Accept AI Routing
  const handleAcceptAIRouting = async () => {
    if (!selectedComplaint) return;
    try {
      const updated = await api.assignOfficer(
        selectedComplaint.id,
        'user-officer-1',
        'K. Suresh Kumar',
        'P. Venkat Rao (EE Roads)',
        'department_officer'
      );
      setSelectedComplaint(updated);
      setActionSuccess('AI recommendation accepted. Grievance assigned to Field Officer K. Suresh Kumar.');
      loadData();
    } catch (err) {
      alert('Error assigning grievance');
    }
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '24px 20px', minHeight: '85vh' }}>
      {/* Official Role Context Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0c1f4a 0%, #1e3a8a 100%)',
          color: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-md)',
          border: '1.5px solid rgba(254, 240, 138, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <GovEmblem size={48} variant="ashoka" />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: 800 }}>
                {activeRole === 'field_officer' && `${t.roleFieldOfficer} - Command`}
                {activeRole === 'panchayat_staff' && `${t.rolePanchayat} - Dashboard`}
                {activeRole === 'department_officer' && `${t.roleDeptOfficer} - SLA Center`}
                {activeRole === 'district_admin' && `${t.roleDistrictCollector} - Command`}
                {activeRole === 'super_admin' && `${t.roleSuperAdmin} - Administration`}
              </h2>
              <span
                style={{
                  background: '#f59e0b',
                  color: '#0c1f4a',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                RBAC VERIFIED
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#93c5fd', marginTop: '2px' }}>
              {t.govtSealTitle} • {t.sovereignMotto}
            </div>
          </div>
        </div>

        {/* Offline & Sync Indicators (Section 30 & 31) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
            }}
          >
            <Wifi size={14} color="#10b981" />
            <span style={{ fontWeight: 600 }}>ONLINE & SYNCED</span>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem',
              color: '#cbd5e1',
            }}
          >
            Active Role: <strong style={{ color: '#ffffff' }}>{activeRole.toUpperCase()}</strong>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div
          style={{
            background: '#ecfdf5',
            color: '#065f46',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #a7f3d0',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>✓ {actionSuccess}</span>
          <button onClick={() => setActionSuccess(null)} style={{ fontWeight: 800 }}>
            ✕
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. FIELD OFFICER VIEW                                          */}
      {/* ============================================================== */}
      {activeRole === 'field_officer' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {/* Assigned Queue */}
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '20px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--gov-primary)' }}>My Assigned Tasks</h3>
              <span style={{ fontSize: '0.75rem', background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                {complaints.filter((c) => c.assigned_officer_id === 'user-officer-1').length} Assigned
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {complaints.map((c) => {
                const isSelected = selectedComplaint?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedComplaint(c)}
                    style={{
                      border: isSelected ? '2px solid var(--gov-accent-blue)' : '1px solid var(--border-color)',
                      background: isSelected ? '#f8fafc' : '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--gov-primary)' }}>
                        {c.complaint_number}
                      </span>
                      <span className={`badge badge-${c.status.toLowerCase()}`}>{c.status}</span>
                    </div>

                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '4px' }}>{c.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                      📍 {c.address}
                    </div>

                    {/* SLA countdown highlight */}
                    <div
                      style={{
                        marginTop: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: c.priority === 'CRITICAL' ? '#b91c1c' : '#c2410c',
                      }}
                    >
                      <Clock size={12} />
                      <span>SLA: ~13h 42m remaining (24-Hour Cap)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Field Investigation & Actions */}
          {selectedComplaint && (
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '24px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--gov-accent-blue)' }}>
                    ACTIVE WORKFLOW TARGET
                  </span>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--gov-primary)' }}>
                    {selectedComplaint.complaint_number}: {selectedComplaint.title}
                  </h3>
                </div>
                <button
                  onClick={() => onOpenTrackModal(selectedComplaint.complaint_number)}
                  style={{
                    background: '#f1f5f9',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                  }}
                >
                  Public Timeline
                </button>
              </div>

              {/* GPS Navigation Map */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                  LOCATION & NAVIGATION PIN
                </div>
                <LeafletMap
                  height="220px"
                  center={[selectedComplaint.latitude, selectedComplaint.longitude]}
                  markerPosition={[selectedComplaint.latitude, selectedComplaint.longitude]}
                />
              </div>

              {/* Before Evidence vs After Photo Submission */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
                  FIELD PHOTOGRAPHIC EVIDENCE WORKFLOW
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <div style={{ background: '#0a192f', color: 'white', padding: '4px 8px', fontSize: '0.7rem', fontWeight: 700 }}>
                      BEFORE (REPORTED)
                    </div>
                    <div style={{ height: '110px' }}>
                      <img
                        src={selectedComplaint.evidence[0]?.file_url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </div>

                  <div style={{ border: '2px dashed #10b981', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <div style={{ background: '#059669', color: 'white', padding: '4px 8px', fontSize: '0.7rem', fontWeight: 700 }}>
                      AFTER (REPAIRED EVIDENCE)
                    </div>
                    <div style={{ height: '110px' }}>
                      <img
                        src={afterPhotoUrl}
                        alt="After"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Mark In Progress, Field Note, Submit Resolution */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedComplaint.status !== 'IN_PROGRESS' && selectedComplaint.status !== 'RESOLVED' && selectedComplaint.status !== 'CLOSED' && (
                  <button
                    onClick={handleMarkWorkStarted}
                    style={{
                      background: 'var(--gov-accent-blue)',
                      color: 'white',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                    }}
                  >
                    ▶ MARK WORK IN PROGRESS (COMMENCE ON SITE)
                  </button>
                )}

                {/* Add Field Note */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={fieldNote}
                    onChange={(e) => setFieldNote(e.target.value)}
                    placeholder="Add field inspection note (e.g. asphalt batch leveling)..."
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem',
                    }}
                  />
                  <button
                    onClick={handleAddFieldNote}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid var(--border-color)',
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                    }}
                  >
                    Add Note
                  </button>
                </div>

                {/* Submit Resolution */}
                {selectedComplaint.status !== 'RESOLVED' && selectedComplaint.status !== 'CLOSED' && (
                  <button
                    onClick={handleSubmitResolution}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                    }}
                  >
                    ✓ UPLOAD AFTER EVIDENCE & SUBMIT RESOLUTION
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. DEPARTMENT OFFICER VIEW                                     */}
      {/* ============================================================== */}
      {activeRole === 'department_officer' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {/* Department Queue */}
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '20px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--gov-primary)', marginBottom: '14px' }}>
              Department Grievance Queue (Roads & Buildings)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {complaints.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedComplaint(c)}
                  style={{
                    border: selectedComplaint?.id === c.id ? '2px solid var(--gov-accent-blue)' : '1px solid var(--border-color)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800 }}>{c.complaint_number}</span>
                    <span className={`badge badge-priority-${c.priority.toLowerCase()}`}>{c.priority}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', marginTop: '4px' }}>{c.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Assigned: {c.assigned_officer_name || 'Unassigned'}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendation Review Center */}
          {selectedComplaint && (
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '24px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Sparkles size={20} color="#7c3aed" />
                <h3 style={{ fontSize: '1.15rem', color: 'var(--gov-primary)' }}>
                  AI Routing & Priority Review Center
                </h3>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', marginBottom: '18px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>AI RECOMMENDATION PROPOSAL</div>
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.88rem' }}>
                  <div>Target Department: <strong>{selectedComplaint.department_name}</strong></div>
                  <div>Recommended Priority: <strong style={{ color: '#c2410c' }}>{selectedComplaint.priority}</strong> (Confidence: 91%)</div>
                  <div>Suggested Field Officer: <strong>K. Suresh Kumar (Zone 3 Road Maintenance)</strong></div>
                </div>

                <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#475569', background: '#ffffff', padding: '10px', borderRadius: '6px' }}>
                  <strong>Explainability:</strong> School zone boundary detected; 3 nearby reports indicate emerging road defect cluster.
                </div>
              </div>

              {/* Human-in-the-Loop Decision Buttons (Section 23 & 45) */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleAcceptAIRouting}
                  style={{
                    flex: 1,
                    background: '#059669',
                    color: 'white',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                  }}
                >
                  ✓ ACCEPT AI RECOMMENDATION
                </button>
                <button
                  onClick={() => alert('Department officer opened manual routing modifier.')}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid var(--border-color)',
                    padding: '12px 18px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  Modify / Override
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. DISTRICT ADMINISTRATOR & SUPER ADMIN VIEW                   */}
      {/* ============================================================== */}
      {(activeRole === 'district_admin' || activeRole === 'super_admin' || activeRole === 'panchayat_staff') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Sub Navigation Bar */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setAdminTab('overview')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: adminTab === 'overview' ? 'var(--gov-primary)' : '#ffffff',
                color: adminTab === 'overview' ? '#ffffff' : 'var(--text-main)',
                border: '1px solid var(--border-color)',
              }}
            >
              System Overview & KPIs
            </button>

            <button
              onClick={() => setAdminTab('heatmap')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: adminTab === 'heatmap' ? 'var(--gov-primary)' : '#ffffff',
                color: adminTab === 'heatmap' ? '#ffffff' : 'var(--text-main)',
                border: '1px solid var(--border-color)',
              }}
            >
              GIS Heatmap & Locations
            </button>

            <button
              onClick={() => setAdminTab('clusters')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: adminTab === 'clusters' ? 'var(--gov-primary)' : '#ffffff',
                color: adminTab === 'clusters' ? '#ffffff' : 'var(--text-main)',
                border: '1px solid var(--border-color)',
              }}
            >
              Civic Incident Clusters ({clusters.length})
            </button>

            <button
              onClick={() => setAdminTab('audit')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: adminTab === 'audit' ? 'var(--gov-primary)' : '#ffffff',
                color: adminTab === 'audit' ? '#ffffff' : 'var(--text-main)',
                border: '1px solid var(--border-color)',
              }}
            >
              Immutable Audit Logs ({auditLogs.length})
            </button>
          </div>

          {/* TAB 1: SYSTEM OVERVIEW */}
          {adminTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div style={{ background: '#ffffff', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>TOTAL COMPLAINTS TODAY</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gov-primary)', marginTop: '4px' }}>
                    148
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>CRITICAL LIFE-SAFETY</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
                    {complaints.filter((c) => c.priority === 'CRITICAL').length}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 700 }}>4-Hour Escalation Rule</span>
                </div>

                <div style={{ background: '#ffffff', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>SLA BREACHES AUDITED</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                    0
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>100% On-Time Compliance</span>
                </div>

                <div style={{ background: '#ffffff', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>DEPARTMENTS CONNECTED</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gov-primary)', marginTop: '4px' }}>
                    {departments.length}
                  </div>
                </div>
              </div>

              {/* Department Workload Summary Table */}
              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '24px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--gov-primary)', marginBottom: '14px' }}>
                  District Department Operations & SLA Health
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                        <th style={{ padding: '10px 12px' }}>Department</th>
                        <th style={{ padding: '10px 12px' }}>Critical SLA</th>
                        <th style={{ padding: '10px 12px' }}>High SLA</th>
                        <th style={{ padding: '10px 12px' }}>Service Area</th>
                        <th style={{ padding: '10px 12px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.map((dept) => (
                        <tr key={dept.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px', fontWeight: 700 }}>{dept.name}</td>
                          <td style={{ padding: '12px', color: '#b91c1c', fontWeight: 700 }}>{dept.sla_hours_critical}h</td>
                          <td style={{ padding: '12px', color: '#c2410c', fontWeight: 700 }}>{dept.sla_hours_high}h</td>
                          <td style={{ padding: '12px', color: '#64748b' }}>{dept.service_area}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                              OPERATIONAL
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GIS HEATMAP */}
          {adminTab === 'heatmap' && (
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '24px', border: '1px solid var(--border-color)' }}>
              <div style={{ marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--gov-primary)' }}>District Spatial Grievance Heatmap</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Live spatial rendering of grievances tagged across Rangareddy & Hyderabad circles.
                </p>
              </div>
              <LeafletMap
                height="480px"
                center={[17.4401, 78.3489]}
                zoom={14}
                complaintMarkers={complaints.map((c) => ({
                  id: c.id,
                  complaint_number: c.complaint_number,
                  position: [c.latitude, c.longitude],
                  title: c.title,
                  category: c.category_name,
                  priority: c.priority,
                  status: c.status,
                }))}
                clusters={clusters.map((cl) => ({
                  id: cl.id,
                  title: cl.title,
                  center: [cl.center_latitude, cl.center_longitude],
                  radius: cl.radius_meters,
                  severity: cl.severity,
                  count: cl.complaint_count,
                }))}
              />
            </div>
          )}

          {/* TAB 3: CIVIC INCIDENT CLUSTERS */}
          {adminTab === 'clusters' && (
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '24px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--gov-primary)', marginBottom: '16px' }}>
                Emerging Civic Incident Clusters (Spatial Grouping)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
                {clusters.map((cl) => (
                  <div
                    key={cl.id}
                    style={{
                      border: '1px solid #fdba74',
                      background: '#fffaf5',
                      borderRadius: 'var(--radius-lg)',
                      padding: '18px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', background: '#ffedd5', color: '#c2410c', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                        {cl.severity} INCIDENT
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Radius: {cl.radius_meters}m</span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', color: '#9a3412', marginTop: '10px' }}>{cl.title}</h4>
                    <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px' }}>
                      📍 {cl.affected_area}
                    </p>

                    <div style={{ marginTop: '12px', fontSize: '0.78rem', color: '#64748b' }}>
                      Linked Grievances ({cl.complaint_numbers.length}):{' '}
                      <strong>{cl.complaint_numbers.join(', ')}</strong>
                    </div>

                    <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => alert(`Confirmed Civic Incident: ${cl.title}. Coordinating joint engineering squad.`)}
                        style={{
                          background: '#ea580c',
                          color: 'white',
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                        }}
                      >
                        Confirm Incident
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: IMMUTABLE AUDIT LOGS */}
          {adminTab === 'audit' && (
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '24px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--gov-primary)' }}>Official Audit Trail</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Immutable administrative ledger recording all status transitions, AI overrides, and officer actions.
                  </p>
                </div>
                <button
                  onClick={loadData}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: '#f1f5f9',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.78rem',
                  }}
                >
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                      <th style={{ padding: '10px 12px' }}>Timestamp</th>
                      <th style={{ padding: '10px 12px' }}>Actor (Who)</th>
                      <th style={{ padding: '10px 12px' }}>Action (What)</th>
                      <th style={{ padding: '10px 12px' }}>Entity ID</th>
                      <th style={{ padding: '10px 12px' }}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td style={{ padding: '12px', fontWeight: 700 }}>
                          {log.user_name} ({log.role})
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '0.72rem' }}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ padding: '12px', fontWeight: 600 }}>{log.entity_id}</td>
                        <td style={{ padding: '12px', color: '#475569' }}>
                          {log.new_value || log.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
