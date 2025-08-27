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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct DVGW message', () => {
    const expectedMessage =
      'Die Prüfidentifikatoren 70095 und 70096 werden von in einem PDF Dokument der DVGW veröffentlicht. Uns stehen zur Zeit nur die Dokumente des BDEW in maschinenlesbarer Form bereit.';
    expect(component.message).toBe(expectedMessage);
  });

  it('should render the message in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(component.message);
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
});
