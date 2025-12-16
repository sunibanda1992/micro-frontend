import { createFeatureSelector, createSelector } from '@ngrx/store';
import { QuoteState } from './quote.reducer';

// Feature Selector
export const selectQuoteState = createFeatureSelector<QuoteState>('quote');

// Basic Selectors
export const selectCurrentQuote = createSelector(
  selectQuoteState,
  (state: QuoteState) => state.currentQuote
);

export const selectLoading = createSelector(
  selectQuoteState,
  (state: QuoteState) => state.loading
);

export const selectError = createSelector(
  selectQuoteState,
  (state: QuoteState) => state.error
);

export const selectLastSaved = createSelector(
  selectQuoteState,
  (state: QuoteState) => state.lastSaved
);

export const selectIsDirty = createSelector(
  selectQuoteState,
  (state: QuoteState) => state.isDirty
);

// Quote Details Selectors
export const selectQuoteId = createSelector(
  selectCurrentQuote,
  (quote) => quote?.quoteId
);

export const selectQuoteNumber = createSelector(
  selectCurrentQuote,
  (quote) => quote?.quoteNumber
);

export const selectQuoteStatus = createSelector(
  selectCurrentQuote,
  (quote) => quote?.quoteStatus
);

export const selectQuoteDate = createSelector(
  selectCurrentQuote,
  (quote) => quote?.quoteDate
);

export const selectExpirationDate = createSelector(
  selectCurrentQuote,
  (quote) => quote?.expirationDate
);

// Business Info Selectors
export const selectBusinessInfo = createSelector(
  selectCurrentQuote,
  (quote) => quote?.businessInfo
);

export const selectBusinessName = createSelector(
  selectBusinessInfo,
  (businessInfo) => businessInfo?.businessName
);

export const selectBusinessType = createSelector(
  selectBusinessInfo,
  (businessInfo) => businessInfo?.businessType
);

export const selectBusinessAddress = createSelector(
  selectBusinessInfo,
  (businessInfo) => businessInfo?.businessAddress
);

// Vehicles Selectors
export const selectVehicles = createSelector(
  selectCurrentQuote,
  (quote) => quote?.vehicles || []
);

export const selectVehicleCount = createSelector(
  selectVehicles,
  (vehicles) => vehicles.length
);

export const selectVehicleById = (vehicleId: string) => createSelector(
  selectVehicles,
  (vehicles) => vehicles.find(v => v.vehicleId === vehicleId)
);

// Drivers Selectors
export const selectDrivers = createSelector(
  selectCurrentQuote,
  (quote) => quote?.drivers || []
);

export const selectDriverCount = createSelector(
  selectDrivers,
  (drivers) => drivers.length
);

export const selectDriverById = (driverId: string) => createSelector(
  selectDrivers,
  (drivers) => drivers.find(d => d.driverId === driverId)
);

// Coverage Selectors
export const selectCoverage = createSelector(
  selectCurrentQuote,
  (quote) => quote?.coverage
);

export const selectLiabilityCoverage = createSelector(
  selectCoverage,
  (coverage) => coverage?.liabilityCoverage
);

export const selectPhysicalDamageCoverage = createSelector(
  selectCoverage,
  (coverage) => coverage?.physicalDamageCoverage
);

export const selectDeductibles = createSelector(
  selectCoverage,
  (coverage) => coverage?.deductibles
);

// Premium Selectors
export const selectPremium = createSelector(
  selectCurrentQuote,
  (quote) => quote?.premium
);

export const selectTotalPremium = createSelector(
  selectPremium,
  (premium) => premium?.totalPremium || 0
);

export const selectBasePremium = createSelector(
  selectPremium,
  (premium) => premium?.basePremium || 0
);

export const selectDiscounts = createSelector(
  selectPremium,
  (premium) => premium?.discounts || []
);

export const selectTotalDiscounts = createSelector(
  selectDiscounts,
  (discounts) => discounts.reduce((sum, discount) => sum + discount.amount, 0)
);

export const selectSurcharges = createSelector(
  selectPremium,
  (premium) => premium?.surcharges || []
);

export const selectTotalSurcharges = createSelector(
  selectSurcharges,
  (surcharges) => surcharges.reduce((sum, surcharge) => sum + surcharge.amount, 0)
);

export const selectFees = createSelector(
  selectPremium,
  (premium) => premium?.fees || []
);

export const selectTotalFees = createSelector(
  selectFees,
  (fees) => fees.reduce((sum, fee) => sum + fee.amount, 0)
);

export const selectPaymentPlan = createSelector(
  selectPremium,
  (premium) => premium?.paymentPlan
);

// Policy Selectors
export const selectPolicy = createSelector(
  selectCurrentQuote,
  (quote) => quote?.policy
);

export const selectPolicyNumber = createSelector(
  selectPolicy,
  (policy) => policy?.policyNumber
);

export const selectPolicyStatus = createSelector(
  selectPolicy,
  (policy) => policy?.policyStatus
);

export const selectEffectiveDate = createSelector(
  selectPolicy,
  (policy) => policy?.effectiveDate
);

// Underwriting Selectors
export const selectUnderwritingInfo = createSelector(
  selectCurrentQuote,
  (quote) => quote?.underwritingInfo
);

export const selectRiskAssessment = createSelector(
  selectUnderwritingInfo,
  (underwritingInfo) => underwritingInfo?.riskAssessment
);

export const selectRiskTier = createSelector(
  selectRiskAssessment,
  (riskAssessment) => riskAssessment?.riskTier
);

export const selectApprovalStatus = createSelector(
  selectRiskAssessment,
  (riskAssessment) => riskAssessment?.approvalStatus
);

// Attachments Selectors
export const selectAttachments = createSelector(
  selectCurrentQuote,
  (quote) => quote?.attachments || []
);

export const selectAttachmentCount = createSelector(
  selectAttachments,
  (attachments) => attachments.length
);

// Notes Selectors
export const selectNotes = createSelector(
  selectCurrentQuote,
  (quote) => quote?.notes || []
);

export const selectInternalNotes = createSelector(
  selectNotes,
  (notes) => notes.filter(note => note.isInternal)
);

export const selectCustomerNotes = createSelector(
  selectNotes,
  (notes) => notes.filter(note => !note.isInternal)
);

// Composite Selectors
export const selectQuoteSummary = createSelector(
  selectQuoteNumber,
  selectQuoteStatus,
  selectBusinessName,
  selectVehicleCount,
  selectDriverCount,
  selectTotalPremium,
  (quoteNumber, status, businessName, vehicleCount, driverCount, totalPremium) => ({
    quoteNumber,
    status,
    businessName,
    vehicleCount,
    driverCount,
    totalPremium
  })
);

export const selectIsQuoteComplete = createSelector(
  selectBusinessInfo,
  selectVehicles,
  selectDrivers,
  selectCoverage,
  (businessInfo, vehicles, drivers, coverage) => {
    return !!(
      businessInfo &&
      vehicles.length > 0 &&
      drivers.length > 0 &&
      coverage
    );
  }
);
