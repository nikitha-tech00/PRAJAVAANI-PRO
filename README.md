# PRAJAVAANI PRO

## Multi-Portal AI Public Grievance Intelligence, Tracking, Verification & Resolution Platform

> **“Your Voice. Verified. Tracked. Resolved.”**  
> *“From Complaint to Resolution — Transparently.”*

PRAJAVAANI PRO is an AI-powered, sovereign-grade civic governance technology platform connecting citizens across urban, rural, and semi-urban India with municipalities, Gram Panchayats, departmental engineers, and district collectors.

Built with a **Voice-First**, **13 Indian State Languages Support (Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Odia, Assamese, Urdu, English)**, **Lion Capital of Ashoka Sovereign Crest**, **4-Step Guided Onboarding Tour**, **Geotagged Evidence**, **Explainable AI (XAI)**, **Dynamic SLA Monitoring**, **Civic Incident Clustering**, and **Citizen Resolution Verification** architecture.

---

## 🏛 Platform Architecture & Core Portals

```
                       ┌────────────────────────────────────────────────────────┐
                       │                     PRAJAVAANI PRO                     │
                       │           Full-Stack Civic Technology Platform         │
                       └───────────────────────────┬────────────────────────────┘
                                                   │
                ┌──────────────────────────────────┴──────────────────────────────────┐
                ▼                                                                     ▼
   ┌─────────────────────────┐                                           ┌─────────────────────────┐
   │     CITIZEN PORTAL      │                                           │ OFFICIAL / ADMIN PORTAL │
   │   (Mobile-First, XAI)   │                                           │ (Role-Based Access)     │
   ├─────────────────────────┤                                           ├─────────────────────────┤
   │ • Mobile OTP Login      │                                           │ • Field Officer View    │
   │ • Telugu & English Voice│                                           │ • Panchayat Staff View  │
   │ • Speech-to-Text & CV   │                                           │ • Dept EE Review Queue  │
   │ • GPS Map Pin Picker    │                                           │ • District Command Ctr  │
   │ • Duplicate Alerts      │                                           │ • SLA Escalation Engine │
   │ • Live Timeline Tracker │                                           │ • Immutable Audit Logs  │
   │ • Citizen Verification  │                                           │ • Before/After Review   │
   │ • Floating AI Assistant │                                           │ • Offline-First Ready   │
   └─────────────────────────┘                                           └─────────────────────────┘
```

---

## 🚀 Quick Start & Running Locally

### Prerequisites
- Node.js LTS (v20+ or v22+)
- Standalone portable Node is pre-configured at `C:\Users\n2257\nodejs`

### Running the Full-Stack Application
The project is located at:
`C:\Users\n2257\.gemini\antigravity-ide\scratch\prajavaani-pro`

```bash
# In project root:
cd C:\Users\n2257\.gemini\antigravity-ide\scratch\prajavaani-pro

# Start the full-stack platform (serves REST API + UI on port 5000):
npm run server

# Or run client in dev mode with instant HMR (port 3000):
npm run client
```

Open your browser at:
👉 **`http://localhost:5000`** (or `http://localhost:3000`)

---

## 🎭 Evaluator & Judge Demo Accounts

PRAJAVAANI PRO includes a **Top Quick Demo Switcher Bar** enabling instant 1-click evaluation across all 5 roles:

| Role | Name | Identifier | Access & Capabilities |
| :--- | :--- | :--- | :--- |
| **Citizen** | Ramesh Reddy | `+91 98765 43210` | Voice complaint wizard, AI smart suggestions, Leaflet GPS, Resolution Verification |
| **Field Officer** | K. Suresh Kumar | `ENG-RND-4402` | Assigned tasks, GPS navigation map, field notes, BEFORE / AFTER photo upload |
| **Panchayat Staff**| M. Lakshmi Devi | `PANCH-SR-091` | Gram Panchayat & local body review, community SLA monitoring |
| **Department Officer** | P. Venkat Rao (EE) | `EE-RBD-8810` | Accept / Modify / Reject AI routing recommendations, dispatch repair crews |
| **District Collector** | Dr. Ananya Sharma, IAS | `IAS-TG-2016-042`| District Command Center, GIS heatmap, incident cluster management |
| **Super Admin** | Rajesh Varma | `IT-CIVIC-001` | Platform-wide analytics, department SLAs, immutable audit trail |

