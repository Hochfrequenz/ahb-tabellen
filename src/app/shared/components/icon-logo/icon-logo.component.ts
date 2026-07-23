import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-icon-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './icon-logo.component.html',
})
export class IconLogoComponent {
  size = input(46);
}
