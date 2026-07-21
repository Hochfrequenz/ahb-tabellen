# Prüfi-Übersicht: Filter nach Marktrolle

## Problem

In der AHB-Vergleich-Landingpage (`comparison-landing-page`) werden Prüfidentifikatoren
in der `pruefi-overview`-Komponente nach Format gruppiert (COMDIS, MSCONS, UTILMD, ...)
und lassen sich bereits nach Status filtern (neu / entfernt / geändert / unverändert).
Nutzer möchten die Liste zusätzlich nach Marktrolle filtern können (Lieferant,
Netzbetreiber, Messstellenbetreiber (MSB), ...), um z. B. nur die für ihre eigene Rolle
relevanten Prüfis zu sehen.

Es gibt noch kein "Marktrolle"-Feld auf Prüfi-Ebene. Es existiert aber bereits das
Konzept der Kommunikationsrichtung (`Kommunikationsrichtung = { sender, empfaenger }`)
auf AHB-Zeilen-Ebene (`AhbLine.direction`), das in der Search-Feature bereits als
Sender-/Empfänger-Filter verwendet wird (`RichtungCacheService`,
`GET /api/direction-values`). Die Rollen-Werte darin sind Rohcodes wie `LF`, `LFA`,
`LFN`, `NB`, `MSB`, `MSBA`, `MSBN`, `ESA`.

## Entscheidung

"Marktrolle" = dieselben Sender-/Empfänger-Codes, aggregiert auf Prüfi-Ebene und zu
Basis-Rollen gruppiert (z. B. `LF`, `LFA`, `LFN` → "Lieferant"). Ein Prüfi passt zu einer
gewählten Rolle, wenn die Rolle irgendwo als Sender **oder** Empfänger in diesem Prüfi
vorkommt. Mehrere ausgewählte Rollen werden mit ODER verknüpft.

## Backend

`GET /api/pruefidentifikatoren/{format-version}` (`getPruefis`) bekommt ein neues,
additives Feld `roles: string[]` (Rohcodes, z. B. `["LF", "NB"]`) pro Prüfi.

`FormatVersionRepository.listPruefisByFormatVersion`
(`src/server/repository/formatVersion.ts:36`) führt zusätzlich eine Query im Stil von
`RichtungRepository.getDistinctValues` (`src/server/repository/richtung.ts:20-32`) aus,
aber gruppiert nach `pruefidentifikator`:

```sql
SELECT DISTINCT pruefidentifikator,
  json_extract(je.value, '$.sender') as sender,
  json_extract(je.value, '$.empfaenger') as empfaenger
FROM v_ahbtabellen, json_each(v_ahbtabellen.direction) as je
WHERE format_version = :formatVersion AND direction IS NOT NULL
```

Die Ergebniszeilen werden serverseitig nach `pruefidentifikator` gruppiert; Sender- und
Empfänger-Werte werden je Prüfi in einem `Set<string>` vereinigt und als `roles` in die
bestehende `PruefiWithName`-Liste gemischt. Eine zusätzliche Query, kein N+1, kein neuer
Netzwerk-Roundtrip auf Client-Seite.

`openapi.yml` (Schema um `getPruefis`, aktuell Zeilen 240-249) bekommt das neue optionale
`roles`-Array. Additive Änderung, rückwärtskompatibel. Angular-Client-Typen werden
neu generiert (`ng-openapi-gen`).

## Frontend

### Rollen-Mapping (`src/app/shared/utils/role-mapping.utils.ts`, neu)

Analog zu `pruefi-format.utils.ts`:

```ts
export const ROLE_GROUPS: Record<string, { label: string; codes: string[] }> = {
  LF: { label: 'Lieferant', codes: ['LF', 'LFA', 'LFN'] },
  NB: { label: 'Netzbetreiber', codes: ['NB'] },
  MSB: { label: 'Messstellenbetreiber', codes: ['MSB', 'MSBA', 'MSBN'] },
  ESA: { label: 'Energieserviceanbieter', codes: ['ESA'] },
};

export function getBaseRoleKey(code: string): string | null;
export function getRolesForPruefi(codes: string[]): string[]; // distinct base-role keys
export function getAllRoleKeys(): string[];
```

Codes, die keiner Gruppe zugeordnet werden können, liefern `null` bei
`getBaseRoleKey` und werden beim Rollen-Filtern stillschweigend ignoriert (kein
"Andere"-Chip). Das entspricht dem bestehenden Fallback-Verhalten von
`getFormatFromPruefi` (`'Unbekannt'`-Gruppe), nur ohne eigene Sammel-Kategorie.

### `pruefi-overview.component.ts`

- `PruefiComparison` bekommt `roles: string[]` (Rohcodes aus der API, unverändert
  übernommen in `processComparison()`).
- Neue, aus `getAllRoleKeys()` **dynamisch** aufgebaute Toggle-Signale (ein
  `WritableSignal<boolean>`, Default `true`), analog zu den bestehenden
  `filterToggles: FilterToggle[]` (`pruefi-overview.component.ts:83-115`) — im
  Unterschied zu Status/Format sind Rollen datengetrieben, nicht hartkodiert.
- `filteredPruefisCache` bekommt einen zusätzlichen Filterschritt: ein Prüfi ist
  sichtbar, wenn `getRolesForPruefi(pruefi.roles)` mindestens eine aktuell aktivierte
  Rolle enthält (ODER-Verknüpfung über ausgewählte Rollen).
- Prüfis mit `roles: []` (keine Richtungsdaten) werden unabhängig vom Rollenfilter
  immer angezeigt — gleiche "permissive default"-Philosophie wie bei fehlenden
  Diff-Summary-Daten in `filteredPruefisCache`.

### Template

Rollen-Pills werden in derselben Zeile wie die bestehenden Status-Toggles
(`pruefi-overview.component.html:19-36`) gerendert, gleiches Button-Styling, aber mit
Rollen-Label statt `+/−/~/=`-Symbol.

## Tests

- `formatVersion.spec.ts`: `roles` wird korrekt aus mehrzeiligem `json_each`-Output pro
  Prüfi aggregiert und dedupliziert (inkl. Prüfi mit unterschiedlichen
  Richtungs-Paaren über mehrere Zeilen).
- `role-mapping.utils.spec.ts` (neu): Code-zu-Gruppe-Mapping inkl. unbekannter Codes
  (`null`).
- `pruefi-overview.component.spec.ts`: Rollen-Toggle filtert sichtbare Liste, mehrere
  aktive Rollen = ODER, Prüfi mit ausschließlich unbekannten Codes bleibt bei jeder
  Rollen-Kombination sichtbar.

## Out of scope

- `ahb-diff-summary` und die Einzel-Prüfi-Vergleichsseite bleiben unverändert — der
  Filter betrifft nur die Übersichtsliste der Landingpage.
- Keine Persistierung der Filterauswahl (Query-Params o. ä.) — analog zum bestehenden
  Status-Filter, der ebenfalls nicht persistiert wird.
