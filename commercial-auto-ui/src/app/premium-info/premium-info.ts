import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-premium-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './premium-info.html',
  styleUrl: './premium-info.scss'
})
export class PremiumInfo {
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
