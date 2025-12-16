export interface BusinessInfo {
  businessName: string;
  dbaName?: string;
  businessType: BusinessType;
  yearsInBusiness: number;
  federalTaxId: string;
  naicsCode?: string;
  numberOfEmployees: number;
  annualRevenue: number;
  businessAddress: Address;
  mailingAddress?: Address;
  contactInfo: ContactInfo;
}

export enum BusinessType {
  SOLE_PROPRIETORSHIP = 'SOLE_PROPRIETORSHIP',
  PARTNERSHIP = 'PARTNERSHIP',
  LLC = 'LLC',
  CORPORATION = 'CORPORATION',
  S_CORPORATION = 'S_CORPORATION',
  NON_PROFIT = 'NON_PROFIT'
}

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  county?: string;
}

export interface ContactInfo {
  primaryContactName: string;
  title?: string;
  email: string;
  phoneNumber: string;
  alternatePhoneNumber?: string;
  preferredContactMethod: ContactMethod;
}

export enum ContactMethod {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  TEXT = 'TEXT'
}
