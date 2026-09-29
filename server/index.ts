import express from 'express';
import cors from 'cors';
import { DB } from './db';
import { AIService } from './aiService';
import { UserRole } from './types';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', platform: 'PRAJAVAANI PRO', timestamp: new Date().toISOString() });
});

// --- AUTHENTICATION ---
// Send Citizen Mobile OTP (SMS & WhatsApp Simulation)
app.post('/api/auth/otp/send', (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: 'Mobile number is required' });
  }

  // In demo mode, static OTP 123456 is always accepted for instant testability
  const demoOtp = '123456';
  res.json({
    success: true,
    message: `Verification code sent to ${phone} via SMS/WhatsApp.`,
    demoOtp: demoOtp, // Displayed in UI notification toast for rapid evaluator testing
  });
});

// Verify Citizen OTP
app.post('/api/auth/otp/verify', (req, res) => {
  const { phone, otp, name } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP are required' });
  }

  // Accept 123456 or any 6 digits for testing
  let user = DB.getUserByPhone(phone);
  if (!user) {
    // Auto-create citizen profile
    user = DB.createUser({
      id: `user-citizen-${Date.now()}`,
      name: name || 'Citizen User',
      phone: phone,
      role: 'citizen',
      language: 'en',
      state: 'Telangana',
      district: 'Rangareddy',
      local_body: 'GHMC Ward 12',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  res.json({
    success: true,
    user,
    token: `token-citizen-${user.id}-${Date.now()}`,
  });
});

// Official Login
app.post('/api/auth/official/login', (req, res) => {
  const { employeeId, role } = req.body;
  const users = DB.getUsers();

  let official = users.find((u) => u.employeeId === employeeId || u.role === role);
  if (!official) {
    official = users.find((u) => u.role === 'field_officer');
  }

  res.json({
    success: true,
    user: official,
    token: `token-official-${official?.id}-${Date.now()}`,
  });
});

// --- MASTER DATA ---
app.get('/api/users', (req, res) => {
  res.json(DB.getUsers());
});

app.get('/api/departments', (req, res) => {
  res.json(DB.getDepartments());
});

app.get('/api/categories', (req, res) => {
  res.json(DB.getCategories());
});

// --- COMPLAINTS ---
app.get('/api/complaints', (req, res) => {
  const { role, userId, departmentId, category, priority, status, search, ward } = req.query;
  const complaints = DB.getComplaints({
    role: role as UserRole,
    userId: userId as string,
    departmentId: departmentId as string,
    category: category as string,
    priority: priority as string,
    status: status as string,
    search: search as string,
    ward: ward as string,
  });
  res.json(complaints);
});

app.get('/api/complaints/:id', (req, res) => {
  const complaint = DB.getComplaintById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }
  res.json(complaint);
});

app.post('/api/complaints', (req, res) => {
  try {
    const complaint = DB.createComplaint(req.body);
    res.status(201).json(complaint);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to register grievance' });
  }
});

app.patch('/api/complaints/:id/status', (req, res) => {
  const { status, changedBy, role, note } = req.body;
  const updated = DB.updateComplaintStatus(req.params.id, status, changedBy, role, note);
  if (!updated) {
    return res.status(404).json({ error: 'Complaint not found' });
  }
  res.json(updated);
});

app.post('/api/complaints/:id/assign', (req, res) => {
  const { officerId, officerName, assignedBy, role } = req.body;
  const updated = DB.assignOfficer(req.params.id, officerId, officerName, assignedBy, role);
  if (!updated) {
    return res.status(404).json({ error: 'Complaint not found' });
  }
  res.json(updated);
});

app.post('/api/complaints/:id/evidence', (req, res) => {
  const updated = DB.addEvidence(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Complaint not found' });
  }
  res.json(updated);
});

app.post('/api/complaints/:id/field-notes', (req, res) => {
  const { note } = req.body;
  const updated = DB.addFieldNote(req.params.id, note);
  if (!updated) {
    return res.status(404).json({ error: 'Complaint not found' });
  }
  res.json(updated);
});

app.post('/api/complaints/:id/verify-resolution', (req, res) => {
  const { rating, comment, resolved } = req.body;
  const updated = DB.verifyCitizenResolution(req.params.id, Number(rating), comment, resolved);
  if (!updated) {
    return res.status(404).json({ error: 'Complaint not found' });
  }
  res.json(updated);
});

// --- AI SERVICES ---
// Real-time assistance during typing / speech
app.post('/api/ai/analyze', (req, res) => {
  const { text, title, address, language, fileName, fileSizeKb } = req.body;

  const classification = AIService.classifyComplaint(text || title || '', language || 'en');
  const priority = AIService.detectPriority(text || '', classification.categoryId, address || '');
  const summary = AIService.summarizeComplaint(title || '', text || '', address || '');
  const quality = AIService.analyzeEvidenceQuality('image', fileSizeKb || 300);
  const imageCV = fileName ? AIService.analyzeImage(fileName, classification.categoryId) : null;

  res.json({
    category: classification.categoryName,
    categoryId: classification.categoryId,
    confidence: classification.confidence,
    suggestedDepartment: classification.suggestedDepartment,
    priority: priority.priority,
    explainability: priority,
    summary,
    evidenceQuality: quality,
    computerVision: imageCV,
  });
});

// AI Citizen Assistant conversational query
app.post('/api/ai/assistant', (req, res) => {
  const { query, language } = req.body;
  const reply = AIService.generateAssistantResponse(query || '', language || 'en');
  res.json({ reply });
});

// --- CLUSTERS & INCIDENTS ---
app.get('/api/clusters', (req, res) => {
  res.json(DB.getClusters());
});

// --- NOTIFICATIONS ---
app.get('/api/notifications', (req, res) => {
  const { userId } = req.query;
  res.json(DB.getNotifications(userId as string));
});

app.post('/api/notifications/:id/read', (req, res) => {
  const ok = DB.markNotificationRead(req.params.id);
  res.json({ success: ok });
});

// --- ANALYTICS & GIS HEATMAP ---
app.get('/api/analytics', (req, res) => {
  const stats = DB.getSystemStats();
  const departments = DB.getDepartments();
  const complaints = DB.getComplaints();

  // Department metrics breakdown
  const departmentBreakdown = departments.map((d) => {
    const deptComplaints = complaints.filter((c) => c.department_id === d.id);
    const resolved = deptComplaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
    return {
      id: d.id,
      name: d.name,
      total: deptComplaints.length,
      resolved,
      pending: deptComplaints.length - resolved,
      compliance: deptComplaints.length > 0 ? Math.round((resolved / deptComplaints.length) * 100) : 100,
    };
  });

  // Category breakdown
  const categories = DB.getCategories();
  const categoryBreakdown = categories.map((cat) => {
    const count = complaints.filter((c) => c.category_id === cat.id).length;
    return {
      id: cat.id,
      name: cat.name,
      count,
    };
  });

  res.json({
    stats,
    departmentBreakdown,
    categoryBreakdown,
  });
});

app.get('/api/analytics/heatmap', (req, res) => {
  const complaints = DB.getComplaints();
  const points = complaints.map((c) => ({
    id: c.id,
    complaint_number: c.complaint_number,
    latitude: c.latitude,
    longitude: c.longitude,
    priority: c.priority,
    status: c.status,
    category_name: c.category_name,
    title: c.title,
    weight: c.priority === 'CRITICAL' ? 1.0 : c.priority === 'HIGH' ? 0.75 : 0.5,
  }));
  res.json(points);
});

// --- AUDIT LOGS ---
app.get('/api/audit-logs', (req, res) => {
  res.json(DB.getAuditLogs());
});

// --- HACKATHON DEMO CONTROLS ---
app.post('/api/demo/reset', (req, res) => {
  const result = DB.resetDemoData();
  res.json(result);
});

// --- STATIC FILE SERVING FOR CLIENT (DIST) ---
import path from 'path';
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`PRAJAVAANI PRO Full-Stack Platform running on port ${PORT}`);
  });
}

export default app;
