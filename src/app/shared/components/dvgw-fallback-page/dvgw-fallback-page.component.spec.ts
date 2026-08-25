import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DvgwFallbackPageComponent } from './dvgw-fallback-page.component';

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

  it('should link a TSIMSG Prüfidentifikator to the TSIMSG document', () => {
    fixture.componentRef.setInput('pruefi', '44097');
    fixture.detectChanges();

    const link = (fixture.nativeElement as HTMLElement).querySelector('a');
    expect(link?.getAttribute('href')).toContain('TSIMSG_5.11');
    expect(link?.textContent).toContain('TSIMSG 5.11');
  });

  it('should link an SSQNOT Prüfidentifikator to the (updated) SSQNOT document', () => {
    fixture.componentRef.setInput('pruefi', '70095');
    fixture.detectChanges();

    const link = (fixture.nativeElement as HTMLElement).querySelector('a');
    expect(link?.getAttribute('href')).toContain('SSQNOT_5.7_Stand_2021-10-31');
    expect(link?.textContent).toContain('SSQNOT 5.7');
  });
});
