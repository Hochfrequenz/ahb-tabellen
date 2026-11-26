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

  toggle(event: Event): void {
    event.stopPropagation();
    this.state.toggle(this.node());
  }
}
