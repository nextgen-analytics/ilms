
import { 
  LegalCase, CaseType, CaseStatus, 
  Agreement, AgreementStatus, 
  User, UserRole, 
  AuditLog, Notification 
} from '../types';

export const mockUsers: User[] = [
  { id: 'usr_1', name: 'Sarah Connor', role: UserRole.LEGAL_OFFICER, email: 'sarah.c@legal.corp', password: 'password123', isActive: true },
  { id: 'usr_2', name: 'John Doe', role: UserRole.MANAGEMENT, email: 'john.d@legal.corp', password: 'password123', isActive: true },
  { id: 'usr_3', name: 'Admin User', role: UserRole.ADMIN, email: 'admin@legal.corp', password: 'password123', isActive: true },
  { id: 'usr_4', name: 'Mike Ross', role: UserRole.SUPERVISOR, email: 'mike.r@legal.corp', password: 'password123', isActive: true },
  { id: 'usr_5', name: 'Harvey Specter', role: UserRole.ADMIN, email: 'harvey.s@legal.corp', password: 'password123', isActive: true },
];

export const currentUser: User = mockUsers[0];

export const mockCases: LegalCase[] = [
  {
    id: 'case_001',
    title: 'Alpha Corp Debt Recovery',
    caseType: CaseType.MONEY_RECOVERY,
    referenceNumber: 'MR-2024-001',
    status: CaseStatus.ACTIVE,
    partiesInvolved: 'Our Corp vs Alpha Corp',
    natureOfCase: 'Unpaid invoices for services rendered in Q3 2023',
    financialExposure: 250000,
    courtAuthority: 'High Court of Justice',
    summaryOfFacts: 'Defendant has failed to pay the balance after multiple reminders. Initial document approved following debt validation.',
    assignedOfficerId: 'usr_1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-10T14:30:00Z',
    specificData: { claimAmount: 250000, recovered: 50000 },
    documents: [
      {
        id: 'doc_init_1',
        title: 'Initial_Demand_Letter.pdf',
        version: 1,
        uploadDate: '2024-01-16T10:00:00Z',
        uploadedBy: 'Sarah Connor',
        url: '#',
        mimeType: 'application/pdf',
        size: 1024 * 450
      }
    ]
  },
  {
    id: 'case_002',
    title: 'Property Boundary Dispute - West Sector',
    caseType: CaseType.LAND_CASE,
    referenceNumber: 'LC-2024-012',
    status: CaseStatus.NEW,
    partiesInvolved: 'Our Corp vs Private Landowner B',
    natureOfCase: 'Boundary encroachment on the western facility wall.',
    courtAuthority: 'Land Tribunal',
    summaryOfFacts: 'New fencing erected by neighbor overlaps company survey lines. Land reference secured from survey office.',
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z',
    specificData: { landRef: 'SEC-W-04', deedNumber: 'D-998822' },
    documents: []
  },
  {
    id: 'case_003',
    title: 'Negligence Claim: Chemical Leak 04',
    caseType: CaseType.DAMAGES_RECOVERY,
    referenceNumber: 'DR-2024-005',
    status: CaseStatus.ACTIVE,
    partiesInvolved: 'Our Corp vs Logistics Partner X',
    natureOfCase: 'Damages resulting from hazardous material spill during transit.',
    financialExposure: 500000,
    courtAuthority: 'Environmental Court',
    summaryOfFacts: 'Logistics partner failed to secure containers. Remediation costs incurred. Initial document details assessment and valuation.',
    assignedOfficerId: 'usr_4',
    createdAt: '2024-02-10T08:00:00Z',
    updatedAt: '2024-03-05T11:00:00Z',
    specificData: { assessmentValue: 480000, compensationClaimed: 500000, settlementProgress: 15 },
    documents: [
      {
        id: 'doc_init_3',
        title: 'Damage_Assessment_Report_v1.pdf',
        version: 1,
        uploadDate: '2024-02-11T14:00:00Z',
        uploadedBy: 'Mike Ross',
        url: '#',
        mimeType: 'application/pdf',
        size: 1024 * 1200
      }
    ]
  },
  {
    id: 'case_004',
    title: 'Appeal: High Court Ruling #332',
    caseType: CaseType.APPEAL,
    referenceNumber: 'AP-2024-002',
    status: CaseStatus.CORRECTION_REQUIRED,
    partiesInvolved: 'Competitor B vs Our Corp',
    natureOfCase: 'Appeal against patent validity ruling.',
    courtAuthority: 'Supreme Court',
    summaryOfFacts: 'Appellant seeks stay of execution. Initial document requires revision regarding original case linkage (AP-FR-01).',
    assignedOfficerId: 'usr_1',
    createdAt: '2024-03-10T14:00:00Z',
    updatedAt: '2024-03-12T09:30:00Z',
    specificData: { originalCaseRef: 'PAT-2022-881', appealDeadline: '2024-04-15' },
    documents: []
  },
  {
    id: 'case_005',
    title: 'Theft of Intellectual Assets',
    caseType: CaseType.CRIMINAL_CASE,
    referenceNumber: 'CR-2024-009',
    status: CaseStatus.ACTIVE,
    partiesInvolved: 'State vs Former Employee Y',
    natureOfCase: 'Criminal theft of trade secrets and data exfiltration.',
    courtAuthority: 'Magistrates Court',
    summaryOfFacts: 'Forensic evidence indicates bulk download of sensitive design files prior to resignation. Criminal charges recorded (CR-FR-01).',
    assignedOfficerId: 'usr_4',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-03-01T16:00:00Z',
    specificData: { charges: ['Theft', 'Computer Misuse'], statutes: ['IP Act 2012'], hearings: 3 },
    documents: []
  },
  {
    id: 'case_006',
    title: 'Title Deed Correction - North Wing',
    caseType: CaseType.LAND_CASE,
    referenceNumber: 'LC-2023-099',
    status: CaseStatus.CLOSED,
    partiesInvolved: 'Our Corp vs Land Registry',
    natureOfCase: 'Correction of clerical error in deed area calculation.',
    courtAuthority: 'Administrative Land Office',
    summaryOfFacts: 'Survey office confirmed discrepancy. Case closed after deed re-issuance and plan management (LC-FR-03).',
    assignedOfficerId: 'usr_1',
    createdAt: '2023-11-05T09:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    specificData: { landRef: 'NW-ERR-01', deedNumber: 'D-771122-FIXED', resolution: 'Clerical error corrected' },
    documents: [
      {
        id: 'doc_init_6',
        title: 'Amended_Title_Deed.pdf',
        version: 1,
        uploadDate: '2024-01-10T11:00:00Z',
        uploadedBy: 'Sarah Connor',
        url: '#',
        mimeType: 'application/pdf',
        size: 1024 * 800
      }
    ]
  },
  {
    id: 'case_007',
    title: 'Inquiry into Procurement Breach',
    caseType: CaseType.DISCIPLINARY,
    referenceNumber: 'INQ-2024-001',
    status: CaseStatus.NEW,
    partiesInvolved: 'Internal Audit vs Dept Z',
    natureOfCase: 'Violation of vendor selection protocol.',
    courtAuthority: 'Internal Disciplinary Committee',
    summaryOfFacts: 'Initial document submitted for panel setup (INQ-FR-01). Pending board review for case activation.',
    createdAt: '2024-03-15T11:00:00Z',
    updatedAt: '2024-03-15T11:00:00Z',
    specificData: { panelMembers: ['Audit Head', 'HR Director', 'Legal Officer'], breachType: 'Protocol Violation' },
    documents: []
  }
];

