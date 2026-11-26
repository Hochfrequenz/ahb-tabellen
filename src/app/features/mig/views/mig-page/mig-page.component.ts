import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { combineLatest, distinctUntilChanged, map } from 'rxjs';
import { getCurrentEdifactFormatVersion } from '@hochfrequenz/efoli';

import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { FormatVersionSelectComponent } from '../../../ahbs/components/format-version-select/format-version-select.component';
import { MigNode, MigService, MigSummary, MigTree } from '../../../../core/api';
import { MigTreeState } from '../../mig-tree-state.service';
import {
  MigTreeNodeComponent,
  TYPE_LABELS,
} from '../../components/mig-tree-node/mig-tree-node.component';
import {
  STATUS_LABELS,
  TYPE_NAMES,
  expandableNodes,
  indexMigTree,
  nodeAtPath,
  sampleMessage,
} from '../../mig-tree';

@Component({
  selector: 'app-mig-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    FormatVersionSelectComponent,
    MigTreeNodeComponent,
  ],
  providers: [MigTreeState],
  templateUrl: './mig-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MigPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly migService = inject(MigService);
  private readonly title = inject(Title);
  private readonly destroyRef = inject(DestroyRef);
  readonly state = inject(MigTreeState);

  readonly statusLabels = STATUS_LABELS;
  readonly typeLabels = TYPE_LABELS;
  readonly typeNames = TYPE_NAMES;

  readonly formatVersionControl = new FormControl<string>('', { nonNullable: true });
  readonly formatVersion = signal('');
  readonly format = signal('');
  readonly version = signal('');

  readonly migs = signal<MigSummary[]>([]);
  readonly tree = signal<MigTree | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly tab = signal<'tree' | 'sample'>('tree');
  readonly linkCopied = signal(false);

  readonly selectedMigKey = computed(() => `${this.format()}|${this.version()}`);
  readonly index = computed(() => indexMigTree(this.tree()?.nodes ?? []));
  readonly sample = computed(() => sampleMessage(this.tree()?.nodes ?? []));
  readonly selectedLocation = computed(() => {
    const node = this.state.selected();
    return node ? this.index().get(node) : undefined;
  });

  private loadedTreeKey = '';
  private loadedListFormatVersion = '';

  constructor() {
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(
        map(([params, query]) => ({
          formatVersion: params.get('formatVersion') ?? '',
          format: params.get('format') ?? '',
          version: query.get('version') ?? '',
          node: query.get('node') ?? '',
        })),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(p => this.onRoute(p));

    this.formatVersionControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(fv => {
        if (fv && fv !== this.formatVersion()) {
          this.navigate(fv, '', '', '');
        }
      });
  }

  private onRoute(p: {
    formatVersion: string;
    format: string;
    version: string;
    node: string;
  }): void {
    const formatVersion = p.formatVersion || getCurrentEdifactFormatVersion();
    this.formatVersion.set(formatVersion);
    this.format.set(p.format.toUpperCase());
    this.version.set(p.version);
    this.formatVersionControl.setValue(formatVersion, { emitEvent: false });

    if (this.loadedListFormatVersion !== formatVersion) {
      this.loadedListFormatVersion = formatVersion;
      this.migs.set([]);
      this.migService.getMigs({ 'format-version': formatVersion }).subscribe({
        next: migs => {
          this.migs.set(migs);
          if (!this.format() && migs.length > 0) {
            this.navigate(formatVersion, migs[0].format, migs[0].versionsnummer, '', true);
          }
        },
        error: () => this.error.set('Die MIGs konnten nicht geladen werden.'),
      });
    }

    if (!p.format) {
      this.tree.set(null);
      return;
    }
    const treeKey = `${formatVersion}|${p.format}|${p.version}`;
    if (treeKey === this.loadedTreeKey) {
      this.selectByPath(p.node);
      return;
    }
    this.loadedTreeKey = treeKey;
    this.loading.set(true);
    this.error.set('');
    this.tree.set(null);
    this.state.setExpanded([]);
    this.state.selected.set(null);
    this.migService
      .getMigTree({
        'format-version': formatVersion,
        format: p.format,
        ...(p.version ? { version: p.version } : {}),
      })
      .subscribe({
        next: tree => {
          this.tree.set(tree);
          this.loading.set(false);
          this.version.set(tree.meta.versionsnummer);
          this.title.setTitle(
            `MIG ${tree.meta.format} ${tree.meta.versionsnummer} | ${formatVersion}`
          );
          // Top level open: the message's outline is visible at once.
          this.state.setExpanded(tree.nodes.filter(n => n.type === 'segment_group'));
          this.selectByPath(p.node);
        },
        error: err => {
          this.loading.set(false);
          this.error.set(err?.error?.message ?? 'Die MIG konnte nicht geladen werden.');
        },
      });
  }

  /** Select the node of a deep link, open its ancestors and scroll it into view. */
  private selectByPath(path: string): void {
    const nodes = this.tree()?.nodes ?? [];
    const node = path ? nodeAtPath(nodes, path) : undefined;
    if (!node) return;
    this.state.expand(this.index().get(node)?.ancestors ?? []);
    this.state.selected.set(node);
    setTimeout(() =>
      document
        .getElementById('mig-selected-node')
        ?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    );
  }

  onMigChange(value: string): void {
    const [format, version] = value.split('|');
    this.navigate(this.formatVersion(), format, version, '');
  }

  /** A click in the tree or the sample message: select, open, and put it into the URL. */
  pick(node: MigNode): void {
    this.state.selected.set(node);
    if (node.children.length > 0 && !this.state.expanded().has(node)) {
      this.state.toggle(node);
    }
    const path = this.index().get(node)?.path ?? '';
    this.navigate(this.formatVersion(), this.format(), this.version(), path, true);
  }

  pickFromSample(node: MigNode): void {
    this.tab.set('tree');
    this.pick(node);
    this.selectByPath(this.index().get(node)?.path ?? '');
  }

  expandAll(): void {
    this.state.setExpanded(expandableNodes(this.tree()?.nodes ?? []));
  }

  collapseAll(): void {
    this.state.setExpanded([]);
  }

  copyLink(): void {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      this.linkCopied.set(true);
      setTimeout(() => this.linkCopied.set(false), 1500);
    });
  }

  private navigate(
    formatVersion: string,
    format: string,
    version: string,
    node: string,
    replaceUrl = false
  ): void {
    const queryParams: Record<string, string> = {};
    if (version) queryParams['version'] = version;
    if (node) queryParams['node'] = node;
    this.router.navigate(format ? ['/mig', formatVersion, format] : ['/mig'], {
      queryParams,
      replaceUrl,
    });
    if (!format) {
      // '/mig' without a format: remember the chosen format version for the MIG list.
      this.loadedListFormatVersion = '';
      this.onRoute({ formatVersion, format: '', version: '', node: '' });
    }
  }
}
