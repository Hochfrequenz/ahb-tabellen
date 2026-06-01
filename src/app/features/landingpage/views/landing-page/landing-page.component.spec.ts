import { LandingPageComponent } from './landing-page.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { Meta } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

describe('LandingPageComponent', () => {
  beforeEach(() => MockBuilder(LandingPageComponent));

  it('should render', () => {
    const fixture = MockRender(LandingPageComponent);
    expect(ngMocks.formatHtml(fixture)).toContain('Anwendungshandbücher für Menschen');
  });

  it('should set robots meta tag to noindex, nofollow for non-prod environments', () => {
    const original = environment.allowSearchIndexing;
    (environment as any).allowSearchIndexing = false;
    try {
      MockRender(LandingPageComponent);
      const meta = ngMocks.findInstance(Meta);
      expect(meta.addTags).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ name: 'robots', content: 'noindex, nofollow' })])
      );
    } finally {
      (environment as any).allowSearchIndexing = original;
    }
  });

  it('should set robots meta tag to index, follow for prod environments', () => {
    const original = environment.allowSearchIndexing;
    (environment as any).allowSearchIndexing = true;
    try {
      MockRender(LandingPageComponent);
      const meta = ngMocks.findInstance(Meta);
      expect(meta.addTags).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ name: 'robots', content: 'index, follow' })])
      );
    } finally {
      (environment as any).allowSearchIndexing = original;
    }
  });
});
