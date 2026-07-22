import { LandingPageComponent } from './landing-page.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { Meta } from '@angular/platform-browser';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';

describe('LandingPageComponent', () => {
  let mockMeta: { addTags: jest.Mock };

  beforeEach(() => {
    mockMeta = { addTags: jest.fn() };

    return MockBuilder(LandingPageComponent)
      .provide({
        provide: Meta,
        useValue: mockMeta,
      })
      .provide({
        // Provided explicitly rather than relying on ng-mocks' auto-mock: as of ng-mocks
        // 14.15.3, auto-mocking AuthService still triggers its real factory chain (including
        // the auth0.client InjectionToken) under Angular 22, throwing NG0201.
        provide: AuthService,
        useValue: { isAuthenticated$: of(false), loginWithRedirect: jest.fn() },
      });
  });

  it('should render', () => {
    const fixture = MockRender(LandingPageComponent);
    expect(ngMocks.formatHtml(fixture)).toContain('Anwendungshandbücher für Menschen');
  });

  it('should set robots meta tag to noindex, nofollow when allowSearchIndexing is false', () => {
    const original = environment.allowSearchIndexing;
    environment.allowSearchIndexing = false;
    try {
      MockRender(LandingPageComponent);
      expect(mockMeta.addTags).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ name: 'robots', content: 'noindex, nofollow' }),
        ])
      );
    } finally {
      environment.allowSearchIndexing = original;
    }
  });

  it('should set robots meta tag to index, follow when allowSearchIndexing is true', () => {
    const original = environment.allowSearchIndexing;
    environment.allowSearchIndexing = true;
    try {
      MockRender(LandingPageComponent);
      expect(mockMeta.addTags).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ name: 'robots', content: 'index, follow' }),
        ])
      );
    } finally {
      environment.allowSearchIndexing = original;
    }
  });
});
