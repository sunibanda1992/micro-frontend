import { createReducer, on } from '@ngrx/store';
import { Quote, QuoteStatus } from '../models/Quote';
import * as QuoteActions from './quote.actions';

export interface QuoteState {
  currentQuote: Quote | null;
  loading: boolean;
  error: string | null;
  lastSaved: Date | null;
  isDirty: boolean;
}

export const initialState: QuoteState = {
  currentQuote: null,
  loading: false,
  error: null,
  lastSaved: null,
  isDirty: false
};

export const quoteReducer = createReducer(
  initialState,

  // Load Quote
  on(QuoteActions.loadQuote, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(QuoteActions.loadQuoteSuccess, (state, { quote }) => ({
    ...state,
    currentQuote: quote,
    loading: false,
    error: null,
    isDirty: false
  })),
  on(QuoteActions.loadQuoteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create Quote
  on(QuoteActions.createQuote, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(QuoteActions.createQuoteSuccess, (state, { quote }) => ({
    ...state,
    currentQuote: quote,
    loading: false,
    error: null,
    isDirty: false,
    lastSaved: new Date()
  })),
  on(QuoteActions.createQuoteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Quote
  on(QuoteActions.updateQuote, (state, { quote }) => ({
    ...state,
    currentQuote: state.currentQuote ? { ...state.currentQuote, ...quote } : null,
    isDirty: true
  })),
  on(QuoteActions.updateQuoteSuccess, (state, { quote }) => ({
    ...state,
    currentQuote: quote,
    loading: false,
    error: null,
    isDirty: false,
    lastSaved: new Date()
  })),
  on(QuoteActions.updateQuoteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete Quote
  on(QuoteActions.deleteQuote, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  // Reset Quote
  on(QuoteActions.resetQuote, () => initialState),

  // Update Quote Status
  on(QuoteActions.updateQuoteStatus, (state, { status }) => ({
    ...state,
    currentQuote: state.currentQuote
      ? { ...state.currentQuote, quoteStatus: status }
      : null,
    isDirty: true
  })),

  // Update Business Info
  on(QuoteActions.updateBusinessInfo, (state, { businessInfo }) => ({
    ...state,
    currentQuote: state.currentQuote
      ? { ...state.currentQuote, businessInfo }
      : null,
    isDirty: true
  })),

  // Add Vehicle
  on(QuoteActions.addVehicle, (state, { vehicle }) => ({
    ...state,
    currentQuote: state.currentQuote
      ? { ...state.currentQuote, vehicles: [...state.currentQuote.vehicles, vehicle] }
      : null,
    isDirty: true
  })),

  // Update Vehicle
  on(QuoteActions.updateVehicle, (state, { vehicleId, vehicle }) => ({
    ...state,
    currentQuote: state.currentQuote
      ? {
          ...state.currentQuote,
          vehicles: state.currentQuote.vehicles.map(v =>
            v.vehicleId === vehicleId ? { ...v, ...vehicle } : v
          )
        }
      : null,
    isDirty: true
  })),

  // Remove Vehicle
  on(QuoteActions.removeVehicle, (state, { vehicleId }) => ({
    ...state,
    currentQuote: state.currentQuote
      ? {
          ...state.currentQuote,
          vehicles: state.currentQuote.vehicles.filter(v => v.vehicleId !== vehicleId)
        }
      : null,
    isDirty: true
  })),

  // Add Driver
  on(QuoteActions.addDriver, (state, { driver }) => ({
    ...state,
    currentQuote: state.currentQuote
      ? { ...state.currentQuote, drivers: [...state.currentQuote.drivers, driver] }
      : null,
    isDirty: true
  })),

  // Update Driver
  on(QuoteActions.updateDriver, (state, { driverId, driver }) => ({
    ...state,
    currentQuote: state.currentQuote
      ? {
          ...state.currentQuote,
          drivers: state.currentQuote.drivers.map(d =>
            d.driverId === driverId ? { ...d, ...driver } : d
          )
        }
      : null,
    isDirty: true
  })),

  // Remove Driver
  on(QuoteActions.removeDriver, (state, { driverId }) => ({
    ...state,
    currentQuote: state.currentQuote
      ? {
          ...state.currentQuote,
          drivers: state.currentQuote.drivers.filter(d => d.driverId !== driverId)
        }
      : null,
    isDirty: true
  })),

  // Update Coverage
  on(QuoteActions.updateCoverage, (state, { coverage }) => ({
    ...state,
    currentQuote: state.currentQuote
      ? { ...state.currentQuote, coverage }
      : null,
    isDirty: true
  })),

  // Calculate Premium
  on(QuoteActions.calculatePremium, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(QuoteActions.calculatePremiumSuccess, (state, { totalPremium }) => ({
    ...state,
    currentQuote: state.currentQuote
      ? {
          ...state.currentQuote,
          premium: { ...state.currentQuote.premium, totalPremium }
        }
      : null,
    loading: false,
    error: null
  })),
  on(QuoteActions.calculatePremiumFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Save Quote
  on(QuoteActions.saveQuote, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(QuoteActions.saveQuoteSuccess, (state, { quote }) => ({
    ...state,
    currentQuote: quote,
    loading: false,
    error: null,
    isDirty: false,
    lastSaved: new Date()
  })),
  on(QuoteActions.saveQuoteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
