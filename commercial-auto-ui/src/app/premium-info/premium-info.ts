import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { selectInputValue, selectLastUpdated } from '../store/premium.selectors';

@Component({
  selector: 'app-premium-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './premium-info.html',
  styleUrl: './premium-info.scss'
})
export class PremiumInfo implements OnInit, OnDestroy {
  premiumData = {
    basePremium: 2500,
    discounts: [
      { name: 'Safe Driver', amount: 250 },
      { name: 'Multi-Vehicle', amount: 150 },
      { name: 'Good Student', amount: 100 }
    ],
    fees: [
      { name: 'Administrative Fee', amount: 50 },
      { name: 'Policy Fee', amount: 25 }
    ]
  };

  // NgRx store observables
  inputValue$: Observable<string>;
  lastUpdated$: Observable<Date | null>;

  // Current values for display
  currentInputValue = '';
  private subscription?: Subscription;

  constructor(private store: Store) {
    this.inputValue$ = this.store.select(selectInputValue);
    this.lastUpdated$ = this.store.select(selectLastUpdated);
  }

  ngOnInit() {
    // Subscribe to input value changes
    this.subscription = this.inputValue$.subscribe(value => {
      this.currentInputValue = value;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get totalDiscounts(): number {
    return this.premiumData.discounts.reduce((sum, discount) => sum + discount.amount, 0);
  }

  get totalFees(): number {
    return this.premiumData.fees.reduce((sum, fee) => sum + fee.amount, 0);
  }

  get finalPremium(): number {
    return this.premiumData.basePremium - this.totalDiscounts + this.totalFees;
  }
}
