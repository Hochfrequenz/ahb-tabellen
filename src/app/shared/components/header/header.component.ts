import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconLogoComponent } from '../icon-logo/icon-logo.component';
import { LoginButtonComponent } from '../login-button/login-button.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, IconLogoComponent, LoginButtonComponent],
  templateUrl: './header.component.html',
  animations: [
    trigger('expandCollapse', [
      state('closed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('open', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      transition('closed <=> open', animate('200ms ease-in-out')),
    ]),
  ],
})
export class HeaderComponent {
  isMobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(current => !current);
  }
}
