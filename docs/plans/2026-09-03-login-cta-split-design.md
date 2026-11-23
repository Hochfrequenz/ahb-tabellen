# Split the landing-page CTA into two labelled sign-in paths, retire `/login`

Date: 2026-09-03
Related: #951 (Entra dual-issuer), #952 (backend), #953 (frontend MSAL + `/login` chooser)

## Context

The landing page (`/`) has one CTA, **"Jetzt öffnen"**, which routes to a separate
`/login` page. That page then asks the user to pick between **"Mit Microsoft anmelden"**
and **"Anmelden (Auth0)"**.

Two problems:

1. **An interstitial with no content of its own.** `/login` exists only to ask a
   question. Every user pays a full page load and a second click for a decision that
   could have been offered on the button they already clicked.
2. **The question is unanswerable as phrased.** "Anmelden (Auth0)" names the vendor,
   not the audience. Nothing on the buttons tells an external user that Auth0 is
   _their_ option — the explanatory sentence above them is doing work the buttons
   themselves should do.

The `/login` chooser was introduced in #953 as the minimum viable shape for the
dual-issuer work in #951 (Entra ID alongside Auth0 — Hochfrequenz employees on
Microsoft, everyone else on Auth0). It always was a placeholder.

**Outcome:** the landing page offers both sign-in paths directly, each labelled by
_who it is for_ rather than _which vendor runs it_. `/login` is retired. The header
login control adopts the same vocabulary and stops discarding the user's destination.

## Design

### Copy and hierarchy

External market participants are the majority audience; Hochfrequenz employees are a
minority. So: **one primary action, one recessive one** — not two peers. Two equal
buttons force every visitor to classify themselves before they can proceed, which is
the failure mode the current `/login` page already has.

```
┌─────────────────────────────────────────┐
│                                         │
│       ┌─────────────────────────┐       │
│       │  ⇥   Jetzt öffnen       │       │   filled dark pill
│       └─────────────────────────┘       │
│                                         │
│       ■□  Mit Microsoft anmelden        │   ghost button + MS mark
│       □■  Für Hochfrequenz-             │   helper line, xs, 60% opacity
│           Mitarbeitende                 │
│                                         │
└─────────────────────────────────────────┘
```

- Primary keeps **"Jetzt öffnen"** — the existing, known label, and it describes the
  outcome the user wants rather than the mechanism. Auth0 is never named: external
  users have no idea what Auth0 is and do not need to.
- Secondary reads **"Mit Microsoft anmelden"** with the helper line
  **"Für Hochfrequenz-Mitarbeitende"**. The helper sits _outside_ the `<button>` and
  is bound via `aria-describedby`, so the accessible name stays the crisp action phrase.
- Keep the page's informal **"du"** register. (The `/login` page used formal "Sie" —
  that inconsistency disappears with the page.)

### Visual weight

Today's CTA is `bg-hf-grell-rose` (#ebbec1) sitting on the `bg-hf-pastell-rose`
(#f4e0e1) card — a ~1.25:1 surface boundary, below the 3:1 WCAG 1.4.11 asks of a
control boundary. That was survivable with one button; with two it is not, since
relative weight is now carrying meaning.

**Make the primary `bg-hf-weiches-schwarz text-white`** — a token already established
for pills elsewhere in the app — and let the secondary be a bare ghost button (no fill,
underline on hover). The dark pill now means "the main way in" rather than "the
Microsoft one", and the recessive treatment matches Microsoft's minority audience.

_Fallback if the rose CTA must stay:_ keep `bg-hf-grell-rose` on the primary and add
`ring-1 ring-hf-weiches-schwarz/20` for a legible boundary. Do not ship two filled pills.

### Where unauthenticated deep-links land

`AuthGuard` currently sends them to `/login?target=<url>`. It will send them to `/`
instead, carrying the same `?target=`. Both landing CTAs read that param, so deep-link
restore keeps working through Auth0 `appState` and the MSAL sessionStorage stash.

`/login` stays in the routes table as a bare `redirectTo: ''` so existing bookmarks and
stale links do not 404.

### Move the target plumbing into the facade

`login.component.ts` today owns the "stash the target in sessionStorage for MSAL, clear
it for Auth0" logic. Deleting that component would mean copying that logic into _two_
new call sites (landing page, header button) — where they can drift apart, and where
the header would keep the bug it has now.

**Push it into `AuthFacade.login(provider, target?)` instead.** It already takes the
target; the per-provider plumbing belongs behind that seam, not in front of it. Callers
then just say who they are and where they were going. Sanitizing inside the facade also
makes the open-redirect guard unbypassable regardless of what a caller passes.

## Decisions taken

| Question                                 | Decision                                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------------------- |
| Guard destination after `/login` removal | Landing page `/` with `?target=`; `/login` kept as a redirect for bookmarks           |
| CTA weighting                            | Primary filled pill + recessive secondary, not two peers                              |
| Header `<app-login-button>`              | Same vocabulary, and pass `router.url` as target (fixes existing loss of destination) |
| Microsoft icon                           | Add the official four-square mark as a local SVG asset                                |

## Rejected

- **Two equal-weight buttons** — makes the user classify themselves, the exact problem
  being fixed.
- **Guard signs in with Auth0 directly** — a Hochfrequenz employee following a deep link
  would land in the wrong IdP with no way to pick Microsoft.
- **Remembering / auto-selecting the last-used provider** — `ahb.activeAuthProvider`
  exists only as a tie-breaker today; auto-selection is a separate call. YAGNI.
- **Email-domain-based IdP routing** — needs an email prompt before the redirect, which
  is more friction than the button it replaces.

## Scope

In: landing page CTA, `/login` removal, `AuthFacade.login()` target plumbing, `AuthGuard`
redirect, header login button, Microsoft icon asset, tests.

Out: backend / `src/server/mcp/auth.ts` (dual-issuer done in #952), provider memory,
domain-based routing, extracting a shared button component.

Implementation detail, acceptance criteria and the test matrix live in [issue #960](https://github.com/Hochfrequenz/ahb-tabellen/issues/960).
