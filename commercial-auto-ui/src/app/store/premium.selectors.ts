import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PremiumState } from './premium.reducer';

export const selectPremiumState = createFeatureSelector<PremiumState>('premium');

export const selectInputValue = createSelector(
  selectPremiumState,
  (state: PremiumState) => state.inputValue
);

export const selectLastUpdated = createSelector(
  selectPremiumState,
  (state: PremiumState) => state.lastUpdated
);
