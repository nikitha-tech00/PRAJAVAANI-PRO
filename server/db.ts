import fs from 'fs';
import path from 'path';
import { 
  User, Department, ComplaintCategory, Complaint, IncidentCluster, 
  NotificationItem, AuditLog, SystemStats, ComplaintStatus, UserRole 
} from './types';
import { 
  INITIAL_USERS, INITIAL_DEPARTMENTS, INITIAL_CATEGORIES, 
  INITIAL_COMPLAINTS, INITIAL_INCIDENT_CLUSTERS, INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS 
} from './seedData';
import { AIService, calculateDistanceMeters } from './aiService';

export interface DatabaseState {
  users: User[];
  departments: Department[];
  categories: ComplaintCategory[];
  complaints: Complaint[];
  incident_clusters: IncidentCluster[];
  notifications: NotificationItem[];
  audit_logs: AuditLog[];
}

export class DB {
  private static state: DatabaseState = {
    users: JSON.parse(JSON.stringify(INITIAL_USERS)),
    departments: JSON.parse(JSON.stringify(INITIAL_DEPARTMENTS)),
    categories: JSON.parse(JSON.stringify(INITIAL_CATEGORIES)),
    complaints: JSON.parse(JSON.stringify(INITIAL_COMPLAINTS)),
    incident_clusters: JSON.parse(JSON.stringify(INITIAL_INCIDENT_CLUSTERS)),
    notifications: JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS)),
    audit_logs: JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS)),
  };

  /**
   * Reset all records to default demo state
   */
  static resetDemoData() {
    this.state = {
      users: JSON.parse(JSON.stringify(INITIAL_USERS)),
      departments: JSON.parse(JSON.stringify(INITIAL_DEPARTMENTS)),
      categories: JSON.parse(JSON.stringify(INITIAL_CATEGORIES)),
      complaints: JSON.parse(JSON.stringify(INITIAL_COMPLAINTS)),
      incident_clusters: JSON.parse(JSON.stringify(INITIAL_INCIDENT_CLUSTERS)),
      notifications: JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS)),
      audit_logs: JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS)),
    };
    return { success: true, message: 'Demo data reset successfully to initial state.' };
  }

  // --- Users ---
  static getUsers(): User[] {
    return this.state.users;
  }

  static getUserById(id: string): User | undefined {
    return this.state.users.find((u) => u.id === id);
  }

  static getUserByPhone(phone: string): User | undefined {
    const cleanPhone = phone.replace(/[\s-]/g, '');
    return this.state.users.find((u) => u.phone.replace(/[\s-]/g, '') === cleanPhone);
  }

  static createUser(user: User): User {
    this.state.users.push(user);
    return user;
  }

  // --- Departments & Categories ---
  static getDepartments(): Department[] {
    return this.state.departments;
  }

  static getCategories(): ComplaintCategory[] {
    return this.state.categories;
  }

  // --- Complaints ---
  static getComplaints(filter?: {
    role?: UserRole;
    userId?: string;
    departmentId?: string;
    category?: string;
    priority?: string;
    status?: string;
    search?: string;
    ward?: string;
  }): Complaint[] {
    let list = [...this.state.complaints];

    // RBAC and user filtering
    if (filter?.role === 'citizen' && filter.userId) {
      list = list.filter((c) => c.citizen_id === filter.userId);
    } else if (filter?.role === 'field_officer' && filter.userId) {
      list = list.filter((c) => c.assigned_officer_id === filter.userId);
    } else if (filter?.role === 'department_officer' && filter.departmentId) {
      list = list.filter((c) => c.department_id === filter.departmentId);
    }

    if (filter?.category && filter.category !== 'ALL') {
      list = list.filter((c) => c.category_id === filter.category);
    }
    if (filter?.priority && filter.priority !== 'ALL') {
      list = list.filter((c) => c.priority === filter.priority);
    }
    if (filter?.status && filter.status !== 'ALL') {
      list = list.filter((c) => c.status === filter.status);
    }
    if (filter?.ward && filter.ward !== 'ALL') {
      list = list.filter((c) => c.ward === filter.ward);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.complaint_number.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q) ||
          c.department_name.toLowerCase().includes(q)
      );
    }

    // Sort by latest created first
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static getComplaintById(idOrNumber: string): Complaint | undefined {
    return this.state.complaints.find(
      (c) => c.id === idOrNumber || c.complaint_number.toLowerCase() === idOrNumber.toLowerCase()
    );
  }

  static createComplaint(data: {
    citizen_id: string;
    citizen_name: string;
    citizen_phone: string;
    title: string;
    description: string;
    original_language: 'en' | 'te';
    original_transcript?: string;
    category_id?: string;
    latitude: number;
    longitude: number;
    address: string;
    ward?: string;
    evidence_file?: {
      url: string;
      name: string;
      size_kb: number;
      type: 'image' | 'video' | 'pdf' | 'doc';
    };
  }): Complaint {
    const nextSeq = this.state.complaints.length + 4822;
    const complaintNumber = `PV-2026-00${nextSeq}`;

    // AI Classification and Routing
    const classification = AIService.classifyComplaint(data.description, data.original_language);
    const categoryId = data.category_id || classification.categoryId;
    const category = this.state.categories.find((c) => c.id === categoryId) || this.state.categories[0];
    const department = this.state.departments.find((d) => d.id === category.default_department) || this.state.departments[0];

    // Priority Intelligence & Explainability
    const priorityResult = AIService.detectPriority(
      data.description + ' ' + (data.title || ''),
      categoryId,
      data.address
    );

    // AI Summary
    const summary = AIService.summarizeComplaint(data.title, data.description, data.address);

    // Duplicate Detection against active complaints
    const duplicates = AIService.detectDuplicates(
      { latitude: data.latitude, longitude: data.longitude, category_id: categoryId, title: data.title },
      this.state.complaints
    );

    // Evidence Quality Assessment
    const evidenceQuality = data.evidence_file
      ? AIService.analyzeEvidenceQuality(data.evidence_file.type, data.evidence_file.size_kb)
      : { score: 75, advice: 'No photo attached. Adding photographic proof accelerates field dispatch.' };

    // Image AI Analysis
    const imageAnalysis = data.evidence_file
      ? AIService.analyzeImage(data.evidence_file.name, categoryId)
      : undefined;

    // SLA Calculation
    let slaHours = 24;
    if (priorityResult.priority === 'CRITICAL') slaHours = department.sla_hours_critical || 4;
    else if (priorityResult.priority === 'HIGH') slaHours = department.sla_hours_high || 24;
    else if (priorityResult.priority === 'MEDIUM') slaHours = department.sla_hours_medium || 48;
    else slaHours = department.sla_hours_low || 120;

    const slaDeadline = new Date(Date.now() + slaHours * 3600000).toISOString();

    const translatedDesc =
      data.original_language === 'te'
        ? AIService.translate(data.description, 'te', 'en')
        : data.description;

    const newComplaint: Complaint = {
      id: `comp-${Date.now()}`,
      complaint_number: complaintNumber,
      citizen_id: data.citizen_id,
      citizen_name: data.citizen_name,
      citizen_phone: data.citizen_phone,
      title: data.title,
      description: data.description,
      original_language: data.original_language,
      original_transcript: data.original_transcript,
      translated_description: translatedDesc,
      category_id: category.id,
      category_name: category.name,
      priority: priorityResult.priority,
      status: 'SUBMITTED',
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address,
      ward: data.ward || 'Ward 12',
      city: 'Hyderabad',
      district: 'Rangareddy',
      state: 'Telangana',
      department_id: department.id,
      department_name: department.name,
      sla_hours_allotted: slaHours,
      sla_deadline: slaDeadline,
      sla_breached: false,
      evidence_quality_score: evidenceQuality.score,
      evidence: data.evidence_file
        ? [
            {
              id: `evid-${Date.now()}`,
              complaint_id: `comp-${Date.now()}`,
              uploaded_by: data.citizen_name,
              uploaded_by_role: 'citizen',
              file_url: data.evidence_file.url,
              file_type: data.evidence_file.type,
              file_name: data.evidence_file.name,
              file_size_kb: data.evidence_file.size_kb,
              evidence_stage: 'BEFORE',
              ai_analysis: imageAnalysis,
              uploaded_at: new Date().toISOString(),
            },
          ]
        : [],
      ai_analysis: {
        complaint_id: `comp-${Date.now()}`,
        category: category.name,
        department: department.name,
        priority: priorityResult.priority,
        confidence: priorityResult.confidence,
        summary,
        evidence_score: evidenceQuality.score,
        evidence_advice: evidenceQuality.advice,
        explainability: priorityResult,
        duplicate_candidates: duplicates,
        created_at: new Date().toISOString(),
      },
      history: [
        {
          id: `hist-${Date.now()}-1`,
          complaint_id: `comp-${Date.now()}`,
          previous_status: null,
          new_status: 'SUBMITTED',
          changed_by: `${data.citizen_name} (Citizen)`,
          role: 'citizen',
          note: `Complaint submitted via PRAJAVAANI PRO Citizen Portal in ${data.original_language === 'te' ? 'Telugu' : 'English'}.`,
          timestamp: new Date().toISOString(),
        },
      ],
      field_notes: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      qr_code_data: `https://prajavaani.gov.in/track/${complaintNumber}`,
    };

    this.state.complaints.unshift(newComplaint);

    // Log to Audit trail
    this.addAuditLog({
      user_id: data.citizen_id,
      user_name: data.citizen_name,
      role: 'citizen',
      action: 'CREATE_COMPLAINT',
      entity_type: 'Complaint',
      entity_id: complaintNumber,
      new_value: `Category: ${category.name}, Priority: ${priorityResult.priority}`,
      notes: `Geotagged at ${data.address} [${data.latitude}, ${data.longitude}]`,
    });

    // Create In-App Notification
    this.createNotification({
      user_id: data.citizen_id,
      complaint_id: newComplaint.id,
      complaint_number: complaintNumber,
      title: 'Complaint Registered',
      message: `Your grievance ${complaintNumber} has been received and routed to ${department.name}. Estimated SLA: ${slaHours} Hours.`,
      type: 'INFO',
    });

    return newComplaint;
  }

  static updateComplaintStatus(
    id: string,
    newStatus: ComplaintStatus,
    changedBy: string,
    role: UserRole,
    note: string
  ): Complaint | undefined {
    const complaint = this.getComplaintById(id);
    if (!complaint) return undefined;

    const oldStatus = complaint.status;
    complaint.status = newStatus;
    complaint.updated_at = new Date().toISOString();

    complaint.history.push({
      id: `hist-${Date.now()}`,
      complaint_id: complaint.id,
      previous_status: oldStatus,
      new_status: newStatus,
      changed_by: changedBy,
      role,
      note,
      timestamp: new Date().toISOString(),
    });

    this.addAuditLog({
      user_id: role,
      user_name: changedBy,
      role,
      action: 'STATUS_TRANSITION',
      entity_type: 'Complaint',
      entity_id: complaint.complaint_number,
      old_value: oldStatus,
      new_value: newStatus,
      notes: note,
    });

    // Notify citizen of status transition
    this.createNotification({
      user_id: complaint.citizen_id,
      complaint_id: complaint.id,
      complaint_number: complaint.complaint_number,
      title: `Status: ${newStatus}`,
      message: `Grievance ${complaint.complaint_number} status updated to ${newStatus}. Note: ${note}`,
      type: newStatus === 'RESOLVED' ? 'RESOLUTION_VERIFICATION' : 'STATUS_CHANGE',
    });

    return complaint;
  }

  static assignOfficer(
    id: string,
    officerId: string,
    officerName: string,
    assignedBy: string,
    role: UserRole
  ): Complaint | undefined {
    const complaint = this.getComplaintById(id);
    if (!complaint) return undefined;

    complaint.assigned_officer_id = officerId;
    complaint.assigned_officer_name = officerName;
    complaint.status = 'ASSIGNED';
    complaint.updated_at = new Date().toISOString();

    complaint.history.push({
      id: `hist-${Date.now()}`,
      complaint_id: complaint.id,
      previous_status: 'VERIFIED',
      new_status: 'ASSIGNED',
      changed_by: assignedBy,
      role,
      note: `Assigned to field officer ${officerName}. SLA countdown active.`,
      timestamp: new Date().toISOString(),
    });

    this.addAuditLog({
      user_id: role,
      user_name: assignedBy,
      role,
      action: 'OFFICER_ASSIGNMENT',
      entity_type: 'Complaint',
      entity_id: complaint.complaint_number,
      new_value: `Officer: ${officerName} (${officerId})`,
      notes: `Assigned by ${assignedBy}`,
    });

    // Notify Officer
    this.createNotification({
      user_id: officerId,
      complaint_id: complaint.id,
      complaint_number: complaint.complaint_number,
      title: 'New Assignment',
      message: `You have been assigned complaint ${complaint.complaint_number} (${complaint.priority} priority) at ${complaint.address}.`,
      type: 'ASSIGNMENT',
    });

    return complaint;
  }

  static addEvidence(
    complaintId: string,
    evidence: {
      uploaded_by: string;
      uploaded_by_role: UserRole;
      file_url: string;
      file_type: 'image' | 'video' | 'pdf' | 'doc';
      file_name: string;
      file_size_kb: number;
      evidence_stage: 'BEFORE' | 'PROGRESS' | 'AFTER';
      notes?: string;
    }
  ): Complaint | undefined {
    const complaint = this.getComplaintById(complaintId);
    if (!complaint) return undefined;

    const aiAnalysis = AIService.analyzeImage(evidence.file_name, complaint.category_id);

    const newEvidence = {
      id: `evid-${Date.now()}`,
      complaint_id: complaint.id,
      uploaded_by: evidence.uploaded_by,
      uploaded_by_role: evidence.uploaded_by_role,
      file_url: evidence.file_url,
      file_type: evidence.file_type,
      file_name: evidence.file_name,
      file_size_kb: evidence.file_size_kb,
      evidence_stage: evidence.evidence_stage,
      ai_analysis: aiAnalysis,
      uploaded_at: new Date().toISOString(),
    };

    complaint.evidence.push(newEvidence);
    complaint.updated_at = new Date().toISOString();

    if (evidence.evidence_stage === 'AFTER') {
      // AI Resolution Verification
      const resolutionCheck = AIService.verifyResolution(
        complaint.evidence[0]?.file_name || 'Before',
        evidence.file_name
      );
      if (complaint.ai_analysis) {
        complaint.ai_analysis.resolution_comparison = resolutionCheck;
      }
      complaint.status = 'RESOLVED';
      complaint.history.push({
        id: `hist-${Date.now()}`,
        complaint_id: complaint.id,
        previous_status: 'IN_PROGRESS',
        new_status: 'RESOLVED',
        changed_by: evidence.uploaded_by,
        role: evidence.uploaded_by_role,
        note: `Resolution proof uploaded (${evidence.file_name}). AI Confidence: 88%. Awaiting Citizen Verification.`,
        timestamp: new Date().toISOString(),
      });

      // Notify citizen for verification
      this.createNotification({
        user_id: complaint.citizen_id,
        complaint_id: complaint.id,
        complaint_number: complaint.complaint_number,
        title: 'Action Required: Verify Resolution',
        message: `Field work for ${complaint.complaint_number} is completed. Please inspect the After-photo and confirm resolution.`,
        type: 'RESOLUTION_VERIFICATION',
      });
    }

    this.addAuditLog({
      user_id: evidence.uploaded_by_role,
      user_name: evidence.uploaded_by,
      role: evidence.uploaded_by_role,
      action: 'UPLOAD_EVIDENCE',
      entity_type: 'ComplaintEvidence',
      entity_id: complaint.complaint_number,
      new_value: `Stage: ${evidence.evidence_stage} | File: ${evidence.file_name}`,
      notes: evidence.notes || 'Photographic evidence attached to workflow.',
    });

    return complaint;
  }

  static addFieldNote(complaintId: string, note: string): Complaint | undefined {
    const complaint = this.getComplaintById(complaintId);
    if (!complaint) return undefined;

    if (!complaint.field_notes) complaint.field_notes = [];
    complaint.field_notes.push(note);
    complaint.updated_at = new Date().toISOString();

    return complaint;
  }

  static verifyCitizenResolution(
    complaintId: string,
    rating: number,
    comment: string,
    resolved: boolean
  ): Complaint | undefined {
    const complaint = this.getComplaintById(complaintId);
    if (!complaint) return undefined;

    complaint.citizen_feedback = {
      rating,
      comment,
      resolved,
      submitted_at: new Date().toISOString(),
    };

    if (resolved) {
      complaint.status = 'CLOSED';
      complaint.history.push({
        id: `hist-${Date.now()}`,
        complaint_id: complaint.id,
        previous_status: 'RESOLVED',
        new_status: 'CLOSED',
        changed_by: `${complaint.citizen_name} (Citizen)`,
        role: 'citizen',
        note: `Citizen verified resolution. Rating: ${rating}/5 Stars. Feedback: "${comment}"`,
        timestamp: new Date().toISOString(),
      });

      this.addAuditLog({
        user_id: complaint.citizen_id,
        user_name: complaint.citizen_name,
        role: 'citizen',
        action: 'CITIZEN_CONFIRMED_RESOLUTION',
        entity_type: 'Complaint',
        entity_id: complaint.complaint_number,
        new_value: `Status: CLOSED | Rating: ${rating}/5`,
        notes: `Citizen verified repair. Feedback: ${comment}`,
      });
    } else {
      complaint.status = 'REOPENED';
      complaint.reopen_reason = comment;
      complaint.history.push({
        id: `hist-${Date.now()}`,
        complaint_id: complaint.id,
        previous_status: 'RESOLVED',
        new_status: 'REOPENED',
        changed_by: `${complaint.citizen_name} (Citizen)`,
        role: 'citizen',
        note: `Citizen rejected resolution: "${comment}". Reopened for field re-inspection.`,
        timestamp: new Date().toISOString(),
      });

      this.addAuditLog({
        user_id: complaint.citizen_id,
        user_name: complaint.citizen_name,
        role: 'citizen',
        action: 'REOPEN_COMPLAINT',
        entity_type: 'Complaint',
        entity_id: complaint.complaint_number,
        new_value: 'Status: REOPENED',
        notes: `Reason: ${comment}`,
      });

      // Notify officer
      if (complaint.assigned_officer_id) {
        this.createNotification({
          user_id: complaint.assigned_officer_id,
          complaint_id: complaint.id,
          complaint_number: complaint.complaint_number,
          title: 'Complaint Reopened by Citizen',
          message: `${complaint.complaint_number} was marked as unresolved by citizen: "${comment}". Re-investigation required.`,
          type: 'SLA_WARNING',
        });
      }
    }

    complaint.updated_at = new Date().toISOString();
    return complaint;
  }

  // --- Incident Clusters ---
  static getClusters(): IncidentCluster[] {
    return this.state.incident_clusters;
  }

  // --- Notifications ---
  static getNotifications(userId?: string): NotificationItem[] {
    if (!userId) return this.state.notifications;
    return this.state.notifications.filter((n) => n.user_id === userId || n.user_id === 'all');
  }

  static markNotificationRead(notifId: string): boolean {
    const notif = this.state.notifications.find((n) => n.id === notifId);
    if (notif) {
      notif.read = true;
      return true;
    }
    return false;
  }

  static createNotification(data: Omit<NotificationItem, 'id' | 'read' | 'created_at'>): NotificationItem {
    const newNotif: NotificationItem = {
      ...data,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      read: false,
      created_at: new Date().toISOString(),
    };
    this.state.notifications.unshift(newNotif);
    return newNotif;
  }

  // --- Audit Logs ---
  static getAuditLogs(): AuditLog[] {
    return this.state.audit_logs.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  static addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const log: AuditLog = {
      ...entry,
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    this.state.audit_logs.unshift(log);
    return log;
  }

  // --- Aggregated Analytics ---
  static getSystemStats(): SystemStats {
    const total = this.state.complaints.length;
    const resolved = this.state.complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
    const active = this.state.complaints.filter((c) => c.status === 'SUBMITTED' || c.status === 'VERIFIED' || c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS' || c.status === 'REOPENED').length;
    const pendingVerification = this.state.complaints.filter((c) => c.status === 'RESOLVED').length;

    // SLA compliance
    const breached = this.state.complaints.filter((c) => c.sla_breached).length;
    const complianceRate = total > 0 ? Math.round(((total - breached) / total) * 100) : 98;

    return {
      total_complaints: total + 12480, // Realistic aggregate benchmark display
      complaints_resolved: resolved + 11840,
      active_complaints: active,
      pending_verification: pendingVerification,
      average_resolution_hours: 18.4,
      sla_compliance_rate: complianceRate,
      departments_connected: this.state.departments.length,
      incident_clusters_active: this.state.incident_clusters.filter((c) => c.status === 'ACTIVE').length,
      citizen_satisfaction_rate: 94.2,
    };
  }
}
