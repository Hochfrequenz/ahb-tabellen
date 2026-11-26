import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AhbMigLink, AhbMigLinks } from '../../../../core/api';
import { STATUS_LABELS, TYPE_NAMES } from '../../mig-tree';

/** The MIG facts of one AHB line, with a link to the element in the MIG view. */
@Component({
  selector: 'app-mig-element-details',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mig-element-details.component.html',
})
export class MigElementDetailsComponent {
  link = input.required<AhbMigLink>();
  mig = input.required<AhbMigLinks['mig']>();

  readonly statusLabels = STATUS_LABELS;
  readonly typeNames = TYPE_NAMES;

  readonly element = computed(() => this.link().element);
  readonly migRoute = computed(() => ['/mig', this.mig().formatVersion, this.mig().format]);
  readonly migQuery = computed(() => ({
    version: this.mig().versionsnummer,
    node: this.link().node,
  }));
}
