import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FallbackPageComponent } from './fallback-page.component';

describe('FallbackPageComponent', () => {
  let component: FallbackPageComponent;
  let fixture: ComponentFixture<FallbackPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FallbackPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FallbackPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should guide users to the impressum contact details', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Kontaktdaten im Impressum');
    expect(compiled.textContent).not.toContain('Kontaktformular im Footer');
  });
});
