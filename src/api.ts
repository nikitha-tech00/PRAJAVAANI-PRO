import type { Complaint, Department, ComplaintCategory, User, SystemStats, NotificationItem, AuditLog, IncidentCluster } from './types';

const API_BASE = '/api';

export const api = {
  // Health
  checkHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Auth
  sendOtp: async (phone: string) => {
    const res = await fetch(`${API_BASE}/auth/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    return res.json();
  },

  verifyOtp: async (phone: string, otp: string, name?: string) => {
    const res = await fetch(`${API_BASE}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp, name }),
    });
    return res.json();
  },

  officialLogin: async (employeeId?: string, role?: string) => {
    const res = await fetch(`${API_BASE}/auth/official/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, role }),
    });
    return res.json();
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    const res = await fetch(`${API_BASE}/users`);
    return res.json();
  },

  // Departments & Categories
  getDepartments: async (): Promise<Department[]> => {
    const res = await fetch(`${API_BASE}/departments`);
    return res.json();
  },

  getCategories: async (): Promise<ComplaintCategory[]> => {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  },

  // Complaints
  getComplaints: async (params?: Record<string, string>): Promise<Complaint[]> => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_BASE}/complaints${query}`);
    return res.json();
  },

  getComplaintById: async (id: string): Promise<Complaint> => {
    const res = await fetch(`${API_BASE}/complaints/${id}`);
    if (!res.ok) throw new Error('Complaint not found');
    return res.json();
  },

  createComplaint: async (data: any): Promise<Complaint> => {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to register complaint');
    return res.json();
  },

  updateComplaintStatus: async (id: string, status: string, changedBy: string, role: string, note: string): Promise<Complaint> => {
    const res = await fetch(`${API_BASE}/complaints/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, changedBy, role, note }),
    });
    return res.json();
  },

  assignOfficer: async (id: string, officerId: string, officerName: string, assignedBy: string, role: string): Promise<Complaint> => {
    const res = await fetch(`${API_BASE}/complaints/${id}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ officerId, officerName, assignedBy, role }),
    });
    return res.json();
  },

  uploadEvidence: async (id: string, evidenceData: any): Promise<Complaint> => {
    const res = await fetch(`${API_BASE}/complaints/${id}/evidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evidenceData),
    });
    return res.json();
  },

  addFieldNote: async (id: string, note: string): Promise<Complaint> => {
    const res = await fetch(`${API_BASE}/complaints/${id}/field-notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    });
    return res.json();
  },

  verifyResolution: async (id: string, rating: number, comment: string, resolved: boolean): Promise<Complaint> => {
    const res = await fetch(`${API_BASE}/complaints/${id}/verify-resolution`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comment, resolved }),
    });
    return res.json();
  },

  // AI Services
  analyzeAI: async (data: { text?: string; title?: string; address?: string; language?: string; fileName?: string }) => {
    const res = await fetch(`${API_BASE}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  askAssistant: async (query: string, language: string = 'en') => {
    const res = await fetch(`${API_BASE}/ai/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language }),
    });
    return res.json();
  },

  // Clusters
  getClusters: async (): Promise<IncidentCluster[]> => {
    const res = await fetch(`${API_BASE}/clusters`);
    return res.json();
  },

  // Notifications
  getNotifications: async (userId?: string): Promise<NotificationItem[]> => {
    const q = userId ? `?userId=${userId}` : '';
    const res = await fetch(`${API_BASE}/notifications${q}`);
    return res.json();
  },

  markNotificationRead: async (id: string) => {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'POST' });
    return res.json();
  },

  // Analytics
  getAnalytics: async (): Promise<{ stats: SystemStats; departmentBreakdown: any[]; categoryBreakdown: any[] }> => {
    const res = await fetch(`${API_BASE}/analytics`);
    return res.json();
  },

  getHeatmapPoints: async () => {
    const res = await fetch(`${API_BASE}/analytics/heatmap`);
    return res.json();
  },

  // Audit Logs
  getAuditLogs: async (): Promise<AuditLog[]> => {
    const res = await fetch(`${API_BASE}/audit-logs`);
    return res.json();
  },

  // Reset Demo
  resetDemo: async () => {
    const res = await fetch(`${API_BASE}/demo/reset`, { method: 'POST' });
    return res.json();
  },
};
