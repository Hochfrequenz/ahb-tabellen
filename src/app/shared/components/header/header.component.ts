import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconLogoComponent } from '../icon-logo/icon-logo.component';
import { LoginButtonComponent } from '../login-button/login-button.component';
import { FeatureSwitcherComponent } from '../feature-switcher/feature-switcher.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IconLogoComponent,
    LoginButtonComponent,
    FeatureSwitcherComponent,
  ],
  templateUrl: './header.component.html',
  animations: [
    trigger('expandCollapse', [
      state(
        'closed',
        style({ height: '0px', opacity: 0, overflow: 'hidden', transform: 'translateY(-4px)' })
      ),
      state(
        'open',
        style({ height: '*', opacity: 1, overflow: 'hidden', transform: 'translateY(0)' })
      ),
      transition('closed => open', animate('280ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('open => closed', animate('220ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HeaderComponent {
  isMobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(current => !current);
  }
}
