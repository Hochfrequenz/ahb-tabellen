import { Directive, ElementRef, OnDestroy, inject, input, output } from '@angular/core';

/**
 * Reports whether the host element's content overflows its (line-clamped) box.
 *
 * Bind the clamp-active state to the directive via its selector input: it only
 * measures while the clamp is applied, because an expanded (un-clamped) element
 * never overflows and would otherwise report `false` and wrongly clear a cached
 * "is collapsible" flag on the consumer.
 *
 * Emits the overflow state via `(truncated)` whenever it changes — an initial
 * measurement once observation starts, then on every resize of the host.
 */
@Directive({
  selector: '[appTruncationObserver]',
  standalone: true,
})
export class TruncationObserverDirective implements OnDestroy {
  /** Whether the clamp is currently applied. Measurement only runs while `true`. */
  readonly active = input(true, { alias: 'appTruncationObserver' });

  /** Fires when the overflow (truncated) state changes. */
  readonly truncated = output<boolean>();

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly resizeObserver = new ResizeObserver(() => this.measure());
  private lastEmitted: boolean | undefined;

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
    if (isTruncated !== this.lastEmitted) {
      this.lastEmitted = isTruncated;
      this.truncated.emit(isTruncated);
    }
  }
}
