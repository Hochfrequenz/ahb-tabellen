import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFacade, AuthProviderId } from '../../../../core/auth/auth.facade';
import { safeInternalTarget } from '../../../../core/auth/safe-target';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { environment } from '../../../../environments/environment';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent implements OnInit {
  private facade = inject(AuthFacade);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private meta = inject(Meta);
  private readonly title = inject(Title);

  /** Drives the CTA: signed-in visitors get a plain "open the app" button, not a provider choice. */
  readonly isAuthenticated$ = this.facade.isAuthenticated$;

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

  /**
   * Start a sign-in. Both CTAs land here; they differ only in which provider they name, so the
   * page never has to know anything about Auth0 or MSAL beyond the provider id.
   */
  signIn(provider: AuthProviderId): void {
    this.facade.login(provider, this.resolveTarget());
  }

  /** Already signed in — the CTA is a plain navigation, not a login. */
  open(): void {
    void this.router.navigateByUrl(this.resolveTarget());
  }

  /**
   * Where to send the user afterwards: the `?target=` the AuthGuard attached when it bounced them
   * here from a protected deep link, else the feature picker. Sanitized because the param is
   * user-supplied; `/` means "nothing specific was asked for".
   */
  private resolveTarget(): string {
    const safe = safeInternalTarget(this.route.snapshot.queryParamMap.get('target'));
    return safe === '/' ? '/features' : safe;
  }
}
