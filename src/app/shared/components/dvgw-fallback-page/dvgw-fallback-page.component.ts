import { Component } from '@angular/core';

@Component({
  selector: 'app-dvgw-fallback-page',
  standalone: true,
  imports: [],
  templateUrl: './dvgw-fallback-page.component.html',
})
export class DvgwFallbackPageComponent {
  readonly message =
    'Die Prüfidentifikatoren 70095 und 70096 werden in einem PDF Dokument der DVGW veröffentlicht. Uns stehen zur Zeit nur die Dokumente des BDEW in maschinenlesbarer Form bereit.';
}
