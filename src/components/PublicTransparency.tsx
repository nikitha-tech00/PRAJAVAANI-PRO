import React, { useEffect, useState } from 'react';
import { BarChart3, CheckCircle2, Clock, AlertTriangle, ShieldCheck, TrendingUp, Users, Building2, MapPin } from 'lucide-react';
import { api } from '../api';
import type { SystemStats, LanguageCode } from '../types';
import { LeafletMap } from './LeafletMap';
import { getTranslation } from '../translations';
import { GovEmblem } from './GovEmblem';

interface PublicTransparencyProps {
  language?: LanguageCode;
}

export const PublicTransparency: React.FC<PublicTransparencyProps> = ({ language = 'en' }) => {
  const t = getTranslation(language);
  const [analytics, setAnalytics] = useState<{
    stats: SystemStats;
    departmentBreakdown: any[];
    categoryBreakdown: any[];
  } | null>(null);
  const [heatmapPoints, setHeatmapPoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getAnalytics(), api.getHeatmapPoints()])
      .then(([aData, hData]) => {
        setAnalytics(aData);
        setHeatmapPoints(hData);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading || !analytics) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
        <Clock size={36} className="animate-pulse-subtle" style={{ margin: '0 auto 12px' }} />
        <h3>Loading Verified Civic Transparency Data...</h3>
      </div>
    );
  }

  const { stats, departmentBreakdown, categoryBreakdown } = analytics;

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Title & Banner */}
      <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <GovEmblem size={56} variant="ashoka" />
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#ecfdf5',
            color: '#059669',
            padding: '5px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.78rem',
            fontWeight: 800,
            marginBottom: '12px',
            border: '1px solid #a7f3d0',
          }}
        >
          <ShieldCheck size={16} /> ZERO-PII OPEN CIVIC DATA INITIATIVE
        </div>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--gov-primary)', fontWeight: 800, letterSpacing: '-0.5px' }}>
          {t.transparencyTitle}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', marginTop: '10px', lineHeight: 1.6 }}>
          {t.zeroPiiNotice}
        </p>
      </div>

      {/* KPI Highlight Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '22px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            borderTop: '4px solid var(--gov-accent-blue)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Grievances Handled</span>
            <TrendingUp size={20} color="var(--gov-accent-blue)" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--gov-primary)', marginTop: '8px' }}>
            {stats.total_complaints.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '4px' }}>
            ↑ 100% Geotagged with digital evidence
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '22px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            borderTop: '4px solid #10b981',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Complaints Resolved</span>
            <CheckCircle2 size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#059669', marginTop: '8px' }}>
            {stats.complaints_resolved.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Verified with Before/After photographic proof
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '22px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            borderTop: '4px solid #f59e0b',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>SLA Compliance Rate</span>
            <Clock size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#b45309', marginTop: '8px' }}>
            {stats.sla_compliance_rate}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Avg. Resolution Turnaround: {stats.average_resolution_hours} Hours
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '22px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            borderTop: '4px solid #7c3aed',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Citizen Satisfaction</span>
            <Users size={20} color="#7c3aed" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#6d28d9', marginTop: '8px' }}>
            {stats.citizen_satisfaction_rate}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '4px' }}>
            ★★★★☆ Based on direct citizen closure ratings
          </div>
        </div>
      </div>

      {/* Department Rankings Table */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--gov-primary)' }}>Department Resolution Performance</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Real-time workload, resolution speed, and SLA compliance rankings.
            </p>
          </div>
          <span
            style={{
              fontSize: '0.75rem',
              background: '#f1f5f9',
              padding: '4px 10px',
              borderRadius: 'var(--radius-md)',
              color: '#475569',
              fontWeight: 600,
            }}
          >
            Aggregated Government Data
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '12px 14px' }}>Department</th>
                <th style={{ padding: '12px 14px' }}>Total Received</th>
                <th style={{ padding: '12px 14px' }}>Resolved</th>
                <th style={{ padding: '12px 14px' }}>Active Workload</th>
                <th style={{ padding: '12px 14px' }}>SLA Compliance</th>
              </tr>
            </thead>
            <tbody>
              {departmentBreakdown.map((dept) => (
                <tr key={dept.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px', fontWeight: 700, color: 'var(--gov-primary)' }}>
                    {dept.name}
                  </td>
                  <td style={{ padding: '14px' }}>{dept.total}</td>
                  <td style={{ padding: '14px', color: '#059669', fontWeight: 600 }}>{dept.resolved}</td>
                  <td style={{ padding: '14px' }}>
                    <span
                      style={{
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {dept.pending} Active
                    </span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          flex: 1,
                          height: '8px',
                          background: '#e2e8f0',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          maxWidth: '120px',
                        }}
                      >
                        <div
                          style={{
                            width: `${dept.compliance}%`,
                            height: '100%',
                            background: dept.compliance >= 90 ? '#10b981' : '#f59e0b',
                          }}
                        />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{dept.compliance}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GIS Grievance Heatmap */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--gov-primary)' }}>
            District Grievance Density & Incident Clustering
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Anonymized spatial distribution of civic reports to detect infrastructure strain and monsoon hotspots.
          </p>
        </div>
        <LeafletMap height="400px" center={[17.4401, 78.3489]} zoom={13} heatmapPoints={heatmapPoints} />
      </div>
    </div>
  );
};
