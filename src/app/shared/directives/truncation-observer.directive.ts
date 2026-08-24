import { Directive, ElementRef, OnDestroy, inject, input, output } from '@angular/core';

/**
 * Reports whether the host element's content overflows its (line-clamped) box, and
 * optionally whether a "marker" element (e.g. a highlighted change) is clipped away
 * below the visible clamp area.
 *
 * Bind the clamp-active state via the selector input: measurements only run while the
 * clamp is applied, because an expanded (un-clamped) element never overflows and would
 * otherwise report `false` and wrongly clear cached flags on the consumer.
 *
 * - `(truncated)` fires when the overflow state changes.
 * - `(markerHidden)` fires when the "is a marker clipped away" state changes. It is only
 *   evaluated when `markerSelector` is set. It is `true` when at least one marker exists
 *   and every marker starts below the visible clamp area (i.e. no marker is visible).
 */
@Directive({
  selector: '[appTruncationObserver]',
  standalone: true,
})
export class TruncationObserverDirective implements OnDestroy {
  /** Whether the clamp is currently applied. Measurement only runs while `true`. */
  readonly active = input(true, { alias: 'appTruncationObserver' });

  /** Optional CSS selector for markers to test for being clipped below the clamp. */
  readonly markerSelector = input<string | null>(null);

  /** Fires when the overflow (truncated) state changes. */
  readonly truncated = output<boolean>();

  /** Fires when the "a marker is hidden below the clamp" state changes. */
  readonly markerHidden = output<boolean>();

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly resizeObserver = new ResizeObserver(() => this.measure());
  private lastTruncated: boolean | undefined;
  private lastMarkerHidden: boolean | undefined;

  constructor() {
    // ResizeObserver delivers an initial callback right after observation starts,
    // giving us the first measurement once the element has been laid out.
    this.resizeObserver.observe(this.element.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }

  private measure(): void {
    if (!this.active()) {
      return;
    }
    const node = this.element.nativeElement;
    // +1 guards against sub-pixel rounding where scrollHeight is reported 1px
    // taller than clientHeight without any real overflow.
    const isTruncated = node.scrollHeight > node.clientHeight + 1;
    if (isTruncated !== this.lastTruncated) {
      this.lastTruncated = isTruncated;
      this.truncated.emit(isTruncated);
    }

    const selector = this.markerSelector();
    if (selector) {
      const hidden = this.computeMarkerHidden(node, selector);
      if (hidden !== this.lastMarkerHidden) {
        this.lastMarkerHidden = hidden;
        this.markerHidden.emit(hidden);
      }
    }
  }

  /**
   * True when markers exist but none of them begin within the visible clamp area —
   * i.e. the highlighted change lives entirely in the clipped-away text. Clamped
   * lines are still laid out (only visually clipped), so their geometry is reliable.
   */
  private computeMarkerHidden(node: HTMLElement, selector: string): boolean {
    const markers = node.querySelectorAll(selector);
    if (markers.length === 0) {
      return false;
    }
    const visibleBottom = node.getBoundingClientRect().top + node.clientHeight;
    for (const marker of Array.from(markers)) {
      // -1 tolerance for sub-pixel rounding at the clamp boundary.
      if (marker.getBoundingClientRect().top < visibleBottom - 1) {
        return false; // at least one marker is (partly) visible
      }
    }
    return true;
  }
}
