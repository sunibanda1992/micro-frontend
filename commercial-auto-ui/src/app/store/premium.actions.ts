import { createAction, props } from '@ngrx/store';

export const updatePremiumValue = createAction(
  '[Home] Update Premium Value',
  props<{ value: string }>()
);

export const resetPremiumValue = createAction(
  '[Premium Info] Reset Premium Value'
);