*Static OTP for demo:* `123456`

---

## 🌟 Primary Hackathon Demo Walkthrough (Sections 61-65)

### Scenario: *"Dangerous Pothole Near School Entrance"* (`PV-2026-004821`)

1. **Citizen Voice Intake**:
   - Citizen speaks in Telugu: *“పాఠశాల దగ్గర పెద్ద గుంత ఉంది...”*
   - Web Speech API transcribes speech into native Telugu script and provides English interpretation.
2. **AI Computer Vision Defect Recognition**:
   - Image analysis classifies *“Severe road surface asphalt depression / Pothole crater”* with **91% Confidence**.
   - Evidence Quality assessed at **84/100**.
3. **Explainable AI (XAI) Priority & Routing**:
   - Routes to: **Roads & Buildings Department** (Ward 12).
   - Priority calculated as **HIGH** (24-Hour SLA Cap).
   - XAI Factors: *School Zone Proximity*, *Two-Wheeler Accident Hazard*, *Monsoon Rainfall Vulnerability*.
4. **Duplicate Detection & Incident Clustering**:
   - Proximity engine detects nearby complaint **PV-2026-004790** (80 meters away).
   - Automatically associates complaint with emerging **Civic Incident Cluster: Main Road Hazard**.
5. **Department Officer Review**:
   - Department Executive Engineer reviews proposal and clicks **ACCEPT AI RECOMMENDATION**, assigning to Field Officer K. Suresh Kumar.
6. **Field Officer Mobile Execution**:
   - Field Officer inspects GPS location, updates status to **IN_PROGRESS**, records field notes, and uploads **AFTER Photo** (repaired asphalt patch).
7. **AI-Assisted Resolution Verification**:
   - AI compares Before vs After proof: **“Potential visual improvement detected: 88% Confidence”**.
   - Sets status to: **CITIZEN VERIFICATION REQUIRED**.
8. **Citizen Confirms Resolution**:
   - Citizen inspects side-by-side evidence, selects **✓ YES, ISSUE RESOLVED**, awards **★★★★★ (5 Stars)**, and enters feedback.
   - Status updates to **CLOSED**!
9. **Admin Analytics & Audit Ledger**:
   - District Command Center real-time statistics, GIS heatmap, incident clusters, and audit ledger update instantly.

---

## 🗄 Relational Database Entities (Section 51)

PRAJAVAANI PRO implements a normalized schema:
- `users`: Citizen & official profiles, language, district, ward, local body.
- `departments`: Municipal departments, service areas, contact info, multi-tier SLAs.
- `complaint_categories`: Category directory, keywords, Telugu translations.
- `complaints`: Primary grievance entity (`PV-2026-004821`), GPS coordinates, SLA deadlines.
- `complaint_evidence`: Photographic chain (`BEFORE`, `PROGRESS`, `AFTER`) with CV defect analysis.
- `complaint_status_history`: Complete state transition audit trail.
- `ai_analysis`: Category, department, priority, explainability factors, duplicate candidates.
- `incident_clusters`: Geographic clusters grouping nearby grievances into emergency incidents.
- `notifications`: In-app alerts for assignments, SLA warnings, and verification requests.
- `audit_logs`: Immutable ledger recording WHO, WHAT, WHEN, Old Value, and New Value.

---

## 🔒 Security & Privacy (Sections 52 & 53)

- **Zero-PII Public Tracking**: Public tracker reveals only verified progress stages, SLA status, and resolution photos. Citizen phone numbers, emails, and home addresses are never exposed.
- **Server-Side RBAC**: Role-based access ensures citizens only view their private grievances, field officers only see assigned tasks, and administrators have supervisory control.
- **Human-in-the-Loop AI**: AI acts as an advisor, never silently overruling authorized officers or auto-closing grievances without citizen consent.

---

## 🏷 Product Identity

- **Platform Name**: PRAJAVAANI PRO
- **Primary Tagline**: *“Your Voice. Verified. Tracked. Resolved.”*
- **Secondary Tagline**: *“From Complaint to Resolution — Transparently.”*
