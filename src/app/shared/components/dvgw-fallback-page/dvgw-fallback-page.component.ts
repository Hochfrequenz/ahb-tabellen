import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { getDvgwPruefiInfo } from '../../utils/dvgw-pruefi.utils';

@Component({
  selector: 'app-dvgw-fallback-page',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './dvgw-fallback-page.component.html',
})
export class DvgwFallbackPageComponent {
  /** The DVGW Prüfidentifikator this fallback page is shown for (e.g. '44096'). */
  readonly pruefi = input.required<string>();

  /** DVGW document info (document URL + link text) for the current Prüfidentifikator. */
  readonly info = computed(() => getDvgwPruefiInfo(this.pruefi()));

  /** Explanatory message referencing the concrete Prüfidentifikator. */
  readonly message = computed(
    () =>
      `Der Prüfidentifikator ${this.pruefi()} wird von der DVGW ausschließlich als PDF-Dokument veröffentlicht. ` +
      'Uns stehen zur Zeit nur die Dokumente des BDEW in maschinenlesbarer Form bereit.'
  );
}
