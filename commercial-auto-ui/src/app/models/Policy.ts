export interface Policy {
  policyNumber?: string;
  quoteNumber: string;
  effectiveDate: Date;
  expirationDate: Date;
  policyStatus: PolicyStatus;
  policyTerm: PolicyTerm;
  issuingState: string;
  carrierName?: string;
  agentInfo?: AgentInfo;
  priorInsurance?: PriorInsurance;
  cancellationInfo?: CancellationInfo;
}

export enum PolicyStatus {
  QUOTE = 'QUOTE',
  QUOTED = 'QUOTED',
  BOUND = 'BOUND',
  ACTIVE = 'ACTIVE',
  PENDING_CANCELLATION = 'PENDING_CANCELLATION',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  RENEWED = 'RENEWED',
  NON_RENEWED = 'NON_RENEWED'
}

export enum PolicyTerm {
  SIX_MONTHS = 'SIX_MONTHS',
  ONE_YEAR = 'ONE_YEAR',
  TWO_YEARS = 'TWO_YEARS',
  THREE_YEARS = 'THREE_YEARS'
}

export interface AgentInfo {
  agentId: string;
  agentName: string;
  agencyName: string;
  agentEmail: string;
  agentPhone: string;
  agentLicenseNumber?: string;
}

export interface PriorInsurance {
  hadPriorInsurance: boolean;
  priorCarrier?: string;
  priorPolicyNumber?: string;
  priorExpirationDate?: Date;
  yearsWithPriorCarrier?: number;
  reasonForChange?: ReasonForChange;
  currentlyInsured: boolean;
  lapseInCoverage: boolean;
  lapseStartDate?: Date;
  lapseEndDate?: Date;
  lapseDurationDays?: number;
}

export enum ReasonForChange {
  BETTER_RATE = 'BETTER_RATE',
  BETTER_COVERAGE = 'BETTER_COVERAGE',
  POOR_SERVICE = 'POOR_SERVICE',
  CANCELLED_BY_CARRIER = 'CANCELLED_BY_CARRIER',
  NON_RENEWED = 'NON_RENEWED',
  NEW_BUSINESS = 'NEW_BUSINESS',
  AGENT_RECOMMENDATION = 'AGENT_RECOMMENDATION',
  OTHER = 'OTHER'
}

export interface CancellationInfo {
  cancellationDate?: Date;
  cancellationReason?: CancellationReason;
  cancellationRequestedBy?: string;
  refundAmount?: number;
}

export enum CancellationReason {
  NON_PAYMENT = 'NON_PAYMENT',
  INSURED_REQUEST = 'INSURED_REQUEST',
  MATERIAL_MISREPRESENTATION = 'MATERIAL_MISREPRESENTATION',
  INCREASED_RISK = 'INCREASED_RISK',
  LOSS_OF_ELIGIBILITY = 'LOSS_OF_ELIGIBILITY',
  FRAUD = 'FRAUD',
  LICENSE_SUSPENSION = 'LICENSE_SUSPENSION',
  OTHER = 'OTHER'
}
