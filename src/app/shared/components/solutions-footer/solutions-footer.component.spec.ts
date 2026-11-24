import { ComponentFixture, TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { environment as productionEnvironment } from '../../../environments/environment.prod';

import { SolutionsFooterComponent } from './solutions-footer.component';

describe('SolutionsFooterComponent', () => {
  let component: SolutionsFooterComponent;
  let fixture: ComponentFixture<SolutionsFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolutionsFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SolutionsFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders all five solution links with their expected hrefs', () => {
    const links = fixture.nativeElement.querySelectorAll('#solutions a');

    expect(
      Array.from(links, link => [
        (link as HTMLAnchorElement).textContent?.trim(),
        (link as HTMLAnchorElement).getAttribute('href'),
      ])
    ).toEqual([
      ['AHB-Tabellen', environment.apiUrl],
      ['Fristenkalender', environment.fristenkalenderBaseUrl],
      ['Bedingungsbaum', environment.bedingungsbaumBaseUrl],
      ['Entscheidungsbaumdiagramm', environment.ebdBaseUrl],
      ['MaKo-Prozesse', environment.makoProzesseBaseUrl],
    ]);
  });

  // The test above resolves `environment` to environment.ts (the dev file), so the literal
  // that ships in the production bundle is pinned here. Both use the same URL, see the
  // comments in the environment files.
  it('pins the MaKo-Prozesse URL of the dev and production environments', () => {
    expect(environment.makoProzesseBaseUrl).toBe('https://mako-prozesse.hochfrequenz.app');
    expect(productionEnvironment.makoProzesseBaseUrl).toBe(
      'https://mako-prozesse.hochfrequenz.app'
    );
  });
});
