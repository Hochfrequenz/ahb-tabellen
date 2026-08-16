import { ComponentFixture, TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { environment as dockerEnvironment } from '../../../environments/environment.docker';
import { environment as productionEnvironment } from '../../../environments/environment.prod';
import { environment as stageEnvironment } from '../../../environments/environment.stage';

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

  it('renders all six solution links with their expected hrefs', () => {
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
      ['Dolmetscher', environment.dolmetscherBaseUrl],
    ]);
  });

  // The test above resolves `environment` to environment.ts (the dev file), so the literals
  // that actually ship are pinned here. All environments intentionally use the same URL,
  // see the comments in the environment files.
  it('pins the MaKo-Prozesse URL of every built environment', () => {
    expect(productionEnvironment.makoProzesseBaseUrl).toBe('https://mako-prozesse.hochfrequenz.de');
    expect(stageEnvironment.makoProzesseBaseUrl).toBe('https://mako-prozesse.hochfrequenz.de');
    expect(dockerEnvironment.makoProzesseBaseUrl).toBe('https://mako-prozesse.hochfrequenz.de');
  });

  // The Dolmetscher is live in production; its *.stage host exists but serves an invalid
  // TLS certificate, so every environment points at the same production URL -- pinned here
  // for the same reason as above.
  it('pins the Dolmetscher URL of every built environment', () => {
    expect(productionEnvironment.dolmetscherBaseUrl).toBe('https://dolmetscher.hochfrequenz.de');
    expect(stageEnvironment.dolmetscherBaseUrl).toBe('https://dolmetscher.hochfrequenz.de');
    expect(dockerEnvironment.dolmetscherBaseUrl).toBe('https://dolmetscher.hochfrequenz.de');
  });
});
