import React from 'react';
import { X, Bell, CheckCircle2, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';
import type { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onOpenTrack: (complaintNumber: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onOpenTrack,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 1250,
      }}
    >
      <div
        style={{
          background: '#ffffff',
          width: '420px',
          maxWidth: '100%',
          height: '100%',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
        }}
        className="animate-slide-down"
      >
        {/* Header */}
        <div
          style={{
            background: 'var(--gov-primary)',
            color: 'white',
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={20} />
            <h3 style={{ color: 'white', fontSize: '1.1rem' }}>Civic Notifications</h3>
          </div>
          <button onClick={onClose} style={{ color: 'white' }}>
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <Bell size={36} color="#cbd5e1" style={{ margin: '0 auto 10px' }} />
              <div>No notifications at this time.</div>
            </div>
          )}

          {notifications.map((n) => {
            const isVerification = n.type === 'RESOLUTION_VERIFICATION';
            const isWarning = n.type === 'SLA_WARNING';

            return (
              <div
                key={n.id}
                style={{
                  background: n.read ? '#ffffff' : '#f8fafc',
                  border: isVerification
                    ? '2px solid #10b981'
                    : isWarning
                    ? '2px solid #f59e0b'
                    : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: isVerification ? '#059669' : isWarning ? '#b45309' : 'var(--gov-accent-blue)',
                    }}
                  >
                    {n.type.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                    {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gov-primary)', marginTop: '4px' }}>
                  {n.title}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px', lineHeight: 1.4 }}>
                  {n.message}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <button
                    onClick={() => {
                      onOpenTrack(n.complaint_number);
                      onClose();
                    }}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--gov-accent-blue)',
                    }}
                  >
                    View {n.complaint_number} →
                  </button>

                  {!n.read && (
                    <button
                      onClick={() => onMarkRead(n.id)}
                      style={{
                        fontSize: '0.72rem',
                        color: '#64748b',
                        background: '#f1f5f9',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
