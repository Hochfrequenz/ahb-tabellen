import { LandingPageComponent } from './landing-page.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { Meta } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

describe('LandingPageComponent', () => {
  let mockMeta: { addTags: jest.Mock };

  beforeEach(() => {
    mockMeta = { addTags: jest.fn() };

    return MockBuilder(LandingPageComponent).provide({
      provide: Meta,
      useValue: mockMeta,
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
