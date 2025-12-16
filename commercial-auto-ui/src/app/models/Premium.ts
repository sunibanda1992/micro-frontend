export interface Premium {
  basePremium: number;
  vehiclePremiums: VehiclePremium[];
  driverPremiums: DriverPremium[];
  coveragePremiums: CoveragePremium[];
  discounts: Discount[];
  surcharges: Surcharge[];
  fees: Fee[];
  taxes: Tax[];
  totalPremium: number;
  paymentPlan: PaymentPlan;
}

export interface VehiclePremium {
  vehicleId: string;
  liabilityPremium: number;
  physicalDamagePremium: number;
  totalVehiclePremium: number;
}

export interface DriverPremium {
  driverId: string;
  driverPremium: number;
  experienceMod?: number;
}

export interface CoveragePremium {
  coverageType: string;
  premium: number;
  description?: string;
}

export interface Discount {
  discountId: string;
  discountType: DiscountType;
  name: string;
  description?: string;
  amount: number;
  percentage?: number;
  appliedTo?: string;
}

export enum DiscountType {
  MULTI_VEHICLE = 'MULTI_VEHICLE',
  SAFE_DRIVER = 'SAFE_DRIVER',
  DEFENSIVE_DRIVING = 'DEFENSIVE_DRIVING',
  ANTI_THEFT_DEVICE = 'ANTI_THEFT_DEVICE',
  SAFETY_FEATURES = 'SAFETY_FEATURES',
  GPS_TRACKING = 'GPS_TRACKING',
  DASH_CAM = 'DASH_CAM',
  GOOD_STUDENT = 'GOOD_STUDENT',
  CLAIMS_FREE = 'CLAIMS_FREE',
  BUNDLING = 'BUNDLING',
  PAY_IN_FULL = 'PAY_IN_FULL',
  PAPERLESS = 'PAPERLESS',
  AUTO_PAY = 'AUTO_PAY',
  EARLY_QUOTE = 'EARLY_QUOTE',
  ASSOCIATION_MEMBER = 'ASSOCIATION_MEMBER'
}

export interface Surcharge {
  surchargeId: string;
  surchargeType: SurchargeType;
  name: string;
  description?: string;
  amount: number;
  percentage?: number;
  appliedTo?: string;
}

export enum SurchargeType {
  AT_FAULT_ACCIDENT = 'AT_FAULT_ACCIDENT',
  VIOLATION = 'VIOLATION',
  DUI_DWI = 'DUI_DWI',
  YOUNG_DRIVER = 'YOUNG_DRIVER',
  INEXPERIENCED_DRIVER = 'INEXPERIENCED_DRIVER',
  HIGH_RISK_VEHICLE = 'HIGH_RISK_VEHICLE',
  HIGH_MILEAGE = 'HIGH_MILEAGE',
  LAPSE_IN_COVERAGE = 'LAPSE_IN_COVERAGE',
  TERRITORY = 'TERRITORY'
}

export interface Fee {
  feeId: string;
  feeType: FeeType;
  name: string;
  amount: number;
  description?: string;
}

export enum FeeType {
  POLICY_FEE = 'POLICY_FEE',
  ADMINISTRATIVE_FEE = 'ADMINISTRATIVE_FEE',
  INSPECTION_FEE = 'INSPECTION_FEE',
  INSTALLMENT_FEE = 'INSTALLMENT_FEE',
  LATE_PAYMENT_FEE = 'LATE_PAYMENT_FEE',
  REINSTATEMENT_FEE = 'REINSTATEMENT_FEE',
  CANCELLATION_FEE = 'CANCELLATION_FEE',
  SR22_FILING_FEE = 'SR22_FILING_FEE'
}

export interface Tax {
  taxId: string;
  taxType: TaxType;
  name: string;
  amount: number;
  percentage: number;
  jurisdiction: string;
}

export enum TaxType {
  STATE_TAX = 'STATE_TAX',
  MUNICIPAL_TAX = 'MUNICIPAL_TAX',
  COUNTY_TAX = 'COUNTY_TAX',
  SURPLUS_LINES_TAX = 'SURPLUS_LINES_TAX',
  STAMPING_FEE = 'STAMPING_FEE'
}

export interface PaymentPlan {
  planType: PaymentPlanType;
  downPayment: number;
  numberOfInstallments: number;
  installmentAmount: number;
  installmentFee?: number;
  paymentMethod: PaymentMethod;
  autopay: boolean;
}

export enum PaymentPlanType {
  PAID_IN_FULL = 'PAID_IN_FULL',
  TWO_PAY = 'TWO_PAY',
  QUARTERLY = 'QUARTERLY',
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL'
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  ACH = 'ACH',
  CHECK = 'CHECK',
  WIRE_TRANSFER = 'WIRE_TRANSFER'
}
