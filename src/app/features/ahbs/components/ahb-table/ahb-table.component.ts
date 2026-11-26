import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  input,
  output,
  signal,
  viewChild,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Ahb, AhbMigLink, AhbMigLinks } from '../../../../core/api';
import { HighlightPipe, HighlightResult } from '../../../../shared/pipes/highlight.pipe';
import { environment } from '../../../../environments/environment';
import { IconLinkComponent } from '../../../../shared/components/icon-link/icon-link.component';
import { DomSanitizer } from '@angular/platform-browser';
import { getFormatFromPruefi } from '../../../../shared/utils/pruefi-format.utils';
import { RowGuide, hiddenRows, treeGuides } from '../../ahb-tree-guides';
import { MigElementDetailsComponent } from '../../../mig/components/mig-element-details/mig-element-details.component';

interface ExpandedState {
  [key: number]: boolean;
}

@Component({
  selector: 'app-ahb-table',
  standalone: true,
  imports: [HighlightPipe, IconLinkComponent, MigElementDetailsComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './ahb-table.component.html',
})
export class AhbTableComponent {
  private readonly elementRef = inject(ElementRef);

  header = viewChild<ElementRef>('header');

  lines = input.required<Ahb['lines']>();
  highlight = input<string | undefined>();
  formatVersion = input.required<string>();
  pruefi = input.required<string>();
  /** MIG element of each line; null hides the MIG column (feature off or no MIG data). */
  migLinks = input<AhbMigLinks | null>(null);

  scrollToElement = output<{ element: HTMLElement; offsetY: number }>();

  private highlightSignal = computed(() => this.highlight());
  markIndex = signal(0);
  expandedRows = signal<ExpandedState>({});
  private lastHighlightText = signal<string | undefined>(undefined);

  readonly migByGuid = computed(
    () => new Map<string, AhbMigLink>((this.migLinks()?.links ?? []).map(l => [l.guid, l]))
  );
  /** The MIG column shows only when there is something to link. */
  readonly hasMig = computed(() => (this.migLinks()?.links.length ?? 0) > 0);
  /**
   * Segment group brackets left of the table, from each line's id_path (see ahb-tree-guides).
   * Part of the MIG demo, so behind the same feature flag.
   */
  readonly guides = computed<(RowGuide | null)[]>(() =>
    environment.enableMigView
      ? treeGuides(
          this.lines().map(l => ({
            idPath: l.id_path,
            isSegmentGroup: l.line_type === this.LINE_TYPE.SEGMENT_GROUP,
          }))
        )
      : []
  );
  readonly hasGuides = computed(() => this.guides().some(g => g !== null));
  /** Horizontal space per nesting level, in px. */
  readonly guideStep = 20;
  /** Length of the tick at a group's header row, in px. */
  readonly guideTick = 7;
  readonly guideWidth = computed(
    () => Math.max(1, ...this.guides().map(g => g?.brackets.length ?? 0)) * this.guideStep + 8
  );
  /**
   * Collapsed segment groups, by the id_path of their header row. The id_path carries the
   * qualifier, so `SG4>SG8+Z79>` and `SG4>SG8+ZH0>` collapse independently.
   */
  readonly collapsedGroups = signal<ReadonlySet<string>>(new Set());
  /** Rows hidden by collapsed groups, by row index. */
  readonly hiddenRows = computed(() => {
    const collapsed = this.collapsedGroups();
    if (collapsed.size === 0) return new Set<number>();
    const rows = new Set<number>();
    this.lines().forEach((line, i) => {
      if (line.id_path && collapsed.has(line.id_path)) rows.add(i);
    });
    return hiddenRows(this.guides(), rows);
  });
  /** Lines whose MIG details are open, by guid. */
  readonly openMig = signal<ReadonlySet<string>>(new Set());

  // max. string length of 'Bedingung/Hinweis' entries
  readonly COLLAPSE_LENGTH = 80;

  private readonly LINE_TYPE = {
    SEGMENT_GROUP: 'segment_group',
    SEGMENT: 'segment',
    CODE: 'code',
    DATA_ELEMENT: 'dataelement',
  } as const;

  private readonly LINE_STYLE = {
    THICK: 'border-t-4 border-hf-grell-rose',
    THIN: 'border-t-2 border-hf-grell-rose',
    THIN_DOTTED: 'border-t-2 border-hf-grell-rose border-dashed',
    GREEN: 'border-t-4 border-green-500',
    NONE: '',
  } as const;

  /** Bumped after folding re-rendered the rows, so the search hits are read again. */
  private readonly rowsRendered = signal(0);
  private readonly injector = inject(Injector);

  markElements = computed<HTMLElement[]>(() => {
    this.rowsRendered();
    const highlight = this.highlight();
    const nativeElement = this.elementRef.nativeElement;
    if (!highlight || !nativeElement) {
      return [];
    }
    return Array.from(nativeElement.querySelectorAll('mark'));
  });

  private readonly domSanitizer = inject(DomSanitizer);

  constructor() {
    // Watch for highlight changes to reset the index and auto-expand rows
    effect(() => {
      const highlight = this.highlight();
      const lastHighlight = this.lastHighlightText();

      // Only run auto-expansion when the highlight text actually changes
      if (highlight && highlight !== lastHighlight) {
        this.lastHighlightText.set(highlight);
        // A new search must find its matches in collapsed groups too.
        this.collapsedGroups.set(new Set());
        this.markIndex.set(0);
        this.autoExpandRowsWithMatches(highlight);
        setTimeout(() => this.applyCurrentMark());
      } else if (highlight && highlight === lastHighlight) {
        // If highlight text is the same, just reset index and apply current mark
        this.markIndex.set(0);
        setTimeout(() => this.applyCurrentMark());
      }
    });
  }

  resetMarkIndex() {
    this.markIndex.set(0);
    this.applyCurrentMark();
  }

  getHighlight(): string | undefined {
    return this.highlightSignal();
  }

  nextResult() {
    const markElements = this.markElements();
    if (markElements.length === 0) return;

    const nextIndex = (this.markIndex() + 1) % markElements.length;
    this.markIndex.set(nextIndex);
    this.applyCurrentMark();
  }

  previousResult() {
    const markElements = this.markElements();
    if (markElements.length === 0) return;

    const previousIndex = (this.markIndex() - 1 + markElements.length) % markElements.length;
    this.markIndex.set(previousIndex);
    this.applyCurrentMark();
  }

  private applyCurrentMark() {
    const markElements = this.markElements();
    const currentIndex = this.markIndex();

    if (markElements.length === 0 || currentIndex >= markElements.length) {
      return;
    }

    // Update highlighting
    markElements.forEach(el => el.classList.remove('bg-orange-500'));
    const currentElement = markElements[currentIndex];
    currentElement.classList.add('bg-orange-500');

    // Notify parent component to scroll to this element
    if (currentElement) {
      const headerHeight = this.header()?.nativeElement.getBoundingClientRect().height ?? 0;
      this.scrollToElement.emit({
        element: currentElement,
        offsetY: headerHeight + 20,
      });
    }
  }

  // determines each time the section_name changes to add a bold rule in ahb-table.component.html
  hasSectionNameChanged(currentIndex: number): boolean {
    if (currentIndex === 0) return false;
    const currentLine = this.lines()[currentIndex];
    const previousLine = this.lines()[currentIndex - 1];
    return currentLine.section_name !== previousLine.section_name;
  }

  private getLineStyle(currentLine: Ahb['lines'][0], previousLine: Ahb['lines'][0]): string {
    if (!previousLine) return this.LINE_STYLE.NONE;

    const currentType = currentLine.line_type;
    const previousType = previousLine.line_type;

    // Helper function to check if two lines have the same segment and data element
    const hasSameSegmentAndDataElement = (
      line1: Ahb['lines'][0],
      line2: Ahb['lines'][0]
    ): boolean => {
      return line1.segment_code === line2.segment_code && line1.data_element === line2.data_element;
    };

    // Group 1: Thick lines (major structural changes)
    if (
      // Change from segment_group to segment
      (previousType === this.LINE_TYPE.SEGMENT_GROUP && currentType === this.LINE_TYPE.SEGMENT) ||
      // Change from code to segment_group
      (previousType === this.LINE_TYPE.CODE && currentType === this.LINE_TYPE.SEGMENT_GROUP) ||
      // Change from code to segment
      (previousType === this.LINE_TYPE.CODE && currentType === this.LINE_TYPE.SEGMENT) ||
      // Change from data_element to segment_group
      (previousType === this.LINE_TYPE.DATA_ELEMENT &&
        currentType === this.LINE_TYPE.SEGMENT_GROUP) ||
      // Change from data_element to segment
      (previousType === this.LINE_TYPE.DATA_ELEMENT && currentType === this.LINE_TYPE.SEGMENT)
    ) {
      return this.LINE_STYLE.THICK;
    }

    // Group 2: Thin dotted lines (same type with same segment and data element)
    if (
      // Code to code with same segment and data element
      (previousType === this.LINE_TYPE.CODE &&
        currentType === this.LINE_TYPE.CODE &&
        hasSameSegmentAndDataElement(previousLine, currentLine)) ||
      // Data element to data element with same segment and data element
      (previousType === this.LINE_TYPE.DATA_ELEMENT &&
        currentType === this.LINE_TYPE.DATA_ELEMENT &&
        hasSameSegmentAndDataElement(previousLine, currentLine))
    ) {
      return this.LINE_STYLE.THIN_DOTTED;
    }

    // Group 3: Thin lines (minor structural changes)
    if (
      // Segment to data_element
      (previousType === this.LINE_TYPE.SEGMENT && currentType === this.LINE_TYPE.DATA_ELEMENT) ||
      // Segment to code
      (previousType === this.LINE_TYPE.SEGMENT && currentType === this.LINE_TYPE.CODE) ||
      // Code to code
      (previousType === this.LINE_TYPE.CODE && currentType === this.LINE_TYPE.CODE) ||
      // Code to data_element
      (previousType === this.LINE_TYPE.CODE && currentType === this.LINE_TYPE.DATA_ELEMENT) ||
      // Data element to data element
      (previousType === this.LINE_TYPE.DATA_ELEMENT &&
        currentType === this.LINE_TYPE.DATA_ELEMENT) ||
      // Data element to code
      (previousType === this.LINE_TYPE.DATA_ELEMENT && currentType === this.LINE_TYPE.CODE)
    ) {
      return this.LINE_STYLE.THIN;
    }

    return this.LINE_STYLE.NONE;
  }

  // determines the appropriate class for each row
  getRowClass(index: number): string {
    if (index === 0) return this.LINE_STYLE.NONE;

    const currentLine = this.lines()[index];
    const previousLine = this.lines()[index - 1];

    return this.getLineStyle(currentLine, previousLine);
  }

  isSegmentGroup(index: number): boolean {
    const currentLine = this.lines()[index];

    if (currentLine.line_type === this.LINE_TYPE.SEGMENT_GROUP) {
      return true;
    }

    return false;
  }

  generateBedingungsbaumDeepLink(expression: string): string {
    const encodedExpression = encodeURIComponent(expression);
    return `${environment.bedingungsbaumBaseUrl}/tree/?format=${getFormatFromPruefi(this.pruefi())}&format_version=${this.formatVersion()}&expression=${encodedExpression}`;
  }

  generateEbdDeepLink(ebdKey: string | null | undefined): string | null {
    if (!ebdKey) {
      return null;
    }
    // EBD detection now happens in the backend (line.ebd_key); we only build the link.
    // e.g. https://ebd-stage.hochfrequenz.app/ebd/?formatversion=FV2504&ebd=E_0004
    return `${environment.ebdBaseUrl}/ebd/?formatversion=${this.formatVersion()}&ebd=${ebdKey}`;
  }

  // split before [<condition>] and remove empty strings
  addConditionLineBreaks(conditions: string): string[] {
    if (!conditions) return [];
    return conditions
      .split(/(?=\[\d+\])/)
      .map(s => s.trim())
      .filter(s => s);
  }

  toggleGroup(idPath: string): void {
    const collapsed = new Set(this.collapsedGroups());
    if (!collapsed.delete(idPath)) {
      collapsed.add(idPath);
    }
    this.collapsedGroups.set(collapsed);
    this.afterRowsChanged();
  }

  /**
   * Folding adds or removes rows and their search hits: once they are rendered, count the hits
   * again and keep the current one if it is still there.
   */
  private afterRowsChanged(): void {
    afterNextRender(
      () => {
        this.rowsRendered.update(n => n + 1);
        if (this.markIndex() >= this.markElements().length) {
          this.markIndex.set(0);
        }
      },
      { injector: this.injector }
    );
  }

  /** Rows of a group, header excluded, for the toggle's label. */
  groupSize(guide: RowGuide, row: number): number {
    return (guide.lastRow ?? row) - row;
  }

  toggleMig(guid: string): void {
    const open = new Set(this.openMig());
    if (!open.delete(guid)) {
      open.add(guid);
    }
    this.openMig.set(open);
  }

  toggleExpand(index: number) {
    const currentState = this.expandedRows();
    const newState = {
      ...currentState,
      [index]: !currentState[index],
    };
    this.expandedRows.set(newState);
    this.afterRowsChanged();

    // If there's an active search, re-apply highlighting to show/hide matches
    const highlight = this.highlight();
    if (highlight) {
      setTimeout(() => this.applyCurrentMark());
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedRows()[index] || false;
  }

  // "mehr/weniger anzeigen" toggle for 'Bedingungen/Hinweise' column if len > COLLAPSE_LENGTH
  shouldShowToggle(conditions: string): boolean {
    if (!conditions) return false;
    const allConditions = this.addConditionLineBreaks(conditions);
    return allConditions.length > 1;
  }

  getDisplayText(conditions: string, rowIndex: number): string {
    if (!conditions) return '';
    const allConditions = this.addConditionLineBreaks(conditions);

    if (this.isExpanded(rowIndex)) {
      return conditions;
    }

    return allConditions[0];
  }

  /**
   * Auto-expands rows that have search matches in their collapsed content
   */
  private autoExpandRowsWithMatches(highlightText: string): void {
    const lines = this.lines();
    const currentExpandedState = this.expandedRows();
    const newExpandedState = { ...currentExpandedState };

    lines.forEach((line, index) => {
      if (line.conditions && this.shouldShowToggle(line.conditions)) {
        const displayedText = this.getDisplayText(line.conditions, index);
        const isCurrentlyExpanded = this.isExpanded(index);

        // Check if there's a match in the full text but not in the displayed text
        const highlightResult = this.getEnhancedHighlightResult(
          displayedText,
          highlightText,
          line.conditions,
          isCurrentlyExpanded
        );

        // Only auto-expand if there's a match in the collapsed content
        // and the row is not already expanded
        if (highlightResult.needsExpansion && !isCurrentlyExpanded) {
          newExpandedState[index] = true;
        }
      }
    });

    // Only update if there are changes to avoid unnecessary re-renders
    if (JSON.stringify(currentExpandedState) !== JSON.stringify(newExpandedState)) {
      this.expandedRows.set(newExpandedState);
    }
  }

  /**
   * Gets enhanced highlight result for conditions column
   */
  getEnhancedHighlightResult(
    displayedText: string,
    highlightText: string,
    fullText: string,
    isExpanded: boolean
  ): HighlightResult {
    const highlightPipe = new HighlightPipe(this.domSanitizer);
    return highlightPipe.transform(
      displayedText,
      highlightText,
      fullText,
      isExpanded
    ) as HighlightResult;
  }
}
