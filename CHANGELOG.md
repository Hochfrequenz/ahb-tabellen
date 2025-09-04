# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

### Bug Fixes

- *(url-encoding)* Refactor updateURL to simplify query parameter handling (#651)


### Build

- *(deps)* Bump actions/attest-build-provenance from 2 to 3 (#653)
- *(deps)* Bump node from 24.6-alpine to 24.7-alpine (#654)


## 1.3.0-rc00 - 2025-08-27

### Features

- *(dvgw-fallback)* Add DVGW Fallback Component (#649)


### Styling

- *(responsive-ui)* Make AHB Tabellen Responsive (#647)
- *(responsive-ui)* Make Landingpage and AHB Landingpage Responsive (#648)


## 1.2.1 - 2025-08-18

### Bug Fixes

- *(pruefi format mapping)* Corrects UTILMD values in pruefi mapping (#638)


### Build

- *(deps)* Bump docker/metadata-action from 5.7.0 to 5.8.0 (#636)
- *(deps)* Bump node from 24.4-alpine to 24.5-alpine (#641)
- *(deps)* Bump docker/login-action from 3.4.0 to 3.5.0 (#642)
- *(deps)* Bump actions/checkout from 4 to 5 (#644)
- *(deps)* Bump node from 24.5-alpine to 24.6-alpine (#645)


## 1.2.0 - 2025-08-01

### Features

- *(add versionsnummer and veroeffentlichungsdatum)* Adds versionsnummer and veroeffentlichungsdatum to the AHB metadata. (#634)


## 1.1.2 - 2025-07-21

### Bug Fixes

- *(No Category)* Remove old db, no more hoarding (#631)


## 1.1.0 - 2025-07-21

### Features

- *(No Category)* Is this the way to update? No it says it comes from fundamend, but how? (#630)


### Build

- *(deps)* Bump the angular group with 16 updates (#603)
- *(deps)* Bump zone.js from 0.15.0 to 0.15.1 (#609)
- *(deps)* Bump node from 24.0-alpine to 24.1-alpine (#611)
- *(deps)* Bump docker/build-push-action from 6.17.0 to 6.18.0 (#612)
- *(deps)* Bump typeorm from 0.3.23 to 0.3.24 (#616)
- *(deps)* Bump node from 24.1-alpine to 24.2-alpine (#620)
- *(deps)* Bump node from 24.2-alpine to 24.3-alpine (#625)
- *(deps)* Bump node from 24.3-alpine to 24.4-alpine (#629)
- *(deps-dev)* Bump ng-mocks from 14.13.4 to 14.13.5 (#604)
- *(deps-dev)* Bump eslint from 9.26.0 to 9.27.0 (#605)
- *(deps-dev)* Bump @typescript-eslint/parser from 8.32.1 to 8.33.0 (#610)
- *(deps-dev)* Bump postcss from 8.5.3 to 8.5.4 (#615)


## 1.0.1 - 2025-05-22

### Bug Fixes

- *(No Category)* Use correct query param name for EBD deeplink (#600)


### Miscellaneous Tasks

- *(No Category)* Remove "versuchen Sie es erneut" from error message (#583)


### Build

- *(deps)* Bump node from 23.11-alpine to 24.0-alpine (#585)
- *(deps)* Bump the angular group with 16 updates (#586)
- *(deps)* Bump typeorm from 0.3.22 to 0.3.23 (#589)
- *(deps)* Bump docker/build-push-action from 6.16.0 to 6.17.0 (#592)
- *(deps)* Bump the angular group with 11 updates (#593)
- *(deps-dev)* Bump @typescript-eslint/parser from 8.31.0 to 8.32.0 (#587)
- *(deps-dev)* Bump @typescript-eslint/parser from 8.32.0 to 8.32.1 (#594)
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.31.1 to 8.32.1 (#596)


## 1.0.0 - 2025-05-06

### Bug Fixes

- *(search)* Add Qualifier Column To Search (#582)


## 0.7.9 - 2025-05-05

### Miscellaneous Tasks

- *(rename-project)* Rename To AHB Tabellen (#579)


## 0.7.8 - 2025-05-05

### Features

- *(link-to-stage)* Link To Stage Applications (#572)


### Miscellaneous Tasks

- *(bruno)* Add Version Endpoint Request (#571)
- *(remove-submodule)* Remove Git Submodule machine-readable_anwendungshandbuecher (#570)
- *(No Category)* Replace kohlrahbi with fundamend in "powered by"-footer (#578)


### Build

- *(deps)* Bump the angular group with 11 updates (#573)
- *(deps-dev)* Bump eslint from 9.25.1 to 9.26.0 (#574)
- *(deps-dev)* Bump tsx from 4.19.3 to 4.19.4 (#575)
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.31.0 to 8.31.1 (#576)


## 0.7.7 - 2025-05-03

### Bug Fixes

- *(link-preview)* Fix Link Preview (#569)


## 0.7.6 - 2025-05-02

### Bug Fixes

- *(health-check)* Fix Test Db Query (#567)
- *(iac)* Remove Azure Storage Account (#566)


### Styling

- *(landing-page)* Remove Border Of Login Button (#568)


## 0.7.5 - 2025-05-01

### Features

- *(use-sqlite-for-excel)* Use sqlite data to create excel files (#565)


## 0.7.4 - 2025-04-30

### Miscellaneous Tasks

- *(No Category)* Upgrade ahb.db (fixes many F2410 AHBs, updates some FV2504, adds entirely new FV2510) (#564)


## 0.7.3 - 2025-04-29

### Performance

- *(format-version-endpoint)* ⚡Read distinct format versions from suited SQLite table (not the `v_ahbtabellen` view) (#562)


## 0.7.2 - 2025-04-28

### Bug Fixes

- *(express-bug)* Fix by downgrade express (#561)


### Miscellaneous Tasks

- *(version-bump)* Update to v0.7.0 (#558)


## 0.7.1 - 2025-04-28

### Features

- *(cache)* Add Memory Caching In Format Versions Endpoint (#559)


### Build

- *(deps)* Bump docker/build-push-action from 6.15.0 to 6.16.0 (#556)
- *(deps)* Bump express from 4.21.2 to 5.1.0 (#557)


## 0.7.0 - 2025-04-25

### Features

- *(sqlite)* Use new SQLite Database (#553)


### Build

- *(deps)* Bump dotenv from 16.4.7 to 16.5.0 (#544)
- *(deps-dev)* Bump typescript from 5.7.3 to 5.8.2 (#507)
- *(deps-dev)* Bump jest-preset-angular from 14.5.3 to 14.5.4 (#545)
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.29.0 to 8.29.1 (#546)
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.29.1 to 8.30.1 (#548)
- *(deps-dev)* Bump ng-openapi-gen from 0.52.0 to 0.53.0 (#549)
- *(deps-dev)* Bump eslint from 9.24.0 to 9.25.0 (#550)


## 0.6.4 - 2025-04-11

### Bug Fixes

- *(scroll behaviour)* Fix Search Result Scrolling Behaviour (#538)


### Documentation

- *(No Category)* Mention data source for SQLite DB (is not XML) (#541)


### Features

- *(disclaimer)* Add Disclaimer (#540)
- *(refresh-token)* Use refresh token (#513)


### Styling

- *(footer)* Incease padding in y direction (#512)


### Build

- *(deps)* Bump docker/build-push-action from 6.14.0 to 6.15.0 (#495)
- *(deps)* Bump the angular group with 11 updates (#515)
- *(deps)* Bump docker/login-action from 3.3.0 to 3.4.0 (#519)
- *(deps)* Bump node from 23.9-alpine to 23.10-alpine (#520)
- *(deps)* Bump @azure/storage-blob from 12.26.0 to 12.27.0 (#533)
- *(deps)* Bump node from 23.10-alpine to 23.11-alpine (#537)
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.25.0 to 8.26.1 (#516)
- *(deps-dev)* Bump autoprefixer from 10.4.20 to 10.4.21 (#517)
- *(deps-dev)* Bump ng-mocks from 14.13.2 to 14.13.4 (#524)
- *(deps-dev)* Bump eslint from 9.21.0 to 9.23.0 (#525)
- *(deps-dev)* Bump @typescript-eslint/parser from 8.26.0 to 8.28.0 (#529)
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.26.1 to 8.28.0 (#531)
- *(deps-dev)* Bump eslint from 9.23.0 to 9.24.0 (#534)
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.28.0 to 8.29.0 (#536)


## 0.6.3 - 2025-03-10

### Miscellaneous Tasks

- *(version-endpoint)* Remove auth0 client id from version endpoint (#505)


### Styling

- *(No Category)* Change border line to hf-grell-rose (#481)
- *(No Category)* Change heart icon in footer (#488)
- *(No Category)* Further Design Updates (#491)


### Build

- *(deps)* Bump the angular group with 11 updates (#482)
- *(deps)* Bump rxjs from 7.8.1 to 7.8.2 (#483)
- *(deps)* Bump docker/build-push-action from 6.13.0 to 6.14.0 (#487)
- *(deps)* Bump node from 23.8-alpine to 23.9-alpine (#493)
- *(deps)* Bump docker/metadata-action from 5.6.1 to 5.7.0 (#494)
- *(deps)* Bump the angular group with 11 updates (#496)
- *(deps)* Bump the angular group with 16 updates (#506)
- *(deps)* Bump typeorm from 0.3.20 to 0.3.21 (#510)
- *(deps)* Bump prettier from 3.5.1 to 3.5.3 (#511)
- *(deps-dev)* Bump jest-preset-angular from 14.5.1 to 14.5.2 (#484)
- *(deps-dev)* Bump eslint from 9.20.1 to 9.21.0 (#485)
- *(deps-dev)* Bump postcss from 8.5.2 to 8.5.3 (#497)
- *(deps-dev)* Bump jest-preset-angular from 14.5.2 to 14.5.3 (#498)
- *(deps-dev)* Bump tsx from 4.19.2 to 4.19.3 (#499)
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.23.0 to 8.25.0 (#501)
- *(deps-dev)* Bump @typescript-eslint/parser from 8.22.0 to 8.26.0 (#509)


### Ci

- *(No Category)* Bump image versions to latest and greatest (#479)
- *(No Category)* Remove PAT references from workflows (#502)


## 0.6.2 - 2025-02-20

### Bug Fixes

- *(pruefi-input)* Fix prüfi input on ahb landing page (#477)


## 0.6.1 - 2025-02-20

### Bug Fixes

- *(healthcheck)* Fix Format of HealthCheck Results (#473)
- *(No Category)* Fix Many Requests After Using Back Button (#467)


### Styling

- *(No Category)* Fix Colors By Using Rosé Instead Of Red (#471)


## 0.6.0 - 2025-02-19

### Features

- *(healthcheck)* Add Healthcheck Endpoint (#466)


### Miscellaneous Tasks

- *(jest)* Fix Jest Deprecation Warnings (#465)


### Styling

- *(No Category)* Change color of mehr anzeigen (#468)


## 0.5.0 - 2025-02-18

### Bug Fixes

- *(deeplink)* Fix Deep Links (#461)
- *(ui)* Remove shadow from "Jetzt öffnen" button (#437)


### Refactor

- *(No Category)* Align ahb-landing-page with ahb-table-page (#456)
- *(No Category)* Fix Table Not Found Error (#457)


### Styling

- *(No Category)* Align Landing Page To Design Guideline (#458)
- *(No Category)* Align color in link kopiert (#459)
- *(No Category)* Align Landingpage To Designguide (#462)


### Build

- *(deps)* Bump the angular group with 16 updates (#439)
- *(deps)* Bump node from 23.7-alpine to 23.8-alpine (#444)
- *(deps)* Bump the angular group with 11 updates (#445)
- *(deps)* Bump prettier from 3.4.2 to 3.5.1 (#449)
- *(deps-dev)* Bump eslint from 9.19.0 to 9.20.0 (#440)
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.22.0 to 8.23.0 (#442)
- *(deps-dev)* Bump eslint from 9.20.0 to 9.20.1 (#447)
- *(deps-dev)* Bump postcss from 8.5.1 to 8.5.2 (#448)


## 0.4.5 - 2025-02-04

### Bug Fixes

- *(ui)* Solutions footer in white (#434)
- *(ui)* Change footer background to dark rose (#436)


### Miscellaneous Tasks

- *(No Category)* Bump companystylesheet submodule to latest main (#435)


### Build

- *(deps)* Bump the angular group with 11 updates (#422)
- *(deps)* Bump node from 23.6-alpine to 23.7-alpine (#426)
- *(deps-dev)* Bump @typescript-eslint/parser from 8.21.0 to 8.22.0 (#423)
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.21.0 to 8.22.0 (#424)


## 0.4.4 - 2025-01-30

### Features

- *(No Category)* Display version in footer (#421)


## 0.4.3 - 2025-01-30

### Features

- *(No Category)* Use default format version in dropdown; fix: FV2504 is now in June, not April (#419)


## 0.4.1 - 2025-01-30

### Bug Fixes

- *(UI)* Let footer stay at bottom of page, even when loading, and center loading message (#417)


### Miscellaneous Tasks

- *(No Category)* Increase form elements' border radius and center components (#420)


## 0.4.0 - 2025-01-29

### Documentation

- *(CD)* Add Deployment Section to README (#412)


## 0.3.4 - 2025-01-28

### Bug Fixes

- *(cd)* Use PAT instead of `GITHUB_TOKEN` for submodule checkout (#407)


## 0.3.2 - 2025-01-27

### Bug Fixes

- *(No Category)* Checkout companystylesheet submodule in deploy step (#406)


## 0.3.1 - 2025-01-27

### Bug Fixes

- *(No Category)* Drop gfonts; load .ttf files from scss, not missing woff2 from css (#393)


### Documentation

- *(No Category)* Add section for code generation in README (#405)


### Features

- *(No Category)* Add link to self (instead of just other solutions) (#403)


### Build

- *(deps-dev)* Bump typescript from 5.5.4 to 5.7.3 (#402)


## 0.3.0 - 2025-01-26

### Bug Fixes

- *(No Category)* Remove unused imports (#400)
- *(No Category)* Rename `getFormatVersion` function to `getFormat` (#401)


### Features

- *(No Category)* Add second (off-white) footer with link to other solutions (#398)
- *(No Category)* Display EBD deep links if value_pool_entry contains EBD key (#396)


### Miscellaneous Tasks

- *(design)* Fix Footer (#382)
- *(design)* Fix Landingpage (#389)
- *(design)* Make kohlrahbi in footer monospace font (#391)
- *(design)* Add logout icon and use mdi  (#392)
- *(No Category)* Add environment variable `ebdBaseUrl` to config (#394)
- *(No Category)* Bump submodule to prettiered version (#397)
- *(No Category)* Adjust landing page text and remove justification (#399)


### Refactor

- *(api)* Refactor interaction with blobstorage (#390)


### Build

- *(deps)* Bump docker/build-push-action from 6.12.0 to 6.13.0 (#384)
- *(deps)* Bump vite and @angular-devkit/build-angular (#377)
- *(deps)* Bump the angular group across 1 directory with 15 updates (#388)
- *(deps-dev)* Bump @typescript-eslint/parser from 8.20.0 to 8.21.0 (#385)
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.20.0 to 8.21.0 (#386)


## 0.2.0 - 2025-01-23

### Miscellaneous Tasks

- *(No Category)* Switch to Roboto as default font, everywhere (#380)


## 0.1.1 - 2025-01-22

### Documentation

- *(No Category)* Add link to prod URL (#376)


### Miscellaneous Tasks

- *(corporate design)* Add "Kontakt" link to footer (#378)


## 0.1.0 - 2025-01-22

### Miscellaneous Tasks

- *(design)* Switch from SVG heart to unicode ♡ in footer (#375)


### Build

- *(deps)* Bump node from 23.5-alpine to 23.6-alpine (#362)
- *(deps)* Bump docker/build-push-action from 6.10.0 to 6.11.0 (#363)
- *(deps)* Bump docker/build-push-action from 6.11.0 to 6.12.0 (#369)
- *(deps-dev)* Bump @typescript-eslint/parser from 8.19.0 to 8.19.1 (#364)
- *(deps-dev)* Bump ng-mocks from 14.13.1 to 14.13.2 (#365)
- *(deps-dev)* Bump jest-preset-angular from 14.4.2 to 14.5.0 (#366)
- *(deps-dev)* Bump eslint from 9.17.0 to 9.18.0 (#367)
- *(deps-dev)* Bump postcss from 8.4.49 to 8.5.1 (#370)
- *(deps-dev)* Bump @typescript-eslint/parser from 8.19.1 to 8.20.0 (#371)
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.19.0 to 8.20.0 (#372)


## 0.0.39 - 2025-01-11

### Ci

- *(stage)* Fix angular build command (#361)


## 0.0.38 - 2025-01-11

### Ci

- *(No Category)* Add clientid to version endpoint (#360)


## 0.0.37 - 2025-01-11

### Ci

- *(No Category)* Add environment info to version endpoint (#359)


## 0.0.36 - 2025-01-11

### Ci

- *(pulumi)* Set websitesContainerStartTimeLimit (#358)


## 0.0.35 - 2025-01-10

### Ci

- *(azure)* Increase startup time for container in azure (#357)


## 0.0.34 - 2025-01-10

### Build

- *(stage)* Add Stage Config (#355)


### Ci

- *(docker)* Make AHBesser Prod and Stage ready (#356)


## 0.0.33 - 2025-01-09

### Build

- *(deps)* Bump node from 23.4-alpine to 23.5-alpine (#344)
- *(deps)* Bump dotenv from 16.4.5 to 16.4.7 (#347)
- *(deps-dev)* Bump jest-preset-angular from 14.2.4 to 14.4.2 (#345)
- *(deps-dev)* Bump tailwindcss from 3.4.15 to 3.4.17 (#346)
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.18.1 to 8.18.2 (#349)
- *(deps-dev)* Bump concurrently from 9.1.0 to 9.1.1 (#348)
- *(deps-dev)* Bump @typescript-eslint/parser from 8.18.1 to 8.18.2 (#350)
- *(deps-dev)* Bump concurrently from 9.1.1 to 9.1.2 (#351)
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.18.2 to 8.19.0 (#352)
- *(deps-dev)* Bump @typescript-eslint/parser from 8.18.2 to 8.19.0 (#353)


## 0.0.32 - 2024-12-20

### Bug Fixes

- *(No Category)* Move auth button into header component (#341)


### Build

- *(deps-dev)* Bump eslint from 9.14.0 to 9.17.0 (#319)


### Ci

- *(octopus)* Accelerate Deployment Process (#343)


## 0.0.31 - 2024-12-19

### Bug Fixes

- *(Dockerfile)* Dockerfile To Get Build Information Into Version Endpoint (#340)


### Miscellaneous Tasks

- *(No Category)* Skip authentication during local development (#338)


## 0.0.30 - 2024-12-19

### Ci

- *(GH Action)* Use environment variables instead of outputs (#339)


## 0.0.29 - 2024-12-17

### Bug Fixes

- *(auth0)* Add new client id (#337)
- *(No Category)* Fix linebreak of collapsible conditions (#331)


### Ci

- *(octopus)* Update Pulumi For Prod Environment (#335)


## 0.0.28 - 2024-12-16

### Features

- *(No Category)* Add toggle to wrap and unwrap text in `Bedingung` column (#326)


### Miscellaneous Tasks

- *(No Category)* Add `Impressum` and `Datenschutz` hyperlinks to footer (#328)
- *(No Category)* Use solid line between different `Datenelement` values (#329)


### Ci

- *(GH Action)* Fill Version Endpoint with Information (#330)


## 0.0.27 - 2024-12-16

### Build

- *(deps)* Bump prettier from 3.3.3 to 3.4.2 (#318)
- *(deps)* Bump @azure/storage-blob from 12.25.0 to 12.26.0 (#320)
- *(deps)* Bump node from 23.3-alpine to 23.4-alpine (#322)


### Ci

- *(octopus)* Fix Octopus Deployment Workflow (#324)


## 0.0.22 - 2024-12-10

### Build

- *(deps)* Bump the angular group with 9 updates (#294)
- *(deps)* Bump the angular group with 11 updates (#299)
- *(deps)* Bump node from 23.1-alpine to 23.3-alpine (#304)
- *(deps)* Bump docker/metadata-action from 5.5.1 to 5.6.1 (#305)
- *(deps)* Bump docker/build-push-action from 6.9.0 to 6.10.0 (#306)
- *(deps)* Bump express from 4.21.1 to 4.21.2 (#314)
- *(deps)* Bump actions/attest-build-provenance from 1 to 2 (#316)
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.12.2 to 8.13.0 (#295)
- *(deps-dev)* Bump postcss from 8.4.47 to 8.4.48 (#297)
- *(deps-dev)* Bump concurrently from 9.0.1 to 9.1.0 (#298)
- *(deps-dev)* Bump @typescript-eslint/parser from 8.11.0 to 8.13.0 (#296)
- *(deps-dev)* Bump postcss from 8.4.48 to 8.4.49 (#300)
- *(deps-dev)* Bump @typescript-eslint/parser from 8.13.0 to 8.14.0 (#301)
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.13.0 to 8.14.0 (#302)
- *(deps-dev)* Bump @typescript-eslint/parser from 8.14.0 to 8.16.0 (#310)
- *(deps-dev)* Bump tailwindcss from 3.4.14 to 3.4.15 (#311)
- *(deps-dev)* Bump @typescript-eslint/parser from 8.16.0 to 8.17.0 (#313)


## 0.0.18 - 2024-11-08

### Ci

- *(No Category)* Update deployment process (#291)
- *(No Category)* Add variable for pulumi_stack (#292)
- *(No Category)* Further Updates For Octopus Deployment (#293)


## 0.0.17 - 2024-11-07

### Ci

- *(No Category)* Use tag info for creating release (#290)


## 0.0.16 - 2024-11-07

### Ci

- *(No Category)* Use Default space from octopus deploy (#289)


## 0.0.15 - 2024-11-07

### Ci

- *(No Category)* Use another service account id (#288)


## 0.0.14 - 2024-11-07

### Ci

- *(No Category)* Put pulumi regarded steps into octopus (#287)


## 0.0.14 - 2024-11-07

### Ci

- *(No Category)* Switch to pulumi directory (#286)


## 0.0.13 - 2024-11-07

### Ci

- *(No Category)* Try To Fix Bad Substitution (#285)


## 0.0.12 - 2024-11-07

### Ci

- *(No Category)* Fix permissions (#284)


## 0.0.11 - 2024-11-07

### Ci

- *(No Category)* New ci/cd pipeline (#283)


## 0.0.10 - 2024-11-04

### Features

- *(No Category)* 🔐 set up auth0 authentication (#264)


### Ci

- *(check conventional commits)* Add Check For Conventional Commits (#253)


## 0.0.1 - 2024-07-05

### App

- *(No Category)* Init layout/design with tailwind (#3)
- *(No Category)* Init table  (#4)
- *(No Category)* Use dynamic inputs (#18)
- *(No Category)* Highlight search results (#50)


<!-- generated by git-cliff -->
