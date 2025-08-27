import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dvgw-fallback-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dvgw-fallback-page.component.html',
})
export class DvgwFallbackPageComponent {
  readonly message =
    'Die Prüfidentifikatoren 70095 und 70096 werden von in einem PDF Dokument der DVGW veröffentlicht. Uns stehen zur Zeit nur die Dokumente des BDEW in maschinenlesbarer Form bereit.';
}
