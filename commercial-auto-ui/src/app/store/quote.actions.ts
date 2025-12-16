import { createAction, props } from '@ngrx/store';
import { Quote, QuoteStatus } from '../models/Quote';
import { BusinessInfo } from '../models/BusinessInfo';
import { Vehicle } from '../models/Vehicle';
import { Driver } from '../models/Driver';
import { Coverage } from '../models/Coverage';

// Quote CRUD Actions
export const loadQuote = createAction(
  '[Quote] Load Quote',
  props<{ quoteId: string }>()
);

export const loadQuoteSuccess = createAction(
  '[Quote] Load Quote Success',
  props<{ quote: Quote }>()
);

export const loadQuoteFailure = createAction(
  '[Quote] Load Quote Failure',
  props<{ error: string }>()
);

export const createQuote = createAction(
  '[Quote] Create Quote',
  props<{ quote: Partial<Quote> }>()
);

export const createQuoteSuccess = createAction(
  '[Quote] Create Quote Success',
  props<{ quote: Quote }>()
);

export const createQuoteFailure = createAction(
  '[Quote] Create Quote Failure',
  props<{ error: string }>()
);

export const updateQuote = createAction(
  '[Quote] Update Quote',
  props<{ quote: Partial<Quote> }>()
);

export const updateQuoteSuccess = createAction(
  '[Quote] Update Quote Success',
  props<{ quote: Quote }>()
);

export const updateQuoteFailure = createAction(
  '[Quote] Update Quote Failure',
  props<{ error: string }>()
);

export const deleteQuote = createAction(
  '[Quote] Delete Quote',
  props<{ quoteId: string }>()
);

export const resetQuote = createAction(
  '[Quote] Reset Quote'
);

// Quote Status Actions
export const updateQuoteStatus = createAction(
  '[Quote] Update Quote Status',
  props<{ status: QuoteStatus }>()
);

// Business Info Actions
export const updateBusinessInfo = createAction(
  '[Quote] Update Business Info',
  props<{ businessInfo: BusinessInfo }>()
);

// Vehicle Actions
export const addVehicle = createAction(
  '[Quote] Add Vehicle',
  props<{ vehicle: Vehicle }>()
);

export const updateVehicle = createAction(
  '[Quote] Update Vehicle',
  props<{ vehicleId: string; vehicle: Partial<Vehicle> }>()
);

export const removeVehicle = createAction(
  '[Quote] Remove Vehicle',
  props<{ vehicleId: string }>()
);

// Driver Actions
export const addDriver = createAction(
  '[Quote] Add Driver',
  props<{ driver: Driver }>()
);

export const updateDriver = createAction(
  '[Quote] Update Driver',
  props<{ driverId: string; driver: Partial<Driver> }>()
);

export const removeDriver = createAction(
  '[Quote] Remove Driver',
  props<{ driverId: string }>()
);

// Coverage Actions
export const updateCoverage = createAction(
  '[Quote] Update Coverage',
  props<{ coverage: Coverage }>()
);

// Premium Calculation Actions
export const calculatePremium = createAction(
  '[Quote] Calculate Premium'
);

export const calculatePremiumSuccess = createAction(
  '[Quote] Calculate Premium Success',
  props<{ totalPremium: number }>()
);

export const calculatePremiumFailure = createAction(
  '[Quote] Calculate Premium Failure',
  props<{ error: string }>()
);

// Save Quote Action
export const saveQuote = createAction(
  '[Quote] Save Quote'
);

export const saveQuoteSuccess = createAction(
  '[Quote] Save Quote Success',
  props<{ quote: Quote }>()
);

export const saveQuoteFailure = createAction(
  '[Quote] Save Quote Failure',
  props<{ error: string }>()
);
