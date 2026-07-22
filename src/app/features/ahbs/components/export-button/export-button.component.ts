import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { AhbService } from '../../../../core/api';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-export-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './export-button.component.html',
})
export class ExportButtonComponent {
  private ahbService = inject(AhbService);

  @Input() formatVersion!: string;
  @Input() pruefi!: string;

  async onClickExport(): Promise<void> {
    const blob = await firstValueFrom(
      this.ahbService.getAhb$VndOpenxmlformatsOfficedocumentSpreadsheetmlSheet({
        'format-version': this.formatVersion,
        pruefi: this.pruefi,
        format: 'xlsx',
      })
    );

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AHB_${this.formatVersion}_${this.pruefi}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
