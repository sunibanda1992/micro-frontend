export interface Coverage {
  liabilityCoverage: LiabilityCoverage;
  physicalDamageCoverage?: PhysicalDamageCoverage;
  uninsuredMotoristCoverage?: UninsuredMotoristCoverage;
  medicalPaymentsCoverage?: MedicalPaymentsCoverage;
  personalInjuryProtection?: PersonalInjuryProtection;
  additionalCoverages?: AdditionalCoverage[];
  deductibles: Deductibles;
}

export interface LiabilityCoverage {
  bodilyInjuryPerPerson: number;
  bodilyInjuryPerAccident: number;
  propertyDamagePerAccident: number;
  combinedSingleLimit?: number;
  autoLiabilityLimit?: number;
}

export interface PhysicalDamageCoverage {
  comprehensiveDeductible: number;
  collisionDeductible: number;
  isSpecifiedPerils: boolean;
  towingAndLabor?: boolean;
  rentalReimbursement?: RentalReimbursement;
}

export interface RentalReimbursement {
  dailyLimit: number;
  maxDays: number;
}

export interface UninsuredMotoristCoverage {
  bodilyInjuryPerPerson: number;
  bodilyInjuryPerAccident: number;
  propertyDamage?: number;
  underinsuredMotorist: boolean;
}

export interface MedicalPaymentsCoverage {
  limitPerPerson: number;
  limitPerAccident: number;
}

export interface PersonalInjuryProtection {
  limitPerPerson: number;
  deductible?: number;
  extendedBenefits?: boolean;
}

export interface AdditionalCoverage {
  coverageType: AdditionalCoverageType;
  limit?: number;
  premium?: number;
  description?: string;
}

export enum AdditionalCoverageType {
  HIRED_AUTO = 'HIRED_AUTO',
  NON_OWNED_AUTO = 'NON_OWNED_AUTO',
  TRAILER_INTERCHANGE = 'TRAILER_INTERCHANGE',
  MOTOR_TRUCK_CARGO = 'MOTOR_TRUCK_CARGO',
  REFRIGERATED_CARGO = 'REFRIGERATED_CARGO',
  GARAGEKEEPERS_LIABILITY = 'GARAGEKEEPERS_LIABILITY',
  POLLUTION_LIABILITY = 'POLLUTION_LIABILITY',
  EMPLOYMENT_RELATED_PRACTICES = 'EMPLOYMENT_RELATED_PRACTICES',
  BLANKET_WAIVER_SUBROGATION = 'BLANKET_WAIVER_SUBROGATION',
  ADDITIONAL_INSURED = 'ADDITIONAL_INSURED'
}

export interface Deductibles {
  comprehensiveDeductible: number;
  collisionDeductible: number;
  glassDeductible?: number;
  disappearingDeductible?: boolean;
}
