import { HeaderComponent } from './header.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('HeaderComponent', () => {
  beforeEach(() => MockBuilder(HeaderComponent).provide(provideNoopAnimations()));

  it('should render', () => {
    const fixture = MockRender(HeaderComponent);
    const html = ngMocks.formatHtml(fixture);
    expect(html).toContain('app-icon-logo');
  });
});
