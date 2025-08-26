import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconLogoComponent } from '../icon-logo/icon-logo.component';
import { LoginButtonComponent } from '../login-button/login-button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, IconLogoComponent, LoginButtonComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  isMobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(current => !current);
  }
}
