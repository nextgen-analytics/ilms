
export enum UserRole {
  ADMIN = 'ADMIN',
  LEGAL_OFFICER = 'LEGAL_OFFICER',
  SUPERVISOR = 'SUPERVISOR',
  MANAGEMENT = 'MANAGEMENT',
  VIEWER = 'VIEWER'
}

export enum CaseStatus {
  NEW = 'NEW',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  CLOSED = 'CLOSED',
  CORRECTION_REQUIRED = 'CORRECTION_REQUIRED'
}

export enum CaseType {
  MONEY_RECOVERY = 'MONEY_RECOVERY',
  DAMAGES_RECOVERY = 'DAMAGES_RECOVERY',
  APPEAL = 'APPEAL',
  LAND_CASE = 'LAND_CASE',
  CRIMINAL_CASE = 'CRIMINAL_CASE',
  DISCIPLINARY = 'DISCIPLINARY',
  OTHER = 'OTHER'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  password?: string;
  isActive: boolean;
}

export interface CaseDocument {
  id: string;
  title: string;
  version: number;
  uploadDate: string;
  uploadedBy: string;
  url: string;
  mimeType: string;
  size?: number;
  caseTitle?: string;
  caseId?: string;
}

export interface LegalCase {
  id: string;
  title: string;
  caseType: CaseType;
  referenceNumber: string;
  status: CaseStatus;
  partiesInvolved: string;
  natureOfCase: string;
  financialExposure?: number;
  courtAuthority: string;
  summaryOfFacts: string;
  assignedOfficerId?: string;
  createdAt: string;
  updatedAt: string;
  specificData: Record<string, any>;
  documents?: CaseDocument[];
}

export enum AgreementStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  UNDER_REVISION = 'UNDER_REVISION',
  FORWARDED_FOR_APPROVAL = 'FORWARDED_FOR_APPROVAL',
  APPROVED = 'APPROVED',
  EXECUTED = 'EXECUTED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED'
}

export interface AgreementComment {
  id: string;
  authorName: string;
  text: string;
  timestamp: string;
  type: 'COMMENT' | 'REVISION_REQUEST' | 'APPROVAL_NOTE';
}

export interface Agreement {
  id: string;
  title: string;
  type: string;
  parties: string;
  durationMonths: number;
  value: number;
  status: AgreementStatus;
  currentVersion: number;
  linkedCaseId?: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
  documents: CaseDocument[];
  comments: AgreementComment[];
  currentApprovalLevel: number; // 0: Review, 1: Dept Head, 2: Financial, 3: CLO
  maxApprovalLevels: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: 'CASE' | 'AGREEMENT' | 'USER' | 'WORKFLOW' | 'DOCUMENT';
  entityId: string;
  timestamp: string;
  details: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
}
