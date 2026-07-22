import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-fallback-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './fallback-page.component.html',
})
export class FallbackPageComponent {
  @Input() pruefi!: string;
  @Input() formatVersion!: string;
}
