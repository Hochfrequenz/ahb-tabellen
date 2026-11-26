import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { MigNode } from '../../../../core/api';
import { MigTreeState } from '../../mig-tree-state.service';

export const TYPE_LABELS: Record<MigNode['type'], string> = {
  segment_group: 'SG',
  segment: 'Seg',
  dataelementgroup: 'DEG',
  dataelement: 'DE',
  code: 'Code',
};

@Component({
  selector: 'app-mig-tree-node',
  standalone: true,
  imports: [],
  templateUrl: './mig-tree-node.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MigTreeNodeComponent {
  readonly state = inject(MigTreeState);
  readonly node = input.required<MigNode>();
  readonly depth = input(0);
  /** Emitted with the node a user clicked, from any level below. */
  readonly picked = output<MigNode>();

  readonly typeLabels = TYPE_LABELS;
  readonly expanded = computed(() => this.state.expanded().has(this.node()));
  readonly selected = computed(() => this.state.selected() === this.node());

  select(): void {
    this.picked.emit(this.node());
  }

  /**
   * From the expander's click or Space on the row. The expander stops its own Enter/Space
   * keydown, so its native click toggles once; Space on the row must not scroll the page.
   */
  toggle(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.state.toggle(this.node());
  }
}
