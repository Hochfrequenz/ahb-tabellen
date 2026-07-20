# Umami Analytics (Trial) — Design

## Goal

Trial [Umami](https://umami.is/) (Umami Cloud) pageview tracking on the AHB-Tabellen web app to
measure usage, without polluting local/dev/prod traffic and without adding a consent flow yet.

## Scope

- Stage environment only (`ahb-tabellen.stage.hochfrequenz.de`). Not enabled on prod, local, or
  docker builds for now.
- Pageview tracking only. No custom events, no opt-out toggle, no consent banner.

## Design

Follows the existing per-environment config pattern (`src/app/environments/*.ts`, swapped via
Angular's `fileReplacements` in `angular.json`) rather than a static `<script>` tag in
`index.html`, so tracking is automatic per build and never needs hand-editing before a deploy.

1. Add an optional `umamiWebsiteId?: string` field to `EnvironmentInterface`
   (`src/app/environments/environment.interface.ts`), mirroring the existing optional
   `warmupUrl`.
2. Set it in `environment.stage.ts` to `9e0ba0a6-ad4f-457d-9a23-4afaa23c7500`. Leave it
   `undefined` in `environment.ts` (local), `environment.prod.ts`, and `environment.docker.ts`.
3. In `AppComponent.ngOnInit`, if `environment.umamiWebsiteId` is set, append
   `<script defer src="https://cloud.umami.is/script.js" data-website-id="...">` to
   `document.head` via plain DOM APIs (no SSR in this app, so `Renderer2` isn't needed).

## Out of scope / follow-up

- **DSGVO consent dialog**: before enabling tracking on production, we need a consent
  mechanism (Hochfrequenz is a German company and must comply with DSGVO). Umami's script is
  cookie-free by design, which simplifies this, but legal/consent requirements still need to be
  worked out before flipping this on for prod traffic. Tracked as a prerequisite for extending
  beyond the stage trial.
