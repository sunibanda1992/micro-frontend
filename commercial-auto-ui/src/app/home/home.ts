import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { updatePremiumValue } from '../store/premium.actions';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  premiumInput = '';

  constructor(private store: Store) {}

  onSubmit() {
    if (this.premiumInput.trim()) {
      this.store.dispatch(updatePremiumValue({ value: this.premiumInput }));
      console.log('Premium value dispatched:', this.premiumInput);
    }
  }

  onReset() {
    this.premiumInput = '';
  }
}
