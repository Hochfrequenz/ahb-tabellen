import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

// jsdom does not implement ResizeObserver; provide a no-op default so components
// that rely on it (e.g. the conditions-column truncation observer) can render in
// tests. Specs that need to drive measurements install their own capturing mock.
class ResizeObserverMock {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
