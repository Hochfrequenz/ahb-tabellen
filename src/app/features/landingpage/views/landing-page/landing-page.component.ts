import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthFacade } from '../../../../core/auth/auth.facade';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { environment } from '../../../../environments/environment';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [FooterComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent implements OnInit {
  private facade = inject(AuthFacade);
  private router = inject(Router);
  private meta = inject(Meta);
  private readonly title = inject(Title);

  ngOnInit() {
    const baseUrl = environment.baseUrl;

    this.title.setTitle('AHB-Tabellen - Anwendungshandbücher für Menschen');
    this.meta.addTags([
      {
        name: 'description',
        content:
          'AHB-Tabellen ist ein intuitives Tool, das die Navigation in Anwendungshandbüchern vereinfacht, indem es die Daten pro Prüfidentifikator klar darstellt.',
      },
      {
        name: 'keywords',
        content: 'AHB, Anwendungshandbuch, Energie, Hochfrequenz, Tabellen, Prüfidentifikator',
      },
      { property: 'og:title', content: 'AHB-Tabellen - Anwendungshandbücher für Menschen' },
      {
        property: 'og:description',
        content:
          'AHB-Tabellen ist ein intuitives Tool, das die Navigation in Anwendungshandbüchern vereinfacht, indem es die Daten pro Prüfidentifikator klar darstellt.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: baseUrl },
      { property: 'og:image', content: `${baseUrl}/assets/logo.png` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:site_name', content: 'AHB-Tabellen' },
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:title', content: 'AHB-Tabellen - Anwendungshandbücher für Menschen' },
      {
        property: 'twitter:description',
        content:
          'AHB-Tabellen ist ein intuitives Tool, das die Navigation in Anwendungshandbüchern vereinfacht, indem es die Daten pro Prüfidentifikator klar darstellt.',
      },
      { property: 'twitter:image', content: `${baseUrl}/assets/logo.png` },
      { property: 'linkedin:title', content: 'AHB-Tabellen - Anwendungshandbücher für Menschen' },
      {
        property: 'linkedin:description',
        content:
          'AHB-Tabellen ist ein intuitives Tool, das die Navigation in Anwendungshandbüchern vereinfacht, indem es die Daten pro Prüfidentifikator klar darstellt.',
      },
      { property: 'linkedin:image', content: `${baseUrl}/assets/logo.png` },
      {
        name: 'robots',
        content: environment.allowSearchIndexing ? 'index, follow' : 'noindex, nofollow',
      },
      { name: 'author', content: 'Hochfrequenz' },
    ]);
  }

  onOpenClick() {
    // Route through the facade so the dev stub and both providers are handled uniformly. When not
    // signed in, send the user to the provider chooser (not straight to Auth0), preserving the
    // intended target.
    this.facade.isAuthenticated$.pipe(take(1)).subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigate(['/features']);
      } else {
        this.router.navigate(['/login'], { queryParams: { target: '/features' } });
      }
    });
  }
}