export const mockAgreements: Agreement[] = [
  {
    id: 'agr_001',
    title: 'Annual IT Support MSA',
    type: 'Service Agreement',
    parties: 'Our Corp, TechSolutions Ltd',
    durationMonths: 12,
    value: 120000,
    status: AgreementStatus.PENDING_REVIEW,
    currentVersion: 1,
    expiryDate: '2025-01-01',
    createdAt: '2024-02-15T08:30:00Z',
    // Added missing properties to comply with Agreement interface
    updatedAt: '2024-02-15T08:30:00Z',
    documents: [],
    comments: [],
    currentApprovalLevel: 0,
    maxApprovalLevels: 3
  },
  {
    id: 'agr_002',
    title: 'Lease Renewal: Tower A',
    type: 'Real Estate',
    parties: 'Our Corp, Landmark Property',
    durationMonths: 60,
    value: 4500000,
    status: AgreementStatus.UNDER_REVISION,
    currentVersion: 2,
    expiryDate: '2029-03-31',
    createdAt: '2024-03-01T10:00:00Z',
    // Added missing properties to comply with Agreement interface
    updatedAt: '2024-03-01T10:00:00Z',
    documents: [],
    comments: [],
    currentApprovalLevel: 0,
    maxApprovalLevels: 3
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log_1',
    userId: 'usr_1',
    userName: 'Sarah Connor',
    action: 'CREATE_INITIAL_DOCUMENT',
    entityType: 'CASE',
    entityId: 'case_002',
    timestamp: '2024-03-01T09:00:00Z',
    details: 'Initial document submitted for Property Boundary Dispute'
  },
  {
    id: 'log_2',
    userId: 'usr_4',
    userName: 'Mike Ross',
    action: 'ACTIVATE_CASE',
    entityType: 'CASE',
    entityId: 'case_003',
    timestamp: '2024-03-05T11:00:00Z',
    details: 'Initial Document approved. Case activated (LCH-FR-04).'
  },
  {
    id: 'log_3',
    userId: 'usr_3',
    userName: 'Admin User',
    action: 'REQUEST_REVISION',
    entityType: 'AGREEMENT',
    entityId: 'agr_002',
    timestamp: '2024-03-12T10:00:00Z',
    details: 'Revision requested for Lease Renewal v2. Clause 4.2 needs clarification.'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'nt_1',
    userId: 'usr_1',
    title: 'Agreement Review Required',
    message: 'Agreement MSA-2024 requires your initial review.',
    isRead: false,
    timestamp: '2024-03-02T10:15:00Z'
  },
  {
    id: 'nt_2',
    userId: 'usr_1',
    title: 'Case Correction Required',
    message: 'Initial Document for Appeal AP-2024-002 was rejected. Please see supervisor remarks.',
    isRead: false,
    timestamp: '2024-03-12T09:45:00Z'
  }
];
