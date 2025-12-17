import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, NgbModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class App {
  activeTab = 'client';

  constructor(private router: Router) {
    // Set active tab based on current route
    this.router.events.subscribe(() => {
      const currentRoute = this.router.url.split('/')[1] || 'client';
      this.activeTab = currentRoute;
    });
  }

  navigateToTab(tab: string) {
    this.activeTab = tab;
    this.router.navigate([tab]);
  }
}
