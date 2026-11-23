import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { map, startWith } from 'rxjs/operators';
import { AuthFacade, AuthProviderId } from '../../../../core/auth/auth.facade';
import { safeInternalTarget } from '../../../../core/auth/safe-target';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { environment } from '../../../../environments/environment';
import { Meta, Title } from '@angular/platform-browser';

/** What the call-to-action area may safely offer, given what is known about the session so far. */
export type CtaState = 'pending' | 'authenticated' | 'anonymous';

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

  /**
   * `isAuthenticated$` emits nothing while Auth0's session check is in flight, so 'pending' is an
   * explicit third state rather than something the template infers from a null async value.
   *
   * Sign-in is a one-way door: it commits the user to one identity provider. Offering it before
   * we know who they are would let a Hochfrequenz employee be sent into Auth0, where they have no
   * account — the exact outcome the design record rejects. So no CTA acts until this resolves.
   */
  readonly ctaState$ = this.facade.isAuthenticated$.pipe(
    map((isAuthenticated): CtaState => (isAuthenticated ? 'authenticated' : 'anonymous')),
    startWith('pending' as CtaState)
  );

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
   * Only reachable from the 'anonymous' branch, so the session is known and this can act directly —
   * no deferred subscription to leak, and no queue of clicks to fire at once when it resolves.
   */
  signIn(provider: AuthProviderId): void {
    this.facade.login(provider, this.resolveTarget());
  }

  /** Already signed in — the CTA is a plain navigation, not a login. */
  open(): void {
    const target = this.resolveTarget();
    void this.router.navigateByUrl(target).catch(() => {
      // A target can be rooted and same-origin yet still match no route. Failing silently would
      // leave the page's only call to action doing nothing at all.
      if (target === '/features') {
        return;
      }
      void this.router.navigateByUrl('/features').catch(() => {
        // The fallback is itself a lazy route, so it can fail too (offline, stale chunk). Swallow
        // it rather than raising an unhandled rejection the user cannot act on.
      });
    });
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
