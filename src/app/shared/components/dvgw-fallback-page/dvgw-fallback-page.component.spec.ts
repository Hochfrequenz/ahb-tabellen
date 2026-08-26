import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DvgwFallbackPageComponent } from './dvgw-fallback-page.component';
import { DVGW_ARCHIVE_URL } from '../../utils/dvgw-pruefi.utils';

describe('DvgwFallbackPageComponent', () => {
  let component: DvgwFallbackPageComponent;
  let fixture: ComponentFixture<DvgwFallbackPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DvgwFallbackPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DvgwFallbackPageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('pruefi', '44096');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build a message referencing the concrete Prüfidentifikator', () => {
    expect(component.message()).toBe(
      'Der Prüfidentifikator 44096 wird von der DVGW ausschließlich als PDF-Dokument veröffentlicht. ' +
        'Uns stehen zur Zeit nur die Dokumente des BDEW in maschinenlesbarer Form bereit.'
    );
  });

  it('should render the message in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(component.message());
  });

  it('should have the correct title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h2');
    expect(title?.textContent).toContain('DVGW Prüfidentifikatoren');
  });

  it('should have the correct CSS classes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('.bg-hf-grell-rose');
    expect(container).toBeTruthy();
  });

  it('should link to the DVGW archive and name the TSIMSG Nachrichtentyp', () => {
    fixture.componentRef.setInput('pruefi', '44097');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a');
    expect(link?.getAttribute('href')).toBe(DVGW_ARCHIVE_URL);
    expect(link?.textContent).toContain('DVGW-Dokumentenarchiv');
    expect(compiled.textContent).toContain('TSIMSG');
  });

  it('should link to the DVGW archive and name the SSQNOT Nachrichtentyp', () => {
    fixture.componentRef.setInput('pruefi', '70095');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a');
    expect(link?.getAttribute('href')).toBe(DVGW_ARCHIVE_URL);
    expect(link?.textContent).toContain('DVGW-Dokumentenarchiv');
    expect(compiled.textContent).toContain('SSQNOT');
  });
});
