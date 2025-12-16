import { createReducer, on } from '@ngrx/store';
import { updatePremiumValue, resetPremiumValue } from './premium.actions';

export interface PremiumState {
  inputValue: string;
  lastUpdated: Date | null;
}

export const initialState: PremiumState = {
  inputValue: '',
  lastUpdated: null
};

export const premiumReducer = createReducer(
  initialState,
  on(updatePremiumValue, (state, { value }) => ({
    ...state,
    inputValue: value,
    lastUpdated: new Date()
  })),
  on(resetPremiumValue, () => initialState)
);
