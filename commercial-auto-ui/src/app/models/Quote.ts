import { BusinessInfo } from './BusinessInfo';
import { Vehicle } from './Vehicle';
import { Driver } from './Driver';
import { Coverage } from './Coverage';
import { Premium } from './Premium';
import { Policy } from './Policy';

export interface Quote {
  quoteId: string;
  quoteNumber: string;
  quoteDate: Date;
  expirationDate: Date;
  quoteStatus: QuoteStatus;

  // Business Information
  businessInfo: BusinessInfo;

  // Vehicles
  vehicles: Vehicle[];

  // Drivers
  drivers: Driver[];

  // Coverage Details
  coverage: Coverage;

  // Premium Calculation
  premium: Premium;

  // Policy Information
  policy: Policy;

  // Additional Quote Details
  underwritingInfo?: UnderwritingInfo;
  attachments?: Attachment[];
  notes?: Note[];

  // Audit Information
  createdBy: string;
  createdDate: Date;
  modifiedBy?: string;
  modifiedDate?: Date;
  version: number;
}

export enum QuoteStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  QUOTED = 'QUOTED',
  BOUND = 'BOUND',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export interface UnderwritingInfo {
  underwritingQuestions: UnderwritingQuestion[];
  riskAssessment?: RiskAssessment;
  specialConditions?: string[];
  exclusions?: string[];
  requiresInspection: boolean;
  inspectionStatus?: InspectionStatus;
  inspectionDate?: Date;
}

export interface UnderwritingQuestion {
  questionId: string;
  question: string;
  answer: string | boolean | number;
  answerType: AnswerType;
  required: boolean;
}

export enum AnswerType {
  TEXT = 'TEXT',
  YES_NO = 'YES_NO',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  SELECTION = 'SELECTION'
}

export interface RiskAssessment {
  overallRiskScore: number;
  riskTier: RiskTier;
  riskFactors: RiskFactor[];
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvalDate?: Date;
  approvalNotes?: string;
}

export enum RiskTier {
  PREFERRED = 'PREFERRED',
  STANDARD = 'STANDARD',
  NON_STANDARD = 'NON_STANDARD',
  HIGH_RISK = 'HIGH_RISK',
  DECLINED = 'DECLINED'
}

export interface RiskFactor {
  factorType: string;
  description: string;
  impact: RiskImpact;
  score: number;
}

export enum RiskImpact {
  POSITIVE = 'POSITIVE',
  NEUTRAL = 'NEUTRAL',
  NEGATIVE = 'NEGATIVE',
  CRITICAL = 'CRITICAL'
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  APPROVED_WITH_CONDITIONS = 'APPROVED_WITH_CONDITIONS',
  REFERRED = 'REFERRED',
  DECLINED = 'DECLINED'
}

export enum InspectionStatus {
  NOT_REQUIRED = 'NOT_REQUIRED',
  REQUIRED = 'REQUIRED',
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface Attachment {
  attachmentId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
  uploadedBy: string;
  documentType: DocumentType;
  url?: string;
}

export enum DocumentType {
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  VEHICLE_REGISTRATION = 'VEHICLE_REGISTRATION',
  VEHICLE_TITLE = 'VEHICLE_TITLE',
  PROOF_OF_PRIOR_INSURANCE = 'PROOF_OF_PRIOR_INSURANCE',
  LOSS_RUNS = 'LOSS_RUNS',
  MVR = 'MVR',
  BUSINESS_LICENSE = 'BUSINESS_LICENSE',
  TAX_RETURN = 'TAX_RETURN',
  FINANCIAL_STATEMENT = 'FINANCIAL_STATEMENT',
  INSPECTION_REPORT = 'INSPECTION_REPORT',
  OTHER = 'OTHER'
}

export interface Note {
  noteId: string;
  noteText: string;
  createdBy: string;
  createdDate: Date;
  noteType: NoteType;
  isInternal: boolean;
}

export enum NoteType {
  GENERAL = 'GENERAL',
  UNDERWRITING = 'UNDERWRITING',
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
  CLAIMS = 'CLAIMS',
  BILLING = 'BILLING',
  FOLLOW_UP = 'FOLLOW_UP'
}
