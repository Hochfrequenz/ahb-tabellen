import { Injectable, signal } from '@angular/core';
import { MigNode } from '../../core/api';

/** Expanded and selected nodes of one MIG tree; provided by the page, shared by all tree nodes. */
@Injectable()
export class MigTreeState {
  readonly expanded = signal<ReadonlySet<MigNode>>(new Set());
  readonly selected = signal<MigNode | null>(null);

  toggle(node: MigNode): void {
    const next = new Set(this.expanded());
    if (!next.delete(node)) next.add(node);
    this.expanded.set(next);
  }

  /** Expand the given nodes in addition to the ones already open. */
  expand(nodes: Iterable<MigNode>): void {
    this.expanded.set(new Set([...this.expanded(), ...nodes]));
  }

  setExpanded(nodes: Iterable<MigNode>): void {
    this.expanded.set(new Set(nodes));
  }
}
