export type UserRole = 
  | 'citizen' 
  | 'field_officer' 
  | 'panchayat_staff' 
  | 'department_officer' 
  | 'district_admin' 
  | 'super_admin';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ComplaintStatus = 
  | 'SUBMITTED' 
  | 'VERIFIED' 
  | 'ASSIGNED' 
  | 'IN_PROGRESS' 
  | 'RESOLVED' 
  | 'CLOSED' 
  | 'REOPENED';

export type EvidenceStage = 
  | 'BEFORE' 
  | 'PROGRESS' 
  | 'AFTER' 
  | 'CITIZEN_SUBMISSION' 
  | 'CITIZEN_REOPEN';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  employeeId?: string;
  language: string;
  state: string;
  district: string;
  local_body: string;
  department_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  service_area: string;
  contact_information: string;
  active: boolean;
  icon: string;
  sla_hours_critical: number;
  sla_hours_high: number;
  sla_hours_medium: number;
  sla_hours_low: number;
}

export interface ComplaintCategory {
  id: string;
  name: string;
  telugu_name: string;
  description: string;
  default_department: string;
  default_sla_hours: number;
  icon: string;
  keywords: string[];
}

export interface ComplaintEvidence {
  id: string;
  complaint_id: string;
  uploaded_by: string;
  uploaded_by_role: UserRole;
  file_url: string;
  file_type: 'image' | 'video' | 'pdf' | 'doc';
  file_name: string;
  file_size_kb: number;
  evidence_stage: EvidenceStage;
  ai_analysis?: {
    detected_issue: string;
    confidence: number;
    clarity_score: number;
    notes: string;
  };
  uploaded_at: string;
}

export interface ComplaintStatusHistory {
  id: string;
  complaint_id: string;
  previous_status: ComplaintStatus | null;
  new_status: ComplaintStatus;
  changed_by: string;
  role: UserRole;
  note: string;
  timestamp: string;
}

export interface AIAnalysisResult {
  complaint_id: string;
  category: string;
  department: string;
  priority: PriorityLevel;
  confidence: number;
  summary: {
    issue: string;
    location: string;
    duration: string;
    potential_impact: string;
    recommended_action: string;
  };
  evidence_score: number;
  evidence_advice: string;
  explainability: {
    factors: string[];
    school_or_hospital_proximity: boolean;
    road_damage_detected: boolean;
    weather_hazard: boolean;
    cluster_member: boolean;
  };
  duplicate_candidates: {
    complaint_id: string;
    complaint_number: string;
    similarity_score: number;
    distance_meters: number;
    reported_ago: string;
  }[];
  resolution_comparison?: {
    improvement_detected: boolean;
    confidence: number;
    notes: string;
  };
  created_at: string;
}

export interface Complaint {
  id: string;
  complaint_number: string; // e.g. PV-2026-004821
  citizen_id: string;
  citizen_name: string;
  citizen_phone: string;
  title: string;
  description: string;
  original_language: 'en' | 'te';
  original_transcript?: string;
  translated_description?: string;
  category_id: string;
  category_name: string;
  priority: PriorityLevel;
  status: ComplaintStatus;
  latitude: number;
  longitude: number;
  address: string;
  village?: string;
  panchayat?: string;
  ward: string;
  city: string;
  district: string;
  state: string;
  department_id: string;
  department_name: string;
  assigned_officer_id?: string;
  assigned_officer_name?: string;
  assigned_officer_role?: string;
  sla_hours_allotted: number;
  sla_deadline: string; // ISO string
  sla_breached: boolean;
  evidence_quality_score: number;
  evidence: ComplaintEvidence[];
  ai_analysis?: AIAnalysisResult;
  history: ComplaintStatusHistory[];
  field_notes?: string[];
  citizen_feedback?: {
    rating: number; // 1-5
    comment: string;
    resolved: boolean;
    submitted_at: string;
  };
  reopen_reason?: string;
  created_at: string;
  updated_at: string;
  qr_code_data: string;
}

export interface IncidentCluster {
  id: string;
  title: string;
  category: string;
  center_latitude: number;
  center_longitude: number;
  radius_meters: number;
  complaint_count: number;
  severity: PriorityLevel;
  status: 'ACTIVE' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED';
  affected_area: string;
  complaint_numbers: string[];
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  complaint_id: string;
  complaint_number: string;
  title: string;
  message: string;
  type: 'INFO' | 'SLA_WARNING' | 'ASSIGNMENT' | 'STATUS_CHANGE' | 'RESOLUTION_VERIFICATION';
  read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  role: UserRole;
  action: string;
  entity_type: string;
  entity_id: string;
  old_value?: string;
  new_value?: string;
  notes?: string;
  timestamp: string;
}

export interface SystemStats {
  total_complaints: number;
  complaints_resolved: number;
  active_complaints: number;
  pending_verification: number;
  average_resolution_hours: number;
  sla_compliance_rate: number;
  departments_connected: number;
  incident_clusters_active: number;
  citizen_satisfaction_rate: number;
}
