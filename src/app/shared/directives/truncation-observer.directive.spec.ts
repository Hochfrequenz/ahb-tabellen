import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TruncationObserverDirective } from './truncation-observer.directive';

/** ResizeObserver mock that records instances and lets tests fire the callback. */
class CapturingResizeObserver {
  static instances: CapturingResizeObserver[] = [];
  readonly observed: Element[] = [];
  disconnected = false;

  constructor(private readonly callback: ResizeObserverCallback) {
    CapturingResizeObserver.instances.push(this);
  }

  observe(target: Element): void {
    this.observed.push(target);
  }

  unobserve(): void {}

  disconnect(): void {
    this.disconnected = true;
  }

  trigger(): void {
    this.callback([], this as unknown as ResizeObserver);
  }
}

@Component({
  standalone: true,
  imports: [TruncationObserverDirective],
  template: `<div [appTruncationObserver]="active" (truncated)="onTruncated($event)">content</div>`,
})
class HostComponent {
  active = true;
  events: boolean[] = [];
  onTruncated(value: boolean): void {
    this.events.push(value);
  }
}

function setSize(element: HTMLElement, scrollHeight: number, clientHeight: number): void {
  Object.defineProperty(element, 'scrollHeight', { value: scrollHeight, configurable: true });
  Object.defineProperty(element, 'clientHeight', { value: clientHeight, configurable: true });
}

describe('TruncationObserverDirective', () => {
  let originalResizeObserver: typeof ResizeObserver;
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let div: HTMLElement;

  beforeEach(() => {
    originalResizeObserver = globalThis.ResizeObserver;
    CapturingResizeObserver.instances = [];
    globalThis.ResizeObserver = CapturingResizeObserver as unknown as typeof ResizeObserver;

    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
  });

  afterEach(() => {
    globalThis.ResizeObserver = originalResizeObserver;
  });

  function observer(): CapturingResizeObserver {
    return CapturingResizeObserver.instances[0];
  }

  /** First change detection wires the input binding; returns the observed element. */
  function render(): HTMLElement {
    fixture.detectChanges();
    div = fixture.nativeElement.querySelector('div');
    return div;
  }

  it('observes the host element', () => {
    render();
    expect(observer().observed).toContain(div);
  });

  it('emits true when the clamped content overflows', () => {
    render();
    setSize(div, 120, 80);
    observer().trigger();
    expect(host.events).toEqual([true]);
  });

  it('emits false when the content fits', () => {
    render();
    setSize(div, 80, 80);
    observer().trigger();
    expect(host.events).toEqual([false]);
  });

  it('does not emit again for an unchanged state', () => {
    render();
    setSize(div, 120, 80);
    observer().trigger();
    observer().trigger();
    expect(host.events).toEqual([true]);
  });

  it('does not measure while inactive (clamp removed)', () => {
    host.active = false;
    render();
    setSize(div, 120, 80);
    observer().trigger();
    expect(host.events).toEqual([]);
  });

  it('disconnects the observer on destroy', () => {
    render();
    fixture.destroy();
    expect(observer().disconnected).toBe(true);
  });
});
