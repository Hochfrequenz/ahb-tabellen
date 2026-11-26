import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MigElementDetailsComponent } from './mig-element-details.component';
import { AhbMigLink, AhbMigLinks } from '../../../../core/api';

const mig: AhbMigLinks['mig'] = {
  formatVersion: 'FV2610',
  format: 'UTILMD',
  versionsnummer: 'S2.2',
  gueltigVon: null,
  gueltigBis: null,
};

const link: AhbMigLink = {
  guid: 'g',
  node: '6-0-1',
  exact: false,
  element: {
    type: 'dataelement',
    key: 'D_1153',
    name: 'Referenz, Qualifier',
    statusStd: 'M',
    statusSpecification: 'R',
    formatSpecification: 'an..3',
  },
};

describe('MigElementDetailsComponent', () => {
  it('shows the BDEW facts and links to the element in the MIG view', () => {
    TestBed.configureTestingModule({
      imports: [MigElementDetailsComponent],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(MigElementDetailsComponent);
    fixture.componentRef.setInput('link', link);
    fixture.componentRef.setInput('mig', mig);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const text = (root.textContent ?? '').replace(/\s+/g, ' ');
    expect(text).toContain('MIG UTILMD S2.2 · Datenelement');
    expect(text).toContain('R · Erforderlich');
    expect(text).toContain('an..3');
    expect(text).toContain('Qualifier-Variante');
    expect(root.querySelector('a')?.getAttribute('href')).toBe(
      '/mig/FV2610/UTILMD?version=S2.2&node=6-0-1'
    );
  });
});
