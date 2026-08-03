import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatenstandDisplayComponent } from '../datenstand-display/datenstand-display.component';
import { VersionDisplayComponent } from '../version-display/version-display.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [DatenstandDisplayComponent, VersionDisplayComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
