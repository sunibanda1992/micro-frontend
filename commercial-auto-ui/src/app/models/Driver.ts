export interface Driver {
  driverId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  maritalStatus: MaritalStatus;
  licenseNumber: string;
  licenseState: string;
  licenseStatus: LicenseStatus;
  licenseType: LicenseType;
  yearsLicensed: number;
  cdlEndorsements?: string[];
  driverAddress: Address;
  relationshipToBusiness: RelationshipToBusiness;
  hireDate?: Date;
  percentageOfUse: number;
  assignedVehicles: string[];
  drivingExperience: DrivingExperience;
  violations: Violation[];
  accidents: Accident[];
  claims: Claim[];
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY'
}

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
  DOMESTIC_PARTNER = 'DOMESTIC_PARTNER'
}

export enum LicenseStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  REVOKED = 'REVOKED',
  EXPIRED = 'EXPIRED'
}

export enum LicenseType {
  REGULAR = 'REGULAR',
  CDL_A = 'CDL_A',
  CDL_B = 'CDL_B',
  CDL_C = 'CDL_C',
  CHAUFFEUR = 'CHAUFFEUR'
}

export enum RelationshipToBusiness {
  OWNER = 'OWNER',
  PARTNER = 'PARTNER',
  EMPLOYEE = 'EMPLOYEE',
  FAMILY_MEMBER = 'FAMILY_MEMBER',
  CONTRACTOR = 'CONTRACTOR'
}

export interface DrivingExperience {
  totalYearsDriving: number;
  yearsCommercialDriving?: number;
  hasDefensiveDrivingCourse: boolean;
  defensiveDrivingCourseDate?: Date;
  hasCommercialDrivingTraining: boolean;
  commercialTrainingDate?: Date;
}

export interface Violation {
  violationId: string;
  violationType: ViolationType;
  description: string;
  violationDate: Date;
  convictionDate?: Date;
  points?: number;
  fineAmount?: number;
  state: string;
}

export enum ViolationType {
  SPEEDING = 'SPEEDING',
  RECKLESS_DRIVING = 'RECKLESS_DRIVING',
  DUI_DWI = 'DUI_DWI',
  CARELESS_DRIVING = 'CARELESS_DRIVING',
  FAILURE_TO_YIELD = 'FAILURE_TO_YIELD',
  IMPROPER_LANE_CHANGE = 'IMPROPER_LANE_CHANGE',
  FOLLOWING_TOO_CLOSELY = 'FOLLOWING_TOO_CLOSELY',
  CELL_PHONE_USE = 'CELL_PHONE_USE',
  SEAT_BELT = 'SEAT_BELT',
  OTHER = 'OTHER'
}

export interface Accident {
  accidentId: string;
  accidentDate: Date;
  atFault: boolean;
  percentageAtFault?: number;
  description: string;
  damageAmount?: number;
  injuries: boolean;
  fatalities: boolean;
  vehicleId?: string;
  state: string;
}

export interface Claim {
  claimId: string;
  claimDate: Date;
  claimType: ClaimType;
  claimAmount: number;
  claimStatus: ClaimStatus;
  description: string;
  atFault: boolean;
}

export enum ClaimType {
  COLLISION = 'COLLISION',
  COMPREHENSIVE = 'COMPREHENSIVE',
  LIABILITY = 'LIABILITY',
  UNINSURED_MOTORIST = 'UNINSURED_MOTORIST',
  MEDICAL_PAYMENTS = 'MEDICAL_PAYMENTS',
  PROPERTY_DAMAGE = 'PROPERTY_DAMAGE'
}

export enum ClaimStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  PENDING = 'PENDING',
  DENIED = 'DENIED'
}

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  county?: string;
}
