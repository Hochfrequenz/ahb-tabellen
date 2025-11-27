# Changelog

All notable changes to this project will be documented in this file.

## [unreleased]

### 🐛 Bug Fixes

- *(search)* Fix Fulltext Search To Search In Collapsed Rows ([#655](https://github.com/hochfrequenz/ahb-tabellen/issues/655)) - ([4d97149](https://github.com/hochfrequenz/ahb-tabellen/commit/4d97149206ba90af37d4dfaa402702d846c74aeb))

### 🧹 Other

- *(other)* Use conventional commits

Co-authored-by: Copilot <175728472+Copilot@users.noreply.github.com> - ([08c4c23](https://github.com/hochfrequenz/ahb-tabellen/commit/08c4c236b2ac5d947c1839c3e9c2a7d118c1fa97))
- *(other)* Update deployment strategy - ([d842a33](https://github.com/hochfrequenz/ahb-tabellen/commit/d842a33da1af70a685599e143f24fb94cf96d535))
- *(other)* Remove notification step on deploy gh action - ([6dd1732](https://github.com/hochfrequenz/ahb-tabellen/commit/6dd17326fb374ff0fa84e529e1ec2337c7a4133f))
- *(other)* Merge remote-tracking branch 'origin/add-cliff-for-changelog-generation' into add-cliff-for-changelog-generation - ([a491955](https://github.com/hochfrequenz/ahb-tabellen/commit/a4919557355be26be7ae8a2af9bfd910508981f3))
- *(other)* Merge branch 'main' into add-cliff-for-changelog-generation - ([2ebd89b](https://github.com/hochfrequenz/ahb-tabellen/commit/2ebd89bce4746a0cae460c4ecefe301c7bb545c7))
- *(other)* Add examples for regex - ([876ed52](https://github.com/hochfrequenz/ahb-tabellen/commit/876ed52a24e5897ea0b91f70d2d146fda345ba48))
- *(other)* Mark CHANGELOG.md as generated - ([520c534](https://github.com/hochfrequenz/ahb-tabellen/commit/520c534a0c61c9c81604f5f1e356e8149645ee50))
- *(other)* Remove additional space - ([7ae67fe](https://github.com/hochfrequenz/ahb-tabellen/commit/7ae67fe4fa5e87032d7d8942ce604a83519e8740))
- *(other)* Prettier ignore CHANGELOG.md - ([8b9fc57](https://github.com/hochfrequenz/ahb-tabellen/commit/8b9fc57fc469036ca0788219d28f34c31dce50f4))
- *(other)* Update deploy gh action - ([80489ae](https://github.com/hochfrequenz/ahb-tabellen/commit/80489ae1658882553d1426ccc3fe144a114f0205))
- *(other)* Update cliff config - ([2beafae](https://github.com/hochfrequenz/ahb-tabellen/commit/2beafae7afa2347b0f90c699c1008f14287fee75))
- *(other)* Remove argument verbose flag for cliff command - ([aa35c7b](https://github.com/hochfrequenz/ahb-tabellen/commit/aa35c7b895432c508dc4f50c2e4c7feb7ae112ca))
- *(other)* Update changelog - ([e0b2ae9](https://github.com/hochfrequenz/ahb-tabellen/commit/e0b2ae9d67bc4983d9d8cb6a28bc6dfb3922fb6c))
- *(other)* Update cliff config - ([47fb162](https://github.com/hochfrequenz/ahb-tabellen/commit/47fb162150de07d2794a29372fad77838fa69959))

### 📚 Documentation

- Document how to create the changelog - ([26453c0](https://github.com/hochfrequenz/ahb-tabellen/commit/26453c056aedfb2506d5e2d0cf0d87c3862e368c))


## [1.3.0-rc02](https://github.com/hochfrequenz/ahb-tabellen/compare/v1.3.0-rc01..v1.3.0-rc02) - 2025-09-04

### 🧹 Other

- *(other)* Change permissions for content to write - ([92e32c4](https://github.com/hochfrequenz/ahb-tabellen/commit/92e32c4736611afbbe1bb1508f0e7b088d4995cb))


## [1.3.0-rc01](https://github.com/hochfrequenz/ahb-tabellen/compare/v1.3.0-rc00..v1.3.0-rc01) - 2025-09-04

### 🐛 Bug Fixes

- *(url-encoding)* Refactor updateURL to simplify query parameter handling ([#651](https://github.com/hochfrequenz/ahb-tabellen/issues/651)) - ([2fecd70](https://github.com/hochfrequenz/ahb-tabellen/commit/2fecd702dee78eac41b2ac2a695277246b41354c))
- Fix test for ahb table component

 FAIL  src/app/features/ahbs/views/ahb-page/ahb-page.component.spec.ts (5.811 s)
  ● AhbPageComponent › should render

    NullInjectorError: R3InjectorError(DynamicTestModule)[_HttpClient -> _HttpClient]:
      NullInjectorError: No provider for _HttpClient! - ([504399d](https://github.com/hochfrequenz/ahb-tabellen/commit/504399d1e6fb63394b6d3b274eca02861d3b6c17))

### 🧹 Other

- *(deps)* Bump node from 24.6-alpine to 24.7-alpine ([#654](https://github.com/hochfrequenz/ahb-tabellen/issues/654)) - ([26266fe](https://github.com/hochfrequenz/ahb-tabellen/commit/26266fe0bddd980510d0da174af1e72200b4d5fa))
- *(deps)* Bump actions/attest-build-provenance from 2 to 3 ([#653](https://github.com/hochfrequenz/ahb-tabellen/issues/653)) - ([711620d](https://github.com/hochfrequenz/ahb-tabellen/commit/711620dfb93a4e067842c99274d7e30866b29862))
- *(other)* Generate changelog and add to release - ([f3413a1](https://github.com/hochfrequenz/ahb-tabellen/commit/f3413a1bcbbc2bc4d8895d7fd4a7b7c93b163d11))
- *(other)* Change trigger to push version tag - ([8c71ca5](https://github.com/hochfrequenz/ahb-tabellen/commit/8c71ca51bd67b0ace5eb9fcd2a661b4ee16d552c))
- *(other)* Improve deploy github action - ([a9ecab4](https://github.com/hochfrequenz/ahb-tabellen/commit/a9ecab4c0f790a9a621456a0356b066212c7bff4))
- *(other)* Replace reviewer section in dependabot config with codeowners

The reviewers section is deprecated

https://github.blog/changelog/2025-04-29-dependabot-reviewers-configuration-option-being-replaced-by-code-owners/ - ([d6384b5](https://github.com/hochfrequenz/ahb-tabellen/commit/d6384b573ba0ea56eb3ea808b87d01d4f95df8a1))
- *(other)* Add commit message prefix for dependabot prs - ([29c134e](https://github.com/hochfrequenz/ahb-tabellen/commit/29c134eb2ca54a2a8693c9e6fe4fa8845f24ec5c))
- *(other)* Update changelog - ([e396af7](https://github.com/hochfrequenz/ahb-tabellen/commit/e396af7e804c07186eb3ecbaa25eb822a751a0ad))
- *(other)* Update cliff config with more emoticons - ([60d4736](https://github.com/hochfrequenz/ahb-tabellen/commit/60d4736b3f3d5f2d18f3268ca09ab8d9d91ccbf4))
- *(other)* Add emoticons to group names - ([9a6ab12](https://github.com/hochfrequenz/ahb-tabellen/commit/9a6ab1250ea5f1e79e067380c06ba2567c1696cc))
- *(other)* Add step in GH Action to generate release text - ([0130520](https://github.com/hochfrequenz/ahb-tabellen/commit/0130520ca9eb57cb086282dd6e96480ec48220cb))
- *(other)* Add changelog - ([45b041d](https://github.com/hochfrequenz/ahb-tabellen/commit/45b041d516f1154fca6685d7ee545dcdff272ac8))
- *(other)* Add cliff config - ([2b02d87](https://github.com/hochfrequenz/ahb-tabellen/commit/2b02d87b3a67ded91347fc9214d5f8517c43a58c))
- *(other)* Merge pull request #650 from Hochfrequenz/warmp-up-azure-functions

feat(azure-function-warmup-call): Add Warmup Call For AHBicht Azure Functions - ([7833bb2](https://github.com/hochfrequenz/ahb-tabellen/commit/7833bb298294ae051e62a723162da5c6aab73fda))
- *(other)* Add warmup call - ([f5a14d4](https://github.com/hochfrequenz/ahb-tabellen/commit/f5a14d4df320a303c4d7bde4dcca0e79a31dba98))
- *(other)* Add environment variable warmupUrl - ([aae4b70](https://github.com/hochfrequenz/ahb-tabellen/commit/aae4b702d0201b72030c9b41d053449b8402fe6c))

## New Contributors ❤️

* @hamidhajiparvaneh made their first contribution in [#651](https://github.com/hochfrequenz/ahb-tabellen/pull/651)
* @dependabot[bot] made their first contribution in [#654](https://github.com/hochfrequenz/ahb-tabellen/pull/654)
* @DeltaDaniel made their first contribution in [#650](https://github.com/hochfrequenz/ahb-tabellen/pull/650)
* @hf-krechan made their first contribution

## [1.3.0-rc00](https://github.com/hochfrequenz/ahb-tabellen/compare/v1.2.1..v1.3.0-rc00) - 2025-08-27

### ⛰️ Features

- *(dvgw-fallback)* Add DVGW Fallback Component ([#649](https://github.com/hochfrequenz/ahb-tabellen/issues/649)) - ([c123864](https://github.com/hochfrequenz/ahb-tabellen/commit/c1238645518d52fd8addb9ec512ac0b084d0f797))

### 🎨 Styling

- *(responsive-ui)* Make Landingpage and AHB Landingpage Responsive ([#648](https://github.com/hochfrequenz/ahb-tabellen/issues/648)) - ([6395b88](https://github.com/hochfrequenz/ahb-tabellen/commit/6395b8869248376b64e35a9a89721674dc477442))
- *(responsive-ui)* Make AHB Tabellen Responsive ([#647](https://github.com/hochfrequenz/ahb-tabellen/issues/647)) - ([cd03aa5](https://github.com/hochfrequenz/ahb-tabellen/commit/cd03aa505ec9cb48f88f9e01d222c1918d9a1211))


## [1.2.1](https://github.com/hochfrequenz/ahb-tabellen/compare/v1.2.0..v1.2.1) - 2025-08-18

### 🐛 Bug Fixes

- *(pruefi format mapping)* Corrects UTILMD values in pruefi mapping ([#638](https://github.com/hochfrequenz/ahb-tabellen/issues/638)) - ([0ef616c](https://github.com/hochfrequenz/ahb-tabellen/commit/0ef616c359d53bf111bcfcb82a13ad1a67957d86))
- Fix(url-encodin: Using encodeURIComponent for search term ([#639](https://github.com/hochfrequenz/ahb-tabellen/issues/639))

Using encodeURIComponent for search term - ([9a600bd](https://github.com/hochfrequenz/ahb-tabellen/commit/9a600bd77143cec9c4d53235e1bb8c0ea1d0fe78))

### 🧹 Other

- *(deps)* Bump node from 24.5-alpine to 24.6-alpine ([#645](https://github.com/hochfrequenz/ahb-tabellen/issues/645)) - ([da1efe0](https://github.com/hochfrequenz/ahb-tabellen/commit/da1efe0763309b0b410495e8e1670bb45328253f))
- *(deps)* Bump actions/checkout from 4 to 5 ([#644](https://github.com/hochfrequenz/ahb-tabellen/issues/644)) - ([5e0b3ec](https://github.com/hochfrequenz/ahb-tabellen/commit/5e0b3ec22ea51e41ed852fe7d3761e4109052ce9))
- *(deps)* Bump docker/login-action from 3.4.0 to 3.5.0 ([#642](https://github.com/hochfrequenz/ahb-tabellen/issues/642)) - ([0dd8d22](https://github.com/hochfrequenz/ahb-tabellen/commit/0dd8d22d6cd8dbc0f7e46b23296940066603f11f))
- *(deps)* Bump node from 24.4-alpine to 24.5-alpine ([#641](https://github.com/hochfrequenz/ahb-tabellen/issues/641)) - ([8be7c0e](https://github.com/hochfrequenz/ahb-tabellen/commit/8be7c0e944ea4cacccb941b8ea2537c9f16f3b6c))
- *(deps)* Bump docker/metadata-action from 5.7.0 to 5.8.0 ([#636](https://github.com/hochfrequenz/ahb-tabellen/issues/636)) - ([17162a9](https://github.com/hochfrequenz/ahb-tabellen/commit/17162a91a65be226697d3abdc433bb926cf8eecf))
- *(other)* Merge pull request #643 from Hochfrequenz/AHB-Tabellen

fix: AHB-Tabellen instead of AHB Tabellen - ([4bb6434](https://github.com/hochfrequenz/ahb-tabellen/commit/4bb64349b369b8b7751fd0f43046019961633a17))
- *(other)* AHB-Tabellen instead of AHB Tabellen - ([079c183](https://github.com/hochfrequenz/ahb-tabellen/commit/079c183b009c13527e7fbc50d9b147596e5d5282))

## New Contributors ❤️

* @hamidhajiparvaneh made their first contribution in [#643](https://github.com/hochfrequenz/ahb-tabellen/pull/643)

## [1.2.0](https://github.com/hochfrequenz/ahb-tabellen/compare/v1.1.2..v1.2.0) - 2025-08-01

### ⛰️ Features

- *(add versionsnummer and veroeffentlichungsdatum)* Adds versionsnummer and veroeffentlichungsdatum to the AHB metadata. ([#634](https://github.com/hochfrequenz/ahb-tabellen/issues/634)) - ([67c8f3f](https://github.com/hochfrequenz/ahb-tabellen/commit/67c8f3f042358965f7369fb92976ea61700ccfe3))


## [1.1.2](https://github.com/hochfrequenz/ahb-tabellen/compare/v1.1.0..v1.1.2) - 2025-07-21

### 🐛 Bug Fixes

- Remove old db, no more hoarding ([#631](https://github.com/hochfrequenz/ahb-tabellen/issues/631)) - ([3189cb4](https://github.com/hochfrequenz/ahb-tabellen/commit/3189cb47cdf65a3b253f5bb11e1cd9a94e96ed95))


## [1.1.0](https://github.com/hochfrequenz/ahb-tabellen/compare/v1.0.1..v1.1.0) - 2025-07-21

### ⛰️ Features

- Is this the way to update? No it says it comes from fundamend, but how? ([#630](https://github.com/hochfrequenz/ahb-tabellen/issues/630)) - ([33b7dc9](https://github.com/hochfrequenz/ahb-tabellen/commit/33b7dc9ca03ea91d02c3944cbb56b3c524f1a005))

### 🧹 Other

- *(deps)* Bump node from 24.3-alpine to 24.4-alpine ([#629](https://github.com/hochfrequenz/ahb-tabellen/issues/629)) - ([eb10be5](https://github.com/hochfrequenz/ahb-tabellen/commit/eb10be5d54a5c107889c034c0ad12f0310ef7560))
- *(deps)* Bump node from 24.2-alpine to 24.3-alpine ([#625](https://github.com/hochfrequenz/ahb-tabellen/issues/625)) - ([011c5dc](https://github.com/hochfrequenz/ahb-tabellen/commit/011c5dc09cf09d7de0b8258aee936942cf3c2570))
- *(deps)* Bump node from 24.1-alpine to 24.2-alpine ([#620](https://github.com/hochfrequenz/ahb-tabellen/issues/620)) - ([54dc84a](https://github.com/hochfrequenz/ahb-tabellen/commit/54dc84a7dc75c262f57323a3ffbf3a8e0a1222cd))
- *(deps)* Bump typeorm from 0.3.23 to 0.3.24 ([#616](https://github.com/hochfrequenz/ahb-tabellen/issues/616)) - ([92288e4](https://github.com/hochfrequenz/ahb-tabellen/commit/92288e4ab2b04526e3c38162ac1bfb3be725fbb2))
- *(deps)* Bump docker/build-push-action from 6.17.0 to 6.18.0 ([#612](https://github.com/hochfrequenz/ahb-tabellen/issues/612)) - ([ad0d499](https://github.com/hochfrequenz/ahb-tabellen/commit/ad0d4993c5d39402a0461e76f5bebbe9999be872))
- *(deps)* Bump node from 24.0-alpine to 24.1-alpine ([#611](https://github.com/hochfrequenz/ahb-tabellen/issues/611)) - ([3c780c3](https://github.com/hochfrequenz/ahb-tabellen/commit/3c780c3f5cc8a490dc688b2f22c6b67d1f0b564c))
- *(deps)* Bump zone.js from 0.15.0 to 0.15.1 ([#609](https://github.com/hochfrequenz/ahb-tabellen/issues/609)) - ([d26eb06](https://github.com/hochfrequenz/ahb-tabellen/commit/d26eb063b20aa3fac0a1255307e7cb8622a285c2))
- *(deps)* Bump the angular group with 16 updates ([#603](https://github.com/hochfrequenz/ahb-tabellen/issues/603)) - ([1d09196](https://github.com/hochfrequenz/ahb-tabellen/commit/1d0919627ed4e7980d9bbf14dc9da0783f1e12a7))
- *(deps-dev)* Bump postcss from 8.5.3 to 8.5.4 ([#615](https://github.com/hochfrequenz/ahb-tabellen/issues/615)) - ([a94617d](https://github.com/hochfrequenz/ahb-tabellen/commit/a94617da05bff8f758bf7986ce335643fcb2a5c5))
- *(deps-dev)* Bump @typescript-eslint/parser from 8.32.1 to 8.33.0 ([#610](https://github.com/hochfrequenz/ahb-tabellen/issues/610)) - ([608069b](https://github.com/hochfrequenz/ahb-tabellen/commit/608069b38c60175fe6cb2710a1f608339a23e175))
- *(deps-dev)* Bump eslint from 9.26.0 to 9.27.0 ([#605](https://github.com/hochfrequenz/ahb-tabellen/issues/605)) - ([e5a1752](https://github.com/hochfrequenz/ahb-tabellen/commit/e5a1752f1aae0ecd961d6b2b11f1fc416c6e05e3))
- *(deps-dev)* Bump ng-mocks from 14.13.4 to 14.13.5 ([#604](https://github.com/hochfrequenz/ahb-tabellen/issues/604)) - ([12fff10](https://github.com/hochfrequenz/ahb-tabellen/commit/12fff109c49a481a1818d1f2ce112c2ab58e0ec5))

## New Contributors ❤️

* @hf-fvesely made their first contribution in [#630](https://github.com/hochfrequenz/ahb-tabellen/pull/630)

## [1.0.1](https://github.com/hochfrequenz/ahb-tabellen/compare/v1.0.0..v1.0.1) - 2025-05-22

### 🐛 Bug Fixes

- Use correct query param name for EBD deeplink ([#600](https://github.com/hochfrequenz/ahb-tabellen/issues/600)) - ([5450070](https://github.com/hochfrequenz/ahb-tabellen/commit/5450070b55945e15c3699cea7a1ece4c707696a6))

### 🧹 Other

- *(deps)* Bump the angular group with 11 updates ([#593](https://github.com/hochfrequenz/ahb-tabellen/issues/593)) - ([0a03d15](https://github.com/hochfrequenz/ahb-tabellen/commit/0a03d1580e2a0f5cedd33b87c2b337c7d19d8801))
- *(deps)* Bump docker/build-push-action from 6.16.0 to 6.17.0 ([#592](https://github.com/hochfrequenz/ahb-tabellen/issues/592)) - ([f7062a3](https://github.com/hochfrequenz/ahb-tabellen/commit/f7062a31a6052fdc937fea8f3911ad4beb362a68))
- *(deps)* Bump typeorm from 0.3.22 to 0.3.23 ([#589](https://github.com/hochfrequenz/ahb-tabellen/issues/589)) - ([8521cda](https://github.com/hochfrequenz/ahb-tabellen/commit/8521cdaf374c40e71bbb6eaf264d3beb4a27cada))
- *(deps)* Bump the angular group with 16 updates ([#586](https://github.com/hochfrequenz/ahb-tabellen/issues/586)) - ([41f1c04](https://github.com/hochfrequenz/ahb-tabellen/commit/41f1c04fd0157a7009b45cc062b53237d8059b3d))
- *(deps)* Bump node from 23.11-alpine to 24.0-alpine ([#585](https://github.com/hochfrequenz/ahb-tabellen/issues/585)) - ([6c4c222](https://github.com/hochfrequenz/ahb-tabellen/commit/6c4c222ec1b7d7494df4ef770eb318353d6cffcd))
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.31.1 to 8.32.1 ([#596](https://github.com/hochfrequenz/ahb-tabellen/issues/596)) - ([da562e8](https://github.com/hochfrequenz/ahb-tabellen/commit/da562e8e9dac5c74d81132852a0ceae60ea8ef1e))
- *(deps-dev)* Bump @typescript-eslint/parser from 8.32.0 to 8.32.1 ([#594](https://github.com/hochfrequenz/ahb-tabellen/issues/594)) - ([68f2c71](https://github.com/hochfrequenz/ahb-tabellen/commit/68f2c7117e50cfca610ca914f8e27a09e99bb92e))
- *(deps-dev)* Bump @typescript-eslint/parser from 8.31.0 to 8.32.0 ([#587](https://github.com/hochfrequenz/ahb-tabellen/issues/587)) - ([35cfb88](https://github.com/hochfrequenz/ahb-tabellen/commit/35cfb883617b1857de2c65520da89eab790fbe34))

### ⚙️ Miscellaneous Tasks

- Remove "versuchen Sie es erneut" from error message ([#583](https://github.com/hochfrequenz/ahb-tabellen/issues/583)) - ([24bdb83](https://github.com/hochfrequenz/ahb-tabellen/commit/24bdb83eff1f4c7b1daf157377a56861cbc932b3))


## [1.0.0](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.7.9..v1.0.0) - 2025-05-06

### 🐛 Bug Fixes

- *(search)* Add Qualifier Column To Search ([#582](https://github.com/hochfrequenz/ahb-tabellen/issues/582)) - ([f7aa061](https://github.com/hochfrequenz/ahb-tabellen/commit/f7aa061845fb2567490acc3e99018e34a6f2e9a1))


## [0.7.9](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.7.8..v0.7.9) - 2025-05-05

### ⚙️ Miscellaneous Tasks

- *(rename-project)* Rename To AHB Tabellen ([#579](https://github.com/hochfrequenz/ahb-tabellen/issues/579)) - ([1902791](https://github.com/hochfrequenz/ahb-tabellen/commit/19027919c045d2bc1785903a9094edf4dff44e74))


## [0.7.8](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.7.7..v0.7.8) - 2025-05-05

### ⛰️ Features

- *(link-to-stage)* Link To Stage Applications ([#572](https://github.com/hochfrequenz/ahb-tabellen/issues/572)) - ([143b4f1](https://github.com/hochfrequenz/ahb-tabellen/commit/143b4f1aec86da015cc4717d93dd067187ae93e2))

### 🧹 Other

- *(deps)* Bump the angular group with 11 updates ([#573](https://github.com/hochfrequenz/ahb-tabellen/issues/573)) - ([205905e](https://github.com/hochfrequenz/ahb-tabellen/commit/205905e3869791e5bc262c61491780f65939a5d3))
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.31.0 to 8.31.1 ([#576](https://github.com/hochfrequenz/ahb-tabellen/issues/576)) - ([3bf23d3](https://github.com/hochfrequenz/ahb-tabellen/commit/3bf23d3637ddf22ad847bf10f2581dd354a8e9e3))
- *(deps-dev)* Bump tsx from 4.19.3 to 4.19.4 ([#575](https://github.com/hochfrequenz/ahb-tabellen/issues/575)) - ([e475132](https://github.com/hochfrequenz/ahb-tabellen/commit/e475132713c5dba55b9c0cee97db7379ba36110d))
- *(deps-dev)* Bump eslint from 9.25.1 to 9.26.0 ([#574](https://github.com/hochfrequenz/ahb-tabellen/issues/574)) - ([2411773](https://github.com/hochfrequenz/ahb-tabellen/commit/2411773fb7bf27a2d488db186c47b11f2182addc))

### ⚙️ Miscellaneous Tasks

- *(bruno)* Add Version Endpoint Request ([#571](https://github.com/hochfrequenz/ahb-tabellen/issues/571)) - ([0c97d49](https://github.com/hochfrequenz/ahb-tabellen/commit/0c97d49ad896355992d79f0c636700c25e652488))
- *(remove-submodule)* Remove Git Submodule machine-readable_anwendungshandbuecher ([#570](https://github.com/hochfrequenz/ahb-tabellen/issues/570)) - ([f143afb](https://github.com/hochfrequenz/ahb-tabellen/commit/f143afb03273b64ee08f4123cc5d3eb18666fe7c))
- Replace kohlrahbi with fundamend in "powered by"-footer ([#578](https://github.com/hochfrequenz/ahb-tabellen/issues/578)) - ([1f1664e](https://github.com/hochfrequenz/ahb-tabellen/commit/1f1664e0ef4ab2ff157aa534ca124d00c01459b3))


## [0.7.7](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.7.6..v0.7.7) - 2025-05-03

### 🐛 Bug Fixes

- *(link-preview)* Fix Link Preview ([#569](https://github.com/hochfrequenz/ahb-tabellen/issues/569)) - ([6e62404](https://github.com/hochfrequenz/ahb-tabellen/commit/6e624046f58e0a3fa33b88429247548471c00ff4))


## [0.7.6](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.7.5..v0.7.6) - 2025-05-02

### 🐛 Bug Fixes

- *(health-check)* Fix Test Db Query ([#567](https://github.com/hochfrequenz/ahb-tabellen/issues/567)) - ([c1a1891](https://github.com/hochfrequenz/ahb-tabellen/commit/c1a18910fda887b57f2d27829407b63311cf09c5))
- *(iac)* Remove Azure Storage Account ([#566](https://github.com/hochfrequenz/ahb-tabellen/issues/566)) - ([717dd02](https://github.com/hochfrequenz/ahb-tabellen/commit/717dd021716a98d6bf4ce76f54518a5758a9704f))

### 🎨 Styling

- *(landing-page)* Remove Border Of Login Button ([#568](https://github.com/hochfrequenz/ahb-tabellen/issues/568)) - ([80c8b2c](https://github.com/hochfrequenz/ahb-tabellen/commit/80c8b2cf6feb4c3655303781a88795ee724403b7))


## [0.7.5](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.7.4..v0.7.5) - 2025-05-01

### ⛰️ Features

- *(use-sqlite-for-excel)* Use sqlite data to create excel files ([#565](https://github.com/hochfrequenz/ahb-tabellen/issues/565)) - ([20e4727](https://github.com/hochfrequenz/ahb-tabellen/commit/20e472764327cdacdb32b50dad70a628dfd24e0f))


## [0.7.4](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.7.3..v0.7.4) - 2025-04-30

### ⚙️ Miscellaneous Tasks

- Upgrade ahb.db (fixes many F2410 AHBs, updates some FV2504, adds entirely new FV2510) ([#564](https://github.com/hochfrequenz/ahb-tabellen/issues/564)) - ([8337d87](https://github.com/hochfrequenz/ahb-tabellen/commit/8337d87eaf8806325144a71395428d2b716f45d9))


## [0.7.3](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.7.2..v0.7.3) - 2025-04-29

### ⚡ Performance

- *(format-version-endpoint)* ⚡Read distinct format versions from suited SQLite table (not the `v_ahbtabellen` view) ([#562](https://github.com/hochfrequenz/ahb-tabellen/issues/562)) - ([329b052](https://github.com/hochfrequenz/ahb-tabellen/commit/329b05232fb5255d03780d0dc5414671de457a75))


## [0.7.2](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.7.1..v0.7.2) - 2025-04-28

### 🐛 Bug Fixes

- *(express-bug)* Fix by downgrade express ([#561](https://github.com/hochfrequenz/ahb-tabellen/issues/561)) - ([08fef3d](https://github.com/hochfrequenz/ahb-tabellen/commit/08fef3da440e3213cbb680a87bab103c6922175b))

### ⚙️ Miscellaneous Tasks

- *(version-bump)* Update to v0.7.0 ([#558](https://github.com/hochfrequenz/ahb-tabellen/issues/558)) - ([50df4d5](https://github.com/hochfrequenz/ahb-tabellen/commit/50df4d5dc2efdc5f784b7014e32c45894c0203c6))


## [0.7.1](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.7.0..v0.7.1) - 2025-04-28

### ⛰️ Features

- *(cache)* Add Memory Caching In Format Versions Endpoint ([#559](https://github.com/hochfrequenz/ahb-tabellen/issues/559)) - ([b56ec4b](https://github.com/hochfrequenz/ahb-tabellen/commit/b56ec4bb3159ee326dd82a85344bbe6fa00fb09b))

### 🧹 Other

- *(deps)* Bump express from 4.21.2 to 5.1.0 ([#557](https://github.com/hochfrequenz/ahb-tabellen/issues/557)) - ([185dadb](https://github.com/hochfrequenz/ahb-tabellen/commit/185dadb88116e03329710c3cf2a7a79be4887d73))
- *(deps)* Bump docker/build-push-action from 6.15.0 to 6.16.0 ([#556](https://github.com/hochfrequenz/ahb-tabellen/issues/556)) - ([072995d](https://github.com/hochfrequenz/ahb-tabellen/commit/072995d926c79593df8de061c047c342f4e4b37b))


## [0.7.0](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.6.4..v0.7.0) - 2025-04-25

### ⛰️ Features

- *(sqlite)* Use new SQLite Database ([#553](https://github.com/hochfrequenz/ahb-tabellen/issues/553)) - ([e53f1e5](https://github.com/hochfrequenz/ahb-tabellen/commit/e53f1e5444fcabc04eb8c4f02361b65c5b0c1402))

### 🧹 Other

- *(deps)* Bump dotenv from 16.4.7 to 16.5.0 ([#544](https://github.com/hochfrequenz/ahb-tabellen/issues/544)) - ([3dd36a1](https://github.com/hochfrequenz/ahb-tabellen/commit/3dd36a1dee3ec236af513260791e83c10362dd4f))
- *(deps-dev)* Bump eslint from 9.24.0 to 9.25.0 ([#550](https://github.com/hochfrequenz/ahb-tabellen/issues/550)) - ([5a1b05b](https://github.com/hochfrequenz/ahb-tabellen/commit/5a1b05b591a4fcf0bfb0d84b4b42dae47cf789af))
- *(deps-dev)* Bump ng-openapi-gen from 0.52.0 to 0.53.0 ([#549](https://github.com/hochfrequenz/ahb-tabellen/issues/549)) - ([bc4e684](https://github.com/hochfrequenz/ahb-tabellen/commit/bc4e684f4f7dc0f8e0483aea7c2edacbe7301f50))
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.29.1 to 8.30.1 ([#548](https://github.com/hochfrequenz/ahb-tabellen/issues/548)) - ([34cd075](https://github.com/hochfrequenz/ahb-tabellen/commit/34cd0759ba9f272f0e2a5d6094be35c7cd2c6727))
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.29.0 to 8.29.1 ([#546](https://github.com/hochfrequenz/ahb-tabellen/issues/546)) - ([92f7248](https://github.com/hochfrequenz/ahb-tabellen/commit/92f72483660d1c550131e7e6b722c027a415d5ca))
- *(deps-dev)* Bump jest-preset-angular from 14.5.3 to 14.5.4 ([#545](https://github.com/hochfrequenz/ahb-tabellen/issues/545)) - ([adb980f](https://github.com/hochfrequenz/ahb-tabellen/commit/adb980fefa9d59b3405b16da63d7b866e38a5e18))
- *(deps-dev)* Bump typescript from 5.7.3 to 5.8.2 ([#507](https://github.com/hochfrequenz/ahb-tabellen/issues/507)) - ([85fa345](https://github.com/hochfrequenz/ahb-tabellen/commit/85fa3459f5d2b8a62812933a544dd0a4f3e057cd))
- *(other)* Bump ahb tabellen version in pulumi config ([#542](https://github.com/hochfrequenz/ahb-tabellen/issues/542))

bump version in pulumi config - ([0371303](https://github.com/hochfrequenz/ahb-tabellen/commit/037130363e8037a565c41f00dc4da34bbf830351))


## [0.6.4](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.6.3..v0.6.4) - 2025-04-11

### ⛰️ Features

- *(disclaimer)* Add Disclaimer ([#540](https://github.com/hochfrequenz/ahb-tabellen/issues/540)) - ([1efab96](https://github.com/hochfrequenz/ahb-tabellen/commit/1efab96a100f29fe17b7e784facb35aace3dd65d))
- *(refresh-token)* Use refresh token ([#513](https://github.com/hochfrequenz/ahb-tabellen/issues/513)) - ([b446b97](https://github.com/hochfrequenz/ahb-tabellen/commit/b446b97e4bb65a9772102b31a26977a8c0f09478))

### 🐛 Bug Fixes

- *(scroll behaviour)* Fix Search Result Scrolling Behaviour ([#538](https://github.com/hochfrequenz/ahb-tabellen/issues/538)) - ([df3504e](https://github.com/hochfrequenz/ahb-tabellen/commit/df3504eaa2d38d2111177644889abaf0b9335209))

### 🧹 Other

- *(deps)* Bump node from 23.10-alpine to 23.11-alpine ([#537](https://github.com/hochfrequenz/ahb-tabellen/issues/537)) - ([29c0373](https://github.com/hochfrequenz/ahb-tabellen/commit/29c0373034c447bced2c1ee39010f209b363e030))
- *(deps)* Bump @azure/storage-blob from 12.26.0 to 12.27.0 ([#533](https://github.com/hochfrequenz/ahb-tabellen/issues/533)) - ([f70a7a8](https://github.com/hochfrequenz/ahb-tabellen/commit/f70a7a856b83854261a1dd3984b96a8b048c7c54))
- *(deps)* Bump node from 23.9-alpine to 23.10-alpine ([#520](https://github.com/hochfrequenz/ahb-tabellen/issues/520)) - ([09e0d02](https://github.com/hochfrequenz/ahb-tabellen/commit/09e0d0202b04d3f1302de7367154e31ee29541ff))
- *(deps)* Bump docker/login-action from 3.3.0 to 3.4.0 ([#519](https://github.com/hochfrequenz/ahb-tabellen/issues/519)) - ([cb59841](https://github.com/hochfrequenz/ahb-tabellen/commit/cb5984132b4fea59cb22b001457b73dbe5c98451))
- *(deps)* Bump the angular group with 11 updates ([#515](https://github.com/hochfrequenz/ahb-tabellen/issues/515)) - ([8f2e873](https://github.com/hochfrequenz/ahb-tabellen/commit/8f2e87342819d38a51d67a543b810b4ff790576b))
- *(deps)* Bump docker/build-push-action from 6.14.0 to 6.15.0 ([#495](https://github.com/hochfrequenz/ahb-tabellen/issues/495)) - ([208aeda](https://github.com/hochfrequenz/ahb-tabellen/commit/208aeda02c155795e2cc95215e4f107a7ecc5547))
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.28.0 to 8.29.0 ([#536](https://github.com/hochfrequenz/ahb-tabellen/issues/536)) - ([7d38d34](https://github.com/hochfrequenz/ahb-tabellen/commit/7d38d343895dc97aa0ff9b4a3d6b503aea9abfaa))
- *(deps-dev)* Bump eslint from 9.23.0 to 9.24.0 ([#534](https://github.com/hochfrequenz/ahb-tabellen/issues/534)) - ([3bbdc5c](https://github.com/hochfrequenz/ahb-tabellen/commit/3bbdc5c66f9ada06115c1d09d715cbb54e369735))
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.26.1 to 8.28.0 ([#531](https://github.com/hochfrequenz/ahb-tabellen/issues/531)) - ([b78cc7f](https://github.com/hochfrequenz/ahb-tabellen/commit/b78cc7fbad452ddddc1a951adfda0e0b738fda64))
- *(deps-dev)* Bump @typescript-eslint/parser from 8.26.0 to 8.28.0 ([#529](https://github.com/hochfrequenz/ahb-tabellen/issues/529)) - ([d38a910](https://github.com/hochfrequenz/ahb-tabellen/commit/d38a910298419b9299f41c603cf00c23fd1a8658))
- *(deps-dev)* Bump eslint from 9.21.0 to 9.23.0 ([#525](https://github.com/hochfrequenz/ahb-tabellen/issues/525)) - ([ffa4828](https://github.com/hochfrequenz/ahb-tabellen/commit/ffa4828cf153b5529bc43db871f3760aa74edcda))
- *(deps-dev)* Bump ng-mocks from 14.13.2 to 14.13.4 ([#524](https://github.com/hochfrequenz/ahb-tabellen/issues/524)) - ([aa68359](https://github.com/hochfrequenz/ahb-tabellen/commit/aa683596b40f3439a5917e9b55b909614e7f310e))
- *(deps-dev)* Bump autoprefixer from 10.4.20 to 10.4.21 ([#517](https://github.com/hochfrequenz/ahb-tabellen/issues/517)) - ([d2ef401](https://github.com/hochfrequenz/ahb-tabellen/commit/d2ef40162a655e6f79b8fbd9bf0aef482fd1c8d3))
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.25.0 to 8.26.1 ([#516](https://github.com/hochfrequenz/ahb-tabellen/issues/516)) - ([b10e1f9](https://github.com/hochfrequenz/ahb-tabellen/commit/b10e1f99672c804c3a7163e639bcea622a9e2f3b))

### 📚 Documentation

- Mention data source for SQLite DB (is not XML) ([#541](https://github.com/hochfrequenz/ahb-tabellen/issues/541)) - ([0247481](https://github.com/hochfrequenz/ahb-tabellen/commit/0247481b01775914849b890e28b83762c0133083))

### 🎨 Styling

- *(footer)* Incease padding in y direction ([#512](https://github.com/hochfrequenz/ahb-tabellen/issues/512)) - ([f1c9de8](https://github.com/hochfrequenz/ahb-tabellen/commit/f1c9de8ca52fc211d17b1915ef14c9d481766d9e))


## [0.6.3](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.6.2..v0.6.3) - 2025-03-10

### 🧹 Other

- *(deps)* Bump prettier from 3.5.1 to 3.5.3 ([#511](https://github.com/hochfrequenz/ahb-tabellen/issues/511)) - ([c963dd2](https://github.com/hochfrequenz/ahb-tabellen/commit/c963dd26edd792d011999f56ad0a4e70bad7fd94))
- *(deps)* Bump typeorm from 0.3.20 to 0.3.21 ([#510](https://github.com/hochfrequenz/ahb-tabellen/issues/510)) - ([5286b6e](https://github.com/hochfrequenz/ahb-tabellen/commit/5286b6e319eea7a40889a41215e414147edbdbbe))
- *(deps)* Bump the angular group with 16 updates ([#506](https://github.com/hochfrequenz/ahb-tabellen/issues/506)) - ([97629b3](https://github.com/hochfrequenz/ahb-tabellen/commit/97629b34255d2d1dd6ac19c9e7662f09519676ac))
- *(deps)* Bump the angular group with 11 updates ([#496](https://github.com/hochfrequenz/ahb-tabellen/issues/496)) - ([8f069c8](https://github.com/hochfrequenz/ahb-tabellen/commit/8f069c8112894c10b1fa65c489326a91cf11a9ab))
- *(deps)* Bump docker/metadata-action from 5.6.1 to 5.7.0 ([#494](https://github.com/hochfrequenz/ahb-tabellen/issues/494)) - ([41b1b65](https://github.com/hochfrequenz/ahb-tabellen/commit/41b1b65b1ad32e33c787812ef9d71c972df99dc3))
- *(deps)* Bump node from 23.8-alpine to 23.9-alpine ([#493](https://github.com/hochfrequenz/ahb-tabellen/issues/493)) - ([70550a6](https://github.com/hochfrequenz/ahb-tabellen/commit/70550a63b59e291593d809392283f4c38046c1ab))
- *(deps)* Bump docker/build-push-action from 6.13.0 to 6.14.0 ([#487](https://github.com/hochfrequenz/ahb-tabellen/issues/487)) - ([8d75da7](https://github.com/hochfrequenz/ahb-tabellen/commit/8d75da705b2830820c3de5ebd547fd9c904923da))
- *(deps)* Bump rxjs from 7.8.1 to 7.8.2 ([#483](https://github.com/hochfrequenz/ahb-tabellen/issues/483)) - ([6b30f22](https://github.com/hochfrequenz/ahb-tabellen/commit/6b30f229e2177da2a316378a7102d3daf8d3b2fb))
- *(deps)* Bump the angular group with 11 updates ([#482](https://github.com/hochfrequenz/ahb-tabellen/issues/482)) - ([dfbb2b1](https://github.com/hochfrequenz/ahb-tabellen/commit/dfbb2b16535eee1976ae9d82ef4b7e734062f6d4))
- *(deps-dev)* Bump @typescript-eslint/parser from 8.22.0 to 8.26.0 ([#509](https://github.com/hochfrequenz/ahb-tabellen/issues/509)) - ([e1cf528](https://github.com/hochfrequenz/ahb-tabellen/commit/e1cf528ec86f663b4210945b5aee8ae99ccb44ad))
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.23.0 to 8.25.0 ([#501](https://github.com/hochfrequenz/ahb-tabellen/issues/501)) - ([1af7b61](https://github.com/hochfrequenz/ahb-tabellen/commit/1af7b61bd413afda679cd32e9077516e51d55bd6))
- *(deps-dev)* Bump tsx from 4.19.2 to 4.19.3 ([#499](https://github.com/hochfrequenz/ahb-tabellen/issues/499)) - ([4ae757d](https://github.com/hochfrequenz/ahb-tabellen/commit/4ae757d567560ff04d3d95011b7ab9c00d644bec))
- *(deps-dev)* Bump jest-preset-angular from 14.5.2 to 14.5.3 ([#498](https://github.com/hochfrequenz/ahb-tabellen/issues/498)) - ([8048f33](https://github.com/hochfrequenz/ahb-tabellen/commit/8048f337546db5eb10508053b8732a36140596e5))
- *(deps-dev)* Bump postcss from 8.5.2 to 8.5.3 ([#497](https://github.com/hochfrequenz/ahb-tabellen/issues/497)) - ([e03c926](https://github.com/hochfrequenz/ahb-tabellen/commit/e03c92690c33e1a4ad4b0944c8662b3253a6b970))
- *(deps-dev)* Bump eslint from 9.20.1 to 9.21.0 ([#485](https://github.com/hochfrequenz/ahb-tabellen/issues/485)) - ([463e99e](https://github.com/hochfrequenz/ahb-tabellen/commit/463e99ea6c3b1fc40babc8c14d97c02866ac8217))
- *(deps-dev)* Bump jest-preset-angular from 14.5.1 to 14.5.2 ([#484](https://github.com/hochfrequenz/ahb-tabellen/issues/484)) - ([a39584c](https://github.com/hochfrequenz/ahb-tabellen/commit/a39584cd78029fb38261fecd4d3438477e67510c))

### 🎨 Styling

- Further Design Updates ([#491](https://github.com/hochfrequenz/ahb-tabellen/issues/491)) - ([665a5a8](https://github.com/hochfrequenz/ahb-tabellen/commit/665a5a8ca76b62d270bc7bd951d37a87066f4847))
- Change heart icon in footer ([#488](https://github.com/hochfrequenz/ahb-tabellen/issues/488)) - ([82d4694](https://github.com/hochfrequenz/ahb-tabellen/commit/82d4694181ef32b729d23ee4cd69017885368fa4))
- Change border line to hf-grell-rose ([#481](https://github.com/hochfrequenz/ahb-tabellen/issues/481)) - ([4713036](https://github.com/hochfrequenz/ahb-tabellen/commit/471303628d3a05a299c6d1a3917d119cdb30479f))

### ⚙️ Miscellaneous Tasks

- *(version-endpoint)* Remove auth0 client id from version endpoint ([#505](https://github.com/hochfrequenz/ahb-tabellen/issues/505)) - ([7ba4ca1](https://github.com/hochfrequenz/ahb-tabellen/commit/7ba4ca12370759a922ec9c7cd8ef33448fa2e5b8))
- Remove PAT references from workflows ([#502](https://github.com/hochfrequenz/ahb-tabellen/issues/502)) - ([92740c8](https://github.com/hochfrequenz/ahb-tabellen/commit/92740c86fd16deaf59652863a96c1d8147ea185d))
- Bump image versions to latest and greatest ([#479](https://github.com/hochfrequenz/ahb-tabellen/issues/479)) - ([7a58b82](https://github.com/hochfrequenz/ahb-tabellen/commit/7a58b82663af5d34b37a81b87406274eebf055c5))


## [0.6.2](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.6.1..v0.6.2) - 2025-02-20

### 🐛 Bug Fixes

- *(pruefi-input)* Fix prüfi input on ahb landing page ([#477](https://github.com/hochfrequenz/ahb-tabellen/issues/477)) - ([2d0cf45](https://github.com/hochfrequenz/ahb-tabellen/commit/2d0cf45d7c8394e3c46221819bef6394ee6958f3))


## [0.6.1](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.6.0..v0.6.1) - 2025-02-20

### 🐛 Bug Fixes

- *(healthcheck)* Fix Format of HealthCheck Results ([#473](https://github.com/hochfrequenz/ahb-tabellen/issues/473)) - ([fabce09](https://github.com/hochfrequenz/ahb-tabellen/commit/fabce09763416886ae5d62a78d1be83bff461611))
- Fix Many Requests After Using Back Button ([#467](https://github.com/hochfrequenz/ahb-tabellen/issues/467)) - ([235776b](https://github.com/hochfrequenz/ahb-tabellen/commit/235776b9abcc7de3386d56a4aa64d81b86213ccb))

### 🎨 Styling

- Fix Colors By Using Rosé Instead Of Red ([#471](https://github.com/hochfrequenz/ahb-tabellen/issues/471)) - ([5e4dac6](https://github.com/hochfrequenz/ahb-tabellen/commit/5e4dac6af719a7b9b14bbb4fb33dbf327df2860e))


## [0.6.0](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.5.0..v0.6.0) - 2025-02-19

### ⛰️ Features

- *(healthcheck)* Add Healthcheck Endpoint ([#466](https://github.com/hochfrequenz/ahb-tabellen/issues/466)) - ([06c1c71](https://github.com/hochfrequenz/ahb-tabellen/commit/06c1c71454c21fc45a32e3521e179c171de7c577))

### 🎨 Styling

- Change color of mehr anzeigen ([#468](https://github.com/hochfrequenz/ahb-tabellen/issues/468)) - ([7ad9b73](https://github.com/hochfrequenz/ahb-tabellen/commit/7ad9b7341d3af0a7b685fd084812fcad333845be))

### ⚙️ Miscellaneous Tasks

- *(jest)* Fix Jest Deprecation Warnings ([#465](https://github.com/hochfrequenz/ahb-tabellen/issues/465)) - ([de0d859](https://github.com/hochfrequenz/ahb-tabellen/commit/de0d8592a8f36707513e3f54a67f254537389402))


## [0.5.0](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.4.5..v0.5.0) - 2025-02-18

### 🐛 Bug Fixes

- *(deeplink)* Fix Deep Links ([#461](https://github.com/hochfrequenz/ahb-tabellen/issues/461)) - ([974414e](https://github.com/hochfrequenz/ahb-tabellen/commit/974414ead704c90d9970130ee0d7f504cb8facc9))
- *(ui)* Remove shadow from "Jetzt öffnen" button ([#437](https://github.com/hochfrequenz/ahb-tabellen/issues/437)) - ([b8a341b](https://github.com/hochfrequenz/ahb-tabellen/commit/b8a341bba5c745101c7fb56dfb53ee3747b29a55))
- Fix color in meta data section - ([6b62ae4](https://github.com/hochfrequenz/ahb-tabellen/commit/6b62ae4d15254e864e6cd7432ea92798ee46f477))
- Fix footer bg color - ([69df0a8](https://github.com/hochfrequenz/ahb-tabellen/commit/69df0a8e574232e5b5da323bf8934c76dcf9587e))

### 🧹 Other

- *(deps)* Bump prettier from 3.4.2 to 3.5.1 ([#449](https://github.com/hochfrequenz/ahb-tabellen/issues/449)) - ([b115fb7](https://github.com/hochfrequenz/ahb-tabellen/commit/b115fb76d6d5256555a8338fc11b7ac21325fd5e))
- *(deps)* Bump the angular group with 11 updates ([#445](https://github.com/hochfrequenz/ahb-tabellen/issues/445)) - ([5c608e1](https://github.com/hochfrequenz/ahb-tabellen/commit/5c608e18d127b9b3880c1b61ed71ce83d037e32a))
- *(deps)* Bump node from 23.7-alpine to 23.8-alpine ([#444](https://github.com/hochfrequenz/ahb-tabellen/issues/444)) - ([3de655f](https://github.com/hochfrequenz/ahb-tabellen/commit/3de655f02c694ef9b9175487f39893283b668b2d))
- *(deps)* Bump the angular group with 16 updates ([#439](https://github.com/hochfrequenz/ahb-tabellen/issues/439)) - ([9ba0b77](https://github.com/hochfrequenz/ahb-tabellen/commit/9ba0b77071efd44431b271590e8e7ae91e1262f6))
- *(deps-dev)* Bump postcss from 8.5.1 to 8.5.2 ([#448](https://github.com/hochfrequenz/ahb-tabellen/issues/448)) - ([9414ed7](https://github.com/hochfrequenz/ahb-tabellen/commit/9414ed7e50540017e0fac52d9ecba851f6151d67))
- *(deps-dev)* Bump eslint from 9.20.0 to 9.20.1 ([#447](https://github.com/hochfrequenz/ahb-tabellen/issues/447)) - ([86476f3](https://github.com/hochfrequenz/ahb-tabellen/commit/86476f38c8543a2db1621663f2adcafc3c4f08b6))
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.22.0 to 8.23.0 ([#442](https://github.com/hochfrequenz/ahb-tabellen/issues/442)) - ([7abaa1a](https://github.com/hochfrequenz/ahb-tabellen/commit/7abaa1a32d4fc7a3f7ade318aea585eda0f32a53))
- *(deps-dev)* Bump eslint from 9.19.0 to 9.20.0 ([#440](https://github.com/hochfrequenz/ahb-tabellen/issues/440)) - ([225a2a2](https://github.com/hochfrequenz/ahb-tabellen/commit/225a2a255ce26b46327b97ec7da2e212a863418a))
- *(other)* Merge pull request #454 from Hochfrequenz/make-table-head-sticky

style: Make table head sticky - ([306230a](https://github.com/hochfrequenz/ahb-tabellen/commit/306230af298ae0b337ff122d88d785bdf3d4b99d))
- *(other)* Merge remote-tracking branch 'origin/main' into make-table-head-sticky - ([1c54789](https://github.com/hochfrequenz/ahb-tabellen/commit/1c547890a703432daa3e46ec42c92189be20c1f0))
- *(other)* Merge pull request #453 from Hochfrequenz/set-rosa-background-color

style: First round to set the colors right - ([6dd021c](https://github.com/hochfrequenz/ahb-tabellen/commit/6dd021ce5e4b3700f863f655372d4e3073c4d932))
- *(other)* Add comment where the colors come from - ([03eb85a](https://github.com/hochfrequenz/ahb-tabellen/commit/03eb85aa528037dfa0c99662b637de5f87f53090))
- *(other)* Use the same color white in the table header - ([0f330e1](https://github.com/hochfrequenz/ahb-tabellen/commit/0f330e135e195add78f60e6016969841be5aa7f8))
- *(other)* Set footer color to white - ([0cc4599](https://github.com/hochfrequenz/ahb-tabellen/commit/0cc45996b93b934fee476f14514e28e41fe724c3))
- *(other)* Set bg color of table - ([f04a48b](https://github.com/hochfrequenz/ahb-tabellen/commit/f04a48bf6b4218bd99aaf4b894a829ef2d39d72b))
- *(other)* Change bg color for metadata - ([3189e35](https://github.com/hochfrequenz/ahb-tabellen/commit/3189e3547ea6fb6ecfed2b052851c21e42e96fad))
- *(other)* Make table head sticky

The key was to:
Create a proper flex layout with h-screen to ensure full height
Use flex-none for header and footer to keep them fixed size
Make the content area overflow-auto with relative positioning
Apply sticky directly to the table header cells with top-0 - ([f222fe4](https://github.com/hochfrequenz/ahb-tabellen/commit/f222fe46ac314b0745ef91389c4a73b05a11404a))
- *(other)* Merge branch 'main' into set-rosa-background-color - ([5e988c6](https://github.com/hochfrequenz/ahb-tabellen/commit/5e988c601f7d6f5a9e87b7bd200d033c5a70c498))
- *(other)* Make footer sticky - ([3ee7ace](https://github.com/hochfrequenz/ahb-tabellen/commit/3ee7ace1d547e3dd412c51ed86ac35ed2ff1ca8e))
- *(other)* Make header sticky - ([7b1b079](https://github.com/hochfrequenz/ahb-tabellen/commit/7b1b079653408f2357f943afd4997030eca32bee))
- *(other)* Recolor prüfi and formatversion input - ([d167ffd](https://github.com/hochfrequenz/ahb-tabellen/commit/d167ffd41d64142b714fbed074c0fc5e847f809d))
- *(other)* Recolor search input - ([2afe75c](https://github.com/hochfrequenz/ahb-tabellen/commit/2afe75c1327588b2906429f6cca364abe2f2fdee))
- *(other)* Recolor buttons - ([d1d7dc3](https://github.com/hochfrequenz/ahb-tabellen/commit/d1d7dc3c1cec538dd3320adee36553a5bf3e6fc4))
- *(other)* Add off-white - ([29103d5](https://github.com/hochfrequenz/ahb-tabellen/commit/29103d5b3165b012aeef63e0f8a3c43d54e1ffd1))
- *(other)* Set hf-grell-rot for footer - ([2b72b99](https://github.com/hochfrequenz/ahb-tabellen/commit/2b72b99294ce7d842ef98c45ae5cb5eb121e623c))
- *(other)* Set hf-grell-rot for header - ([11bda9d](https://github.com/hochfrequenz/ahb-tabellen/commit/11bda9db61edc7ae977aeae8587096ee2cd62f2f))
- *(other)* Put hf colors in tailwind config - ([7825eba](https://github.com/hochfrequenz/ahb-tabellen/commit/7825eba230c827201ced15694bda6a38dfc11b8e))

### 🚜 Refactor

- Fix Table Not Found Error ([#457](https://github.com/hochfrequenz/ahb-tabellen/issues/457)) - ([808e8d7](https://github.com/hochfrequenz/ahb-tabellen/commit/808e8d7451dfa1ce05ee55e4e95a5fc388ff7ddc))
- Align ahb-landing-page with ahb-table-page ([#456](https://github.com/hochfrequenz/ahb-tabellen/issues/456)) - ([083646c](https://github.com/hochfrequenz/ahb-tabellen/commit/083646c92071514c8cedafaec9be20cf23fd3194))

### 🎨 Styling

- Align Landingpage To Designguide ([#462](https://github.com/hochfrequenz/ahb-tabellen/issues/462)) - ([e66c942](https://github.com/hochfrequenz/ahb-tabellen/commit/e66c9429cef5958e3cc1e5d80fbb8076e36ba30f))
- Align color in link kopiert ([#459](https://github.com/hochfrequenz/ahb-tabellen/issues/459)) - ([1c3f367](https://github.com/hochfrequenz/ahb-tabellen/commit/1c3f367932ad0200ea8d823b685a92d7f08feea9))
- Align Landing Page To Design Guideline ([#458](https://github.com/hochfrequenz/ahb-tabellen/issues/458)) - ([13cf0ac](https://github.com/hochfrequenz/ahb-tabellen/commit/13cf0aca560cbea597eccecf760a1c87fdcab0ca))


## [0.4.5](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.4.4..v0.4.5) - 2025-02-04

### 🐛 Bug Fixes

- *(ui)* Change footer background to dark rose ([#436](https://github.com/hochfrequenz/ahb-tabellen/issues/436)) - ([d4640be](https://github.com/hochfrequenz/ahb-tabellen/commit/d4640be0f33f8f28cd38e63480406c55dbe3c76c))
- *(ui)* Solutions footer in white ([#434](https://github.com/hochfrequenz/ahb-tabellen/issues/434)) - ([77d0b07](https://github.com/hochfrequenz/ahb-tabellen/commit/77d0b07f20bf1dbac435a605785c93a20540aec7))

### 🧹 Other

- *(deps)* Bump node from 23.6-alpine to 23.7-alpine ([#426](https://github.com/hochfrequenz/ahb-tabellen/issues/426)) - ([a24c0e8](https://github.com/hochfrequenz/ahb-tabellen/commit/a24c0e8a622335bc9040fef212e64a2960cfa088))
- *(deps)* Bump the angular group with 11 updates ([#422](https://github.com/hochfrequenz/ahb-tabellen/issues/422)) - ([3ccaa89](https://github.com/hochfrequenz/ahb-tabellen/commit/3ccaa8994cbbfb2d953c0aa25db533b613dcf8f6))
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.21.0 to 8.22.0 ([#424](https://github.com/hochfrequenz/ahb-tabellen/issues/424)) - ([eabdb02](https://github.com/hochfrequenz/ahb-tabellen/commit/eabdb02b5bfcf693a6746fd5e4dbe8d3f6927c55))
- *(deps-dev)* Bump @typescript-eslint/parser from 8.21.0 to 8.22.0 ([#423](https://github.com/hochfrequenz/ahb-tabellen/issues/423)) - ([1d0c226](https://github.com/hochfrequenz/ahb-tabellen/commit/1d0c226608092b3bf7c547e3dfacddbb1e1b6cf8))

### ⚙️ Miscellaneous Tasks

- Bump companystylesheet submodule to latest main ([#435](https://github.com/hochfrequenz/ahb-tabellen/issues/435)) - ([7448866](https://github.com/hochfrequenz/ahb-tabellen/commit/7448866e57c3ec1c840e08be0c33eddb45ce8db0))


## [0.4.4](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.4.3..v0.4.4) - 2025-01-30

### ⛰️ Features

- Display version in footer ([#421](https://github.com/hochfrequenz/ahb-tabellen/issues/421)) - ([d9bb769](https://github.com/hochfrequenz/ahb-tabellen/commit/d9bb7698826cf4c5908fdaa8ad1535f7aa9f420d))


## [0.4.3](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.4.1..v0.4.3) - 2025-01-30

### ⛰️ Features

- Use default format version in dropdown; fix: FV2504 is now in June, not April ([#419](https://github.com/hochfrequenz/ahb-tabellen/issues/419)) - ([44ebfc4](https://github.com/hochfrequenz/ahb-tabellen/commit/44ebfc4d6495d2e1428640ceffe4765853211ee5))


## [0.4.1](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.4.0..v0.4.1) - 2025-01-30

### 🐛 Bug Fixes

- *(UI)* Let footer stay at bottom of page, even when loading, and center loading message ([#417](https://github.com/hochfrequenz/ahb-tabellen/issues/417)) - ([73a13ea](https://github.com/hochfrequenz/ahb-tabellen/commit/73a13eae539e6cd08f2bdec530ccb7d13460532d))

### ⚙️ Miscellaneous Tasks

- Increase form elements' border radius and center components ([#420](https://github.com/hochfrequenz/ahb-tabellen/issues/420)) - ([184b52c](https://github.com/hochfrequenz/ahb-tabellen/commit/184b52cd46cf4f81ae6740ff28f969f04fc59833))


## [0.4.0](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.3.4..v0.4.0) - 2025-01-29

### 🐛 Bug Fixes

- Fix linter error - ([48373d8](https://github.com/hochfrequenz/ahb-tabellen/commit/48373d826353bb0ec1abeca3d231aa29a9d44be2))
- Fix initial suggestion dropdown - ([9df4c4e](https://github.com/hochfrequenz/ahb-tabellen/commit/9df4c4e61b683be1151e6a881136def4aa38e184))
- Fix issue that you can not input text - ([091aef2](https://github.com/hochfrequenz/ahb-tabellen/commit/091aef2d4d8fe5b297591feb6355feae5a953116))

### 🧹 Other

- *(other)* Merge pull request #413 from Hochfrequenz/openapi-adaptions

refactor(format-version endpoint): Use sqlite to provide extended endpoint /api/format-versions/FV2504/pruefis - ([62683e7](https://github.com/hochfrequenz/ahb-tabellen/commit/62683e7924c7c1c73d1ab95215a863574c2bada8))
- *(other)* Add readme with the info how to create ahb.db - ([c0d08fc](https://github.com/hochfrequenz/ahb-tabellen/commit/c0d08fc135d96ae394e4c5712a3bd662c0ec165e))
- *(other)* Merge pull request #414 from Hochfrequenz/another-approach-for-suggestions

refactor(pruefi-suggestion-dropdown): Add Suggestion Dropdown List For Pruefis With Name - ([2df6354](https://github.com/hochfrequenz/ahb-tabellen/commit/2df635432e836de5f8da2a18fad66ad4102dc770))
- *(other)* Use regex pattern for pruefi input - ([b2a8ed9](https://github.com/hochfrequenz/ahb-tabellen/commit/b2a8ed9a6432fd06ee7276ad5f73f59c4c70f381))
- *(other)* Merge pull request #415 from Hochfrequenz/refactor-format-version-endpoint

refactor(format-version-endpoint): Use sqlite data for the list of valid format versions - ([133766d](https://github.com/hochfrequenz/ahb-tabellen/commit/133766d7c81a8ca9bd6071e37bb8c17f45e30115))
- *(other)* Use orderBy instead of sort - ([1c3ed6b](https://github.com/hochfrequenz/ahb-tabellen/commit/1c3ed6bd086016550c1ddfec731c790f62ecc091))
- *(other)* Merge pull request #416 from Hochfrequenz/take-ahblines-from-sqlite

refactor(get-ahblines): Get ahblines from sqlite instead from json files - ([adc238a](https://github.com/hochfrequenz/ahb-tabellen/commit/adc238ac716f8562aa7c628338fca86ca87016c8))
- *(other)* Remove maus_version from code base - ([4698ec8](https://github.com/hochfrequenz/ahb-tabellen/commit/4698ec8faa273e6840e48fb40f926ff12e0fb753))
- *(other)* Add comment where the column comes from - ([e835315](https://github.com/hochfrequenz/ahb-tabellen/commit/e83531557e135d15eb55a8824b7f575219e1f8ad))
- *(other)* Bring back excel download - ([0ab5d67](https://github.com/hochfrequenz/ahb-tabellen/commit/0ab5d678bf6f4779df4786e0d46d806ce51b6172))
- *(other)* Get ahblines from sqlite - ([d3a9e18](https://github.com/hochfrequenz/ahb-tabellen/commit/d3a9e182e487031056a8d34790c944690f0ea53f))
- *(other)* Add ahbline to entities - ([f7fe517](https://github.com/hochfrequenz/ahb-tabellen/commit/f7fe5179bd31cf0a8608898df43e5b3def0b5469))
- *(other)* Add request for format versions - ([2dfb64d](https://github.com/hochfrequenz/ahb-tabellen/commit/2dfb64db7056d5ad76436bec38ea7966c2ede8b5))
- *(other)* Use sqlite data to get list of format versions - ([63831d3](https://github.com/hochfrequenz/ahb-tabellen/commit/63831d3be537004c26644ae47ed122dd4b5950d0))
- *(other)* Add suggestion to pruefi input - ([b9ec1dc](https://github.com/hochfrequenz/ahb-tabellen/commit/b9ec1dc32efda039ba893bf64297a722cf32e363))
- *(other)* Prettier bruno - ([b6d1911](https://github.com/hochfrequenz/ahb-tabellen/commit/b6d1911f927826d3e6002304c3d1145c2c0dccc8))
- *(other)* Merge remote-tracking branch 'origin/openapi-adaptions' into openapi-adaptions - ([197ca93](https://github.com/hochfrequenz/ahb-tabellen/commit/197ca93af5c5e5bd7cd1ed1e0e87c24eabdf89bf))
- *(other)* Npm run ng-openapi-gen - ([ae125ab](https://github.com/hochfrequenz/ahb-tabellen/commit/ae125ab2cbf804d529409bb82b7b52bd09ae4479))
- *(other)* API first: change return type of `/api/format-version/.../pruefis`

to reflect the changes necessary for https://github.com/Hochfrequenz/ahbesser/issues/160 - ([5a60992](https://github.com/hochfrequenz/ahb-tabellen/commit/5a60992451806480a730ea79fc9d8f7ab65c0d5f))
- *(other)* Add temporary sqlite file into server backend

instead of putting it in the blob storage - ([a5fda55](https://github.com/hochfrequenz/ahb-tabellen/commit/a5fda556fc753ac4a528e09bcdd58a8292ab3f8d))
- *(other)* Add bruno data - ([9301395](https://github.com/hochfrequenz/ahb-tabellen/commit/93013959196e072eef4c6891b4ea08b60aa9adf1))
- *(other)* Use ORM and update endpoint - ([576d931](https://github.com/hochfrequenz/ahb-tabellen/commit/576d9316a213f9f0f698b4d05245581c22f8ee65))
- *(other)* Add new dependencies to read sqlite - ([1949cf2](https://github.com/hochfrequenz/ahb-tabellen/commit/1949cf29fe15e917804642d2b039cbcd2d96f5cd))
- *(other)* Npm run ng-openapi-gen - ([c4c3108](https://github.com/hochfrequenz/ahb-tabellen/commit/c4c31082bafca7474db87860d9b22e5aaf976c16))
- *(other)* API first: change return type of `/api/format-version/.../pruefis`

to reflect the changes necessary for https://github.com/Hochfrequenz/ahbesser/issues/160 - ([b4a3d78](https://github.com/hochfrequenz/ahb-tabellen/commit/b4a3d78949fc2597271ce0990bb043965553d52c))

### 📚 Documentation

- *(CD)* Add Deployment Section to README ([#412](https://github.com/hochfrequenz/ahb-tabellen/issues/412)) - ([b74a2f4](https://github.com/hochfrequenz/ahb-tabellen/commit/b74a2f4ced8108c665b73cfc31e4bfa848ecf905))


## [0.3.4](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.3.2..v0.3.4) - 2025-01-28

### 🐛 Bug Fixes

- *(cd)* Use PAT instead of `GITHUB_TOKEN` for submodule checkout ([#407](https://github.com/hochfrequenz/ahb-tabellen/issues/407)) - ([96cd214](https://github.com/hochfrequenz/ahb-tabellen/commit/96cd214189af1287dfb669261df6fdddd833e03f))


## [0.3.2](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.3.1..v0.3.2) - 2025-01-27

### 🐛 Bug Fixes

- Checkout companystylesheet submodule in deploy step ([#406](https://github.com/hochfrequenz/ahb-tabellen/issues/406)) - ([e69eb80](https://github.com/hochfrequenz/ahb-tabellen/commit/e69eb805f9854e43f3500d57ba73f365924ccc49))


## [0.3.1](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.3.0..v0.3.1) - 2025-01-27

### ⛰️ Features

- Add link to self (instead of just other solutions) ([#403](https://github.com/hochfrequenz/ahb-tabellen/issues/403)) - ([f74896a](https://github.com/hochfrequenz/ahb-tabellen/commit/f74896a9ba4b726b9ed02f1ab21da99bd4d5b1a5))

### 🐛 Bug Fixes

- Drop gfonts; load .ttf files from scss, not missing woff2 from css ([#393](https://github.com/hochfrequenz/ahb-tabellen/issues/393)) - ([108c276](https://github.com/hochfrequenz/ahb-tabellen/commit/108c2767f61f7a9c2a1ac0b56c09e9633cddaf06))

### 🧹 Other

- *(deps-dev)* Bump typescript from 5.5.4 to 5.7.3 ([#402](https://github.com/hochfrequenz/ahb-tabellen/issues/402)) - ([a5b5f2c](https://github.com/hochfrequenz/ahb-tabellen/commit/a5b5f2c6c7b9ef93e78a79caded3928770e3459e))

### 📚 Documentation

- Add section for code generation in README ([#405](https://github.com/hochfrequenz/ahb-tabellen/issues/405)) - ([3b61426](https://github.com/hochfrequenz/ahb-tabellen/commit/3b61426eb1031de7477ab83c14fcfcc5a4597dbd))


## [0.3.0](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.2.0..v0.3.0) - 2025-01-26

### ⛰️ Features

- Display EBD deep links if value_pool_entry contains EBD key ([#396](https://github.com/hochfrequenz/ahb-tabellen/issues/396)) - ([5c506c1](https://github.com/hochfrequenz/ahb-tabellen/commit/5c506c16496dd99de1a5272ff5956331fa7666d0))
- Add second (off-white) footer with link to other solutions ([#398](https://github.com/hochfrequenz/ahb-tabellen/issues/398)) - ([2e39462](https://github.com/hochfrequenz/ahb-tabellen/commit/2e39462e134d450276927ffcee134832b9481843))

### 🐛 Bug Fixes

- Rename `getFormatVersion` function to `getFormat` ([#401](https://github.com/hochfrequenz/ahb-tabellen/issues/401)) - ([e3eca84](https://github.com/hochfrequenz/ahb-tabellen/commit/e3eca844cef403068498cfc9c8272c27c197f4ec))
- Remove unused imports ([#400](https://github.com/hochfrequenz/ahb-tabellen/issues/400)) - ([f087b15](https://github.com/hochfrequenz/ahb-tabellen/commit/f087b15f0b061083661fb70213a5da9da5f6ad08))

### 🧹 Other

- *(deps)* Bump the angular group across 1 directory with 15 updates ([#388](https://github.com/hochfrequenz/ahb-tabellen/issues/388)) - ([a958f5e](https://github.com/hochfrequenz/ahb-tabellen/commit/a958f5e658e0f53ff300bb3eaded8aa2d811bccf))
- *(deps)* Bump vite and @angular-devkit/build-angular ([#377](https://github.com/hochfrequenz/ahb-tabellen/issues/377)) - ([1041414](https://github.com/hochfrequenz/ahb-tabellen/commit/1041414066ced22a61b2b72798f2bd39ff3ed949))
- *(deps)* Bump docker/build-push-action from 6.12.0 to 6.13.0 ([#384](https://github.com/hochfrequenz/ahb-tabellen/issues/384)) - ([a17d553](https://github.com/hochfrequenz/ahb-tabellen/commit/a17d5538a3ada3d025b4a92716eb293bb2a81934))
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.20.0 to 8.21.0 ([#386](https://github.com/hochfrequenz/ahb-tabellen/issues/386)) - ([8657fb1](https://github.com/hochfrequenz/ahb-tabellen/commit/8657fb1bfd3db5626bc70c9d29d42056e0ae5af8))
- *(deps-dev)* Bump @typescript-eslint/parser from 8.20.0 to 8.21.0 ([#385](https://github.com/hochfrequenz/ahb-tabellen/issues/385)) - ([9c9be1c](https://github.com/hochfrequenz/ahb-tabellen/commit/9c9be1ce5e2e4319544069d8f332b2dc15aaefed))

### 🚜 Refactor

- *(api)* Refactor interaction with blobstorage ([#390](https://github.com/hochfrequenz/ahb-tabellen/issues/390)) - ([9038a1b](https://github.com/hochfrequenz/ahb-tabellen/commit/9038a1ba1b0670f29634d361c3c1cf98badc76d7))

### ⚙️ Miscellaneous Tasks

- *(design)* Add logout icon and use mdi  ([#392](https://github.com/hochfrequenz/ahb-tabellen/issues/392)) - ([a57ec59](https://github.com/hochfrequenz/ahb-tabellen/commit/a57ec59101eb3041d499d0db48c2dc1147bee37d))
- *(design)* Make kohlrahbi in footer monospace font ([#391](https://github.com/hochfrequenz/ahb-tabellen/issues/391)) - ([4d6689f](https://github.com/hochfrequenz/ahb-tabellen/commit/4d6689f15a4c269a8d5f81f7d6d55187a7df6c9e))
- *(design)* Fix Landingpage ([#389](https://github.com/hochfrequenz/ahb-tabellen/issues/389)) - ([235dfd3](https://github.com/hochfrequenz/ahb-tabellen/commit/235dfd37022b05d65a5b2dd67984223cd6b216f1))
- *(design)* Fix Footer ([#382](https://github.com/hochfrequenz/ahb-tabellen/issues/382)) - ([ab0b460](https://github.com/hochfrequenz/ahb-tabellen/commit/ab0b460101cbcde3a72266ecd6f404cc4ed38cd0))
- Adjust landing page text and remove justification ([#399](https://github.com/hochfrequenz/ahb-tabellen/issues/399)) - ([c380c38](https://github.com/hochfrequenz/ahb-tabellen/commit/c380c38a449933166412aa69be4f22647d889601))
- Bump submodule to prettiered version ([#397](https://github.com/hochfrequenz/ahb-tabellen/issues/397)) - ([14f52c0](https://github.com/hochfrequenz/ahb-tabellen/commit/14f52c010de90ff04f75c30343c4415a70a8f9ef))
- Add environment variable `ebdBaseUrl` to config ([#394](https://github.com/hochfrequenz/ahb-tabellen/issues/394)) - ([93256ec](https://github.com/hochfrequenz/ahb-tabellen/commit/93256ec4cce99c7e9b7e1185d98e41af27de1af8))


## [0.2.0](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.1.1..v0.2.0) - 2025-01-23

### ⚙️ Miscellaneous Tasks

- Switch to Roboto as default font, everywhere ([#380](https://github.com/hochfrequenz/ahb-tabellen/issues/380)) - ([7dca8cd](https://github.com/hochfrequenz/ahb-tabellen/commit/7dca8cdbadf35c35ce98e8d06d3da29677a216bb))


## [0.1.1](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.1.0..v0.1.1) - 2025-01-22

### 📚 Documentation

- Add link to prod URL ([#376](https://github.com/hochfrequenz/ahb-tabellen/issues/376)) - ([4390201](https://github.com/hochfrequenz/ahb-tabellen/commit/43902017f24ac1d328f45350556fe8789d17049f))

### ⚙️ Miscellaneous Tasks

- *(corporate design)* Add "Kontakt" link to footer ([#378](https://github.com/hochfrequenz/ahb-tabellen/issues/378)) - ([f2439ea](https://github.com/hochfrequenz/ahb-tabellen/commit/f2439eaa4ac301d2ad0dc99ae9938cfd40e84b19))


## [0.1.0](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.39..v0.1.0) - 2025-01-22

### 🧹 Other

- *(deps)* Bump docker/build-push-action from 6.11.0 to 6.12.0 ([#369](https://github.com/hochfrequenz/ahb-tabellen/issues/369)) - ([445338f](https://github.com/hochfrequenz/ahb-tabellen/commit/445338f00812deeefa9f51817a65022816306388))
- *(deps)* Bump docker/build-push-action from 6.10.0 to 6.11.0 ([#363](https://github.com/hochfrequenz/ahb-tabellen/issues/363)) - ([32587ba](https://github.com/hochfrequenz/ahb-tabellen/commit/32587bab31cbd035a1ae4d33d5af40a7ac9fdc15))
- *(deps)* Bump node from 23.5-alpine to 23.6-alpine ([#362](https://github.com/hochfrequenz/ahb-tabellen/issues/362)) - ([7d1575c](https://github.com/hochfrequenz/ahb-tabellen/commit/7d1575c1e07374904ed1304a75b783cd6985cb7f))
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.19.0 to 8.20.0 ([#372](https://github.com/hochfrequenz/ahb-tabellen/issues/372)) - ([a7a0584](https://github.com/hochfrequenz/ahb-tabellen/commit/a7a0584455ae59c70e5b1b61f81c8a989510b9ee))
- *(deps-dev)* Bump @typescript-eslint/parser from 8.19.1 to 8.20.0 ([#371](https://github.com/hochfrequenz/ahb-tabellen/issues/371)) - ([7d69935](https://github.com/hochfrequenz/ahb-tabellen/commit/7d699351d9e3bab29aa3eb0b56782c7699b18be1))
- *(deps-dev)* Bump postcss from 8.4.49 to 8.5.1 ([#370](https://github.com/hochfrequenz/ahb-tabellen/issues/370)) - ([d5c96da](https://github.com/hochfrequenz/ahb-tabellen/commit/d5c96da4bfb8ea94ad8d90d284e0ad337c4a820e))
- *(deps-dev)* Bump eslint from 9.17.0 to 9.18.0 ([#367](https://github.com/hochfrequenz/ahb-tabellen/issues/367)) - ([488c9fe](https://github.com/hochfrequenz/ahb-tabellen/commit/488c9fee98a5af64583cfd469d0688ed26a2f5fd))
- *(deps-dev)* Bump jest-preset-angular from 14.4.2 to 14.5.0 ([#366](https://github.com/hochfrequenz/ahb-tabellen/issues/366)) - ([e328490](https://github.com/hochfrequenz/ahb-tabellen/commit/e32849067595594bbaad03223602f7ecf9d49af5))
- *(deps-dev)* Bump ng-mocks from 14.13.1 to 14.13.2 ([#365](https://github.com/hochfrequenz/ahb-tabellen/issues/365)) - ([1002a14](https://github.com/hochfrequenz/ahb-tabellen/commit/1002a146965420424b76f67eacf016237e8f4f3f))
- *(deps-dev)* Bump @typescript-eslint/parser from 8.19.0 to 8.19.1 ([#364](https://github.com/hochfrequenz/ahb-tabellen/issues/364)) - ([35953ce](https://github.com/hochfrequenz/ahb-tabellen/commit/35953ce630d5222bedca8c349fef7bb61b465a3f))

### ⚙️ Miscellaneous Tasks

- *(design)* Switch from SVG heart to unicode ♡ in footer ([#375](https://github.com/hochfrequenz/ahb-tabellen/issues/375)) - ([6de33d6](https://github.com/hochfrequenz/ahb-tabellen/commit/6de33d659be3337afc01eef998c7ba7496870616))


## [0.0.39](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.38..v0.0.39) - 2025-01-11

### ⚙️ Miscellaneous Tasks

- *(stage)* Fix angular build command ([#361](https://github.com/hochfrequenz/ahb-tabellen/issues/361)) - ([c61581f](https://github.com/hochfrequenz/ahb-tabellen/commit/c61581fb1fee5952eb477d0e53bdd0d6c4aa49cb))


## [0.0.38](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.37..v0.0.38) - 2025-01-11

### ⚙️ Miscellaneous Tasks

- Add clientid to version endpoint ([#360](https://github.com/hochfrequenz/ahb-tabellen/issues/360)) - ([09ddee6](https://github.com/hochfrequenz/ahb-tabellen/commit/09ddee6eb0f11eee7f013db0f0c928d5a3fefd9f))


## [0.0.37](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.36..v0.0.37) - 2025-01-11

### ⚙️ Miscellaneous Tasks

- Add environment info to version endpoint ([#359](https://github.com/hochfrequenz/ahb-tabellen/issues/359)) - ([987b359](https://github.com/hochfrequenz/ahb-tabellen/commit/987b35978c29173087c8d0f7df636114a3b92ea6))


## [0.0.36](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.35..v0.0.36) - 2025-01-11

### ⚙️ Miscellaneous Tasks

- *(pulumi)* Set websitesContainerStartTimeLimit ([#358](https://github.com/hochfrequenz/ahb-tabellen/issues/358)) - ([2d5d65a](https://github.com/hochfrequenz/ahb-tabellen/commit/2d5d65aa82d69b82454af135d6ec59f25597104d))


## [0.0.35](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.34..v0.0.35) - 2025-01-10

### ⚙️ Miscellaneous Tasks

- *(azure)* Increase startup time for container in azure ([#357](https://github.com/hochfrequenz/ahb-tabellen/issues/357)) - ([17932d5](https://github.com/hochfrequenz/ahb-tabellen/commit/17932d542c961be6be63209786df92f961109e2e))


## [0.0.34](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.33..v0.0.34) - 2025-01-10

### 🧹 Other

- *(stage)* Add Stage Config ([#355](https://github.com/hochfrequenz/ahb-tabellen/issues/355)) - ([82662d6](https://github.com/hochfrequenz/ahb-tabellen/commit/82662d6691b61dc97438ce4a411a04ea82624b09))

### ⚙️ Miscellaneous Tasks

- *(docker)* Make AHBesser Prod and Stage ready ([#356](https://github.com/hochfrequenz/ahb-tabellen/issues/356)) - ([c2ab334](https://github.com/hochfrequenz/ahb-tabellen/commit/c2ab3348c71dff253e7b88468b00691c04d1c669))


## [0.0.33](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.32..v0.0.33) - 2025-01-09

### 🧹 Other

- *(deps)* Bump dotenv from 16.4.5 to 16.4.7 ([#347](https://github.com/hochfrequenz/ahb-tabellen/issues/347)) - ([7e6d334](https://github.com/hochfrequenz/ahb-tabellen/commit/7e6d334b7008e84381e151718c7c94f72915d177))
- *(deps)* Bump node from 23.4-alpine to 23.5-alpine ([#344](https://github.com/hochfrequenz/ahb-tabellen/issues/344)) - ([cff40d0](https://github.com/hochfrequenz/ahb-tabellen/commit/cff40d0f475a68b9fa9f7e43c659914a8686f9cf))
- *(deps-dev)* Bump @typescript-eslint/parser from 8.18.2 to 8.19.0 ([#353](https://github.com/hochfrequenz/ahb-tabellen/issues/353)) - ([83f230e](https://github.com/hochfrequenz/ahb-tabellen/commit/83f230ebc67ca5955d4d798f9c1093f407048c87))
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.18.2 to 8.19.0 ([#352](https://github.com/hochfrequenz/ahb-tabellen/issues/352)) - ([c26456e](https://github.com/hochfrequenz/ahb-tabellen/commit/c26456ef749537aefff31b0bfe79bdfdf3ed270a))
- *(deps-dev)* Bump concurrently from 9.1.1 to 9.1.2 ([#351](https://github.com/hochfrequenz/ahb-tabellen/issues/351)) - ([b682635](https://github.com/hochfrequenz/ahb-tabellen/commit/b6826358044a4025f799a8ec0649ceed1bc87d88))
- *(deps-dev)* Bump @typescript-eslint/parser from 8.18.1 to 8.18.2 ([#350](https://github.com/hochfrequenz/ahb-tabellen/issues/350)) - ([b822271](https://github.com/hochfrequenz/ahb-tabellen/commit/b822271b394a0638d6c14ff902ac2e5554ba8e70))
- *(deps-dev)* Bump concurrently from 9.1.0 to 9.1.1 ([#348](https://github.com/hochfrequenz/ahb-tabellen/issues/348)) - ([8214bd2](https://github.com/hochfrequenz/ahb-tabellen/commit/8214bd22308f5f5df2320278e2128a8f24e3570b))
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.18.1 to 8.18.2 ([#349](https://github.com/hochfrequenz/ahb-tabellen/issues/349)) - ([eea4afa](https://github.com/hochfrequenz/ahb-tabellen/commit/eea4afa1280ab24eff3924f6d52acde00cc4f97e))
- *(deps-dev)* Bump tailwindcss from 3.4.15 to 3.4.17 ([#346](https://github.com/hochfrequenz/ahb-tabellen/issues/346)) - ([b93ff79](https://github.com/hochfrequenz/ahb-tabellen/commit/b93ff796409abe71e17f48eacb25787cfa1f4e83))
- *(deps-dev)* Bump jest-preset-angular from 14.2.4 to 14.4.2 ([#345](https://github.com/hochfrequenz/ahb-tabellen/issues/345)) - ([8599b7d](https://github.com/hochfrequenz/ahb-tabellen/commit/8599b7de87aaf57d04f86a658f000a58b296fba7))
- *(other)* Add comment for local development and stage env - ([7a4ea9e](https://github.com/hochfrequenz/ahb-tabellen/commit/7a4ea9e310f48b1b21a87e717b08929994490804))
- *(other)* Change auth0 client id for prod environment - ([6372166](https://github.com/hochfrequenz/ahb-tabellen/commit/6372166b19986559a466a01f9f6a141de835ccb8))


## [0.0.32](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.31..v0.0.32) - 2024-12-20

### 🐛 Bug Fixes

- Move auth button into header component ([#341](https://github.com/hochfrequenz/ahb-tabellen/issues/341)) - ([eccb951](https://github.com/hochfrequenz/ahb-tabellen/commit/eccb9513ce8b138f9c298b3ce674d17f9f67ac66))

### 🧹 Other

- *(deps-dev)* Bump eslint from 9.14.0 to 9.17.0 ([#319](https://github.com/hochfrequenz/ahb-tabellen/issues/319)) - ([0f0a84e](https://github.com/hochfrequenz/ahb-tabellen/commit/0f0a84e6d8128297e61fdcddf9b4a39c894e1850))

### ⚙️ Miscellaneous Tasks

- *(octopus)* Accelerate Deployment Process ([#343](https://github.com/hochfrequenz/ahb-tabellen/issues/343)) - ([987b6ea](https://github.com/hochfrequenz/ahb-tabellen/commit/987b6ea20fb2a1d21aae06b9f61d4784914c908f))


## [0.0.31](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.30..v0.0.31) - 2024-12-19

### 🐛 Bug Fixes

- *(Dockerfile)* Dockerfile To Get Build Information Into Version Endpoint ([#340](https://github.com/hochfrequenz/ahb-tabellen/issues/340)) - ([b178558](https://github.com/hochfrequenz/ahb-tabellen/commit/b1785581371efc9caaf470bf782137ba4ff5963b))

### ⚙️ Miscellaneous Tasks

- Skip authentication during local development ([#338](https://github.com/hochfrequenz/ahb-tabellen/issues/338)) - ([3992934](https://github.com/hochfrequenz/ahb-tabellen/commit/3992934a7374eafcdd11d85a8eb2ad8b880c95bc))


## [0.0.30](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.29..v0.0.30) - 2024-12-19

### ⚙️ Miscellaneous Tasks

- *(GH Action)* Use environment variables instead of outputs ([#339](https://github.com/hochfrequenz/ahb-tabellen/issues/339)) - ([b45d1b2](https://github.com/hochfrequenz/ahb-tabellen/commit/b45d1b2f791db6bc0050c7879c53338831e2effe))


## [0.0.29](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.28..v0.0.29) - 2024-12-17

### 🐛 Bug Fixes

- *(auth0)* Add new client id ([#337](https://github.com/hochfrequenz/ahb-tabellen/issues/337)) - ([049c014](https://github.com/hochfrequenz/ahb-tabellen/commit/049c0142e60c3ee0478cdeddbec6573ed805eef7))
- Fix linebreak of collapsible conditions ([#331](https://github.com/hochfrequenz/ahb-tabellen/issues/331)) - ([dfc1c0c](https://github.com/hochfrequenz/ahb-tabellen/commit/dfc1c0c95495c51a6885a01864cf24aaa7909e8a))

### 🧹 Other

- *(other)* Merge pull request #334 from Hochfrequenz/fallback_component

feat: Add Fallback component for an unknown prüfi. - ([91cfb99](https://github.com/hochfrequenz/ahb-tabellen/commit/91cfb99cdf5261a6370a025833ad13d2bf366678))
- *(other)* Merge branch 'main' into fallback_component - ([c454af7](https://github.com/hochfrequenz/ahb-tabellen/commit/c454af7b4a4f07d4eb83c2c86b29a3f0806926f3))
- *(other)* Merge pull request #336 from Hochfrequenz/log_out_ahb_page

feat: add logput/login button to the ahb landingpage and the table view, - ([c584772](https://github.com/hochfrequenz/ahb-tabellen/commit/c584772ea83a50f8199df75fc1d52baa02636137))
- *(other)* Prettier - ([93ee538](https://github.com/hochfrequenz/ahb-tabellen/commit/93ee538d09ac2cda01a8cd60cd153ca3399bc0d2))
- *(other)* Add login/logout button to ahb landing page and ahb table view - ([009e9af](https://github.com/hochfrequenz/ahb-tabellen/commit/009e9afd1bd36772605d0ff351df2924b167412c))
- *(other)* Prettier - ([0f950ad](https://github.com/hochfrequenz/ahb-tabellen/commit/0f950adcc738b464442007d47c6246a228cdd7ef))
- *(other)* Merge branch 'main' into fallback_component - ([c33280d](https://github.com/hochfrequenz/ahb-tabellen/commit/c33280d6d1e3fbbb64623baa4e3cc6a83b3bd6ab))

### ⚙️ Miscellaneous Tasks

- *(octopus)* Update Pulumi For Prod Environment ([#335](https://github.com/hochfrequenz/ahb-tabellen/issues/335)) - ([7657d93](https://github.com/hochfrequenz/ahb-tabellen/commit/7657d935a3d6f6f4a84878f030884e6867864f3d))


## [0.0.28](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.27..v0.0.28) - 2024-12-16

### ⛰️ Features

- Add toggle to wrap and unwrap text in `Bedingung` column ([#326](https://github.com/hochfrequenz/ahb-tabellen/issues/326)) - ([1ea9dea](https://github.com/hochfrequenz/ahb-tabellen/commit/1ea9dea08ad38db97bc4b8b148b250afff6fe4d8))

### 🧹 Other

- *(other)* Merge pull request #325 from Hochfrequenz/raise_not-found

fix: constant mapping in getFormatName - ([4717812](https://github.com/hochfrequenz/ahb-tabellen/commit/471781223e04eb684fdc7a8377eb8de70c9a79d9))

### ⚙️ Miscellaneous Tasks

- *(GH Action)* Fill Version Endpoint with Information ([#330](https://github.com/hochfrequenz/ahb-tabellen/issues/330)) - ([1696a12](https://github.com/hochfrequenz/ahb-tabellen/commit/1696a12256b5e23bd8f5cdca07d4406ea32a1369))
- Use solid line between different `Datenelement` values ([#329](https://github.com/hochfrequenz/ahb-tabellen/issues/329)) - ([84643ba](https://github.com/hochfrequenz/ahb-tabellen/commit/84643ba17e669fb07360316fe8ad1370ec4742eb))
- Add `Impressum` and `Datenschutz` hyperlinks to footer ([#328](https://github.com/hochfrequenz/ahb-tabellen/issues/328)) - ([5ddaf6b](https://github.com/hochfrequenz/ahb-tabellen/commit/5ddaf6bbf946705cf760673542d81aea8dadff2b))


## [0.0.27](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.22..v0.0.27) - 2024-12-16

### 🧹 Other

- *(deps)* Bump node from 23.3-alpine to 23.4-alpine ([#322](https://github.com/hochfrequenz/ahb-tabellen/issues/322)) - ([c81b400](https://github.com/hochfrequenz/ahb-tabellen/commit/c81b400cd626cba39788db556422100bcfd96e4b))
- *(deps)* Bump @azure/storage-blob from 12.25.0 to 12.26.0 ([#320](https://github.com/hochfrequenz/ahb-tabellen/issues/320)) - ([c831b91](https://github.com/hochfrequenz/ahb-tabellen/commit/c831b91631175d6a1b1767b4370470ca7a51589e))
- *(deps)* Bump prettier from 3.3.3 to 3.4.2 ([#318](https://github.com/hochfrequenz/ahb-tabellen/issues/318)) - ([88ccc07](https://github.com/hochfrequenz/ahb-tabellen/commit/88ccc073f58ee33a14de67197fb887337d131948))
- *(other)* Footer in the end of the page - ([bb3cab2](https://github.com/hochfrequenz/ahb-tabellen/commit/bb3cab20367972c562c04e485abf4ba1fe23c4cb))
- *(other)* Add fallback for missing data - ([747ac1d](https://github.com/hochfrequenz/ahb-tabellen/commit/747ac1df176a6ef02183f88d26fe96bc5dd4549b))
- *(other)* Cherry pick fallback component - ([9f71db0](https://github.com/hochfrequenz/ahb-tabellen/commit/9f71db02bad3baebc3dcd6affa481050928a24b6))
- *(other)* Format - ([3a3aa41](https://github.com/hochfrequenz/ahb-tabellen/commit/3a3aa415a7234b9e717ed5fe56d2fdc7092fbcb3))
- *(other)* Use constant mapping in get format name - ([b81b2e9](https://github.com/hochfrequenz/ahb-tabellen/commit/b81b2e95f0cde51701e799b42d73d76858ee4b37))

### ⚙️ Miscellaneous Tasks

- *(octopus)* Fix Octopus Deployment Workflow ([#324](https://github.com/hochfrequenz/ahb-tabellen/issues/324)) - ([23e24cf](https://github.com/hochfrequenz/ahb-tabellen/commit/23e24cf321a3afaad76758b8b2174ec3a40b7b2e))


## [0.0.22](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.18..v0.0.22) - 2024-12-10

### 🧹 Other

- *(deps)* Bump actions/attest-build-provenance from 1 to 2 ([#316](https://github.com/hochfrequenz/ahb-tabellen/issues/316)) - ([b305456](https://github.com/hochfrequenz/ahb-tabellen/commit/b3054564aab976f3c459b3215970ca8849276e94))
- *(deps)* Bump express from 4.21.1 to 4.21.2 ([#314](https://github.com/hochfrequenz/ahb-tabellen/issues/314)) - ([219f753](https://github.com/hochfrequenz/ahb-tabellen/commit/219f753269476681b93e16bab5af679f74f93d69))
- *(deps)* Bump docker/build-push-action from 6.9.0 to 6.10.0 ([#306](https://github.com/hochfrequenz/ahb-tabellen/issues/306)) - ([dcc4273](https://github.com/hochfrequenz/ahb-tabellen/commit/dcc427363647ab9db3e3e2167d7a7d3597111747))
- *(deps)* Bump docker/metadata-action from 5.5.1 to 5.6.1 ([#305](https://github.com/hochfrequenz/ahb-tabellen/issues/305)) - ([c6487b1](https://github.com/hochfrequenz/ahb-tabellen/commit/c6487b13bd1bff9cd9972d3c8d74787377ea4745))
- *(deps)* Bump node from 23.1-alpine to 23.3-alpine ([#304](https://github.com/hochfrequenz/ahb-tabellen/issues/304)) - ([0012be7](https://github.com/hochfrequenz/ahb-tabellen/commit/0012be72d21dc1ef316df6a944fe09d9e3f76ce7))
- *(deps)* Bump the angular group with 11 updates ([#299](https://github.com/hochfrequenz/ahb-tabellen/issues/299)) - ([4f2e497](https://github.com/hochfrequenz/ahb-tabellen/commit/4f2e497b8d7fa1d7b8bbabe7805d0891f97a73a4))
- *(deps)* Bump the angular group with 9 updates ([#294](https://github.com/hochfrequenz/ahb-tabellen/issues/294)) - ([80a7c25](https://github.com/hochfrequenz/ahb-tabellen/commit/80a7c25214e152f07bf5d20dee9d0e905ed3eb72))
- *(deps-dev)* Bump @typescript-eslint/parser from 8.16.0 to 8.17.0 ([#313](https://github.com/hochfrequenz/ahb-tabellen/issues/313)) - ([8ae5554](https://github.com/hochfrequenz/ahb-tabellen/commit/8ae5554c9e2cf40dbb8c39d5c94cd07f0c89e9c2))
- *(deps-dev)* Bump tailwindcss from 3.4.14 to 3.4.15 ([#311](https://github.com/hochfrequenz/ahb-tabellen/issues/311)) - ([278cf51](https://github.com/hochfrequenz/ahb-tabellen/commit/278cf51b74d3cc318ef547aa3ac2c7fb3bdb707d))
- *(deps-dev)* Bump @typescript-eslint/parser from 8.14.0 to 8.16.0 ([#310](https://github.com/hochfrequenz/ahb-tabellen/issues/310)) - ([b6d08a1](https://github.com/hochfrequenz/ahb-tabellen/commit/b6d08a17494331d7116c647977c5e752784451ee))
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.13.0 to 8.14.0 ([#302](https://github.com/hochfrequenz/ahb-tabellen/issues/302)) - ([829dc8a](https://github.com/hochfrequenz/ahb-tabellen/commit/829dc8a7f10097847d573605a569949da89314a9))
- *(deps-dev)* Bump @typescript-eslint/parser from 8.13.0 to 8.14.0 ([#301](https://github.com/hochfrequenz/ahb-tabellen/issues/301)) - ([ef333bd](https://github.com/hochfrequenz/ahb-tabellen/commit/ef333bdbf4932a5ea4093df0266eef515ff3aadd))
- *(deps-dev)* Bump postcss from 8.4.48 to 8.4.49 ([#300](https://github.com/hochfrequenz/ahb-tabellen/issues/300)) - ([b97f8d0](https://github.com/hochfrequenz/ahb-tabellen/commit/b97f8d0b7de78e9b466bd222d9e14c6d2aaeb981))
- *(deps-dev)* Bump @typescript-eslint/parser from 8.11.0 to 8.13.0 ([#296](https://github.com/hochfrequenz/ahb-tabellen/issues/296)) - ([c2517b4](https://github.com/hochfrequenz/ahb-tabellen/commit/c2517b463a0b98725ec6814690f730110c402a36))
- *(deps-dev)* Bump concurrently from 9.0.1 to 9.1.0 ([#298](https://github.com/hochfrequenz/ahb-tabellen/issues/298)) - ([392eb99](https://github.com/hochfrequenz/ahb-tabellen/commit/392eb99a31ff430d3b1f3f3a24946aeed6fe43dd))
- *(deps-dev)* Bump postcss from 8.4.47 to 8.4.48 ([#297](https://github.com/hochfrequenz/ahb-tabellen/issues/297)) - ([c85ccc1](https://github.com/hochfrequenz/ahb-tabellen/commit/c85ccc18d7ce052e4cfbda75179825007ddd6827))
- *(deps-dev)* Bump @typescript-eslint/eslint-plugin from 8.12.2 to 8.13.0 ([#295](https://github.com/hochfrequenz/ahb-tabellen/issues/295)) - ([c829627](https://github.com/hochfrequenz/ahb-tabellen/commit/c829627103185b7d2a43ce057bc0c5f51d0d3900))
- *(other)* Try to fix pulumi ([#317](https://github.com/hochfrequenz/ahb-tabellen/issues/317))

* change pulumi stack name to hochfrequenz/... instead of Hochfrequenz/...

* Update Azure var

* try different deployment target

* use correct var type

* reorder steps

* add shell script to copy repo

---------

Co-authored-by: Joscha Metze <joscha.metze@hochfrequenz.de> - ([5155e14](https://github.com/hochfrequenz/ahb-tabellen/commit/5155e14f9900c291b5b8005e0d5d2f6a8eb2b799))


## [0.0.18](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.17..v0.0.18) - 2024-11-08

### ⚙️ Miscellaneous Tasks

- Further Updates For Octopus Deployment ([#293](https://github.com/hochfrequenz/ahb-tabellen/issues/293)) - ([7c231b4](https://github.com/hochfrequenz/ahb-tabellen/commit/7c231b47f1e740d1c26f0d1217712b15d47c74e1))
- Add variable for pulumi_stack ([#292](https://github.com/hochfrequenz/ahb-tabellen/issues/292)) - ([d4b2090](https://github.com/hochfrequenz/ahb-tabellen/commit/d4b20900a65efd246e47f3fc8455707889c729bc))
- Update deployment process ([#291](https://github.com/hochfrequenz/ahb-tabellen/issues/291)) - ([3d30a9a](https://github.com/hochfrequenz/ahb-tabellen/commit/3d30a9a7e6f76b9a5fefd79dbf12190303194036))


## [0.0.17](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.16..v0.0.17) - 2024-11-07

### ⚙️ Miscellaneous Tasks

- Use tag info for creating release ([#290](https://github.com/hochfrequenz/ahb-tabellen/issues/290)) - ([698d3c3](https://github.com/hochfrequenz/ahb-tabellen/commit/698d3c3f8c51c59aa9d2f077b5ab725c152e6725))


## [0.0.16](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.15..v0.0.16) - 2024-11-07

### ⚙️ Miscellaneous Tasks

- Use Default space from octopus deploy ([#289](https://github.com/hochfrequenz/ahb-tabellen/issues/289)) - ([f76dd0a](https://github.com/hochfrequenz/ahb-tabellen/commit/f76dd0a948af5b77a8f57808302160e3c4c25761))


## [0.0.15](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.14..v0.0.15) - 2024-11-07

### ⚙️ Miscellaneous Tasks

- Use another service account id ([#288](https://github.com/hochfrequenz/ahb-tabellen/issues/288)) - ([3988227](https://github.com/hochfrequenz/ahb-tabellen/commit/3988227effd5cdcfffa2fc3701c440a95993f505))


## [0.0.14](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.13..v0.0.14) - 2024-11-07

### ⚙️ Miscellaneous Tasks

- Put pulumi regarded steps into octopus ([#287](https://github.com/hochfrequenz/ahb-tabellen/issues/287)) - ([8674870](https://github.com/hochfrequenz/ahb-tabellen/commit/867487026d3c226f3b6290fa7d493b472c5b8ff5))
- Switch to pulumi directory ([#286](https://github.com/hochfrequenz/ahb-tabellen/issues/286)) - ([ed3e66e](https://github.com/hochfrequenz/ahb-tabellen/commit/ed3e66eadaa9415a567cd1ce56291a77b4cfc8c0))


## [0.0.13](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.12..v0.0.13) - 2024-11-07

### ⚙️ Miscellaneous Tasks

- Try To Fix Bad Substitution ([#285](https://github.com/hochfrequenz/ahb-tabellen/issues/285)) - ([49cc10c](https://github.com/hochfrequenz/ahb-tabellen/commit/49cc10cea3578bf596ed609914e19edea6059aca))


## [0.0.12](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.11..v0.0.12) - 2024-11-07

### ⚙️ Miscellaneous Tasks

- Fix permissions ([#284](https://github.com/hochfrequenz/ahb-tabellen/issues/284)) - ([3a9bd1e](https://github.com/hochfrequenz/ahb-tabellen/commit/3a9bd1e74759c312f99ff6d5aa9531e8e282c044))


## [0.0.11](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.10..v0.0.11) - 2024-11-07

### ⚙️ Miscellaneous Tasks

- New ci/cd pipeline ([#283](https://github.com/hochfrequenz/ahb-tabellen/issues/283)) - ([a296d7b](https://github.com/hochfrequenz/ahb-tabellen/commit/a296d7bb56075f8ed6f83eae90157ea630c78c94))


## [0.0.10](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.9..v0.0.10) - 2024-11-04

### ⛰️ Features

- 🔐 set up auth0 authentication ([#264](https://github.com/hochfrequenz/ahb-tabellen/issues/264)) - ([579b74a](https://github.com/hochfrequenz/ahb-tabellen/commit/579b74a7066f33262b8f7d2610d8b5580ad10459))

### 🧹 Other

- *(other)* Bump eslint from 9.13.0 to 9.14.0 ([#281](https://github.com/hochfrequenz/ahb-tabellen/issues/281))

Bumps [eslint](https://github.com/eslint/eslint) from 9.13.0 to 9.14.0.
- [Release notes](https://github.com/eslint/eslint/releases)
- [Changelog](https://github.com/eslint/eslint/blob/main/CHANGELOG.md)
- [Commits](https://github.com/eslint/eslint/compare/v9.13.0...v9.14.0)

---
updated-dependencies:
- dependency-name: eslint
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([238127e](https://github.com/hochfrequenz/ahb-tabellen/commit/238127e7ae687fc45c7773518ffa67ed79fe1617))
- *(other)* Bump @typescript-eslint/eslint-plugin from 8.11.0 to 8.12.2 ([#279](https://github.com/hochfrequenz/ahb-tabellen/issues/279))

Bumps [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/eslint-plugin) from 8.11.0 to 8.12.2.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v8.12.2/packages/eslint-plugin)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([5074318](https://github.com/hochfrequenz/ahb-tabellen/commit/507431824b03a4924155774559fc2990144cbca4))
- *(other)* Bump tslib from 2.8.0 to 2.8.1 ([#280](https://github.com/hochfrequenz/ahb-tabellen/issues/280))

Bumps [tslib](https://github.com/Microsoft/tslib) from 2.8.0 to 2.8.1.
- [Release notes](https://github.com/Microsoft/tslib/releases)
- [Commits](https://github.com/Microsoft/tslib/compare/v2.8.0...v2.8.1)

---
updated-dependencies:
- dependency-name: tslib
  dependency-type: direct:production
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([ecd783a](https://github.com/hochfrequenz/ahb-tabellen/commit/ecd783a4f02692bf0699225f6e84bdd2c05ca689))
- *(other)* Bump tsx from 4.19.1 to 4.19.2 ([#278](https://github.com/hochfrequenz/ahb-tabellen/issues/278))

Bumps [tsx](https://github.com/privatenumber/tsx) from 4.19.1 to 4.19.2.
- [Release notes](https://github.com/privatenumber/tsx/releases)
- [Changelog](https://github.com/privatenumber/tsx/blob/master/release.config.cjs)
- [Commits](https://github.com/privatenumber/tsx/compare/v4.19.1...v4.19.2)

---
updated-dependencies:
- dependency-name: tsx
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([99f2157](https://github.com/hochfrequenz/ahb-tabellen/commit/99f215726f0d309b3b67c0cd366ad62d53bfd46e))
- *(other)* Bump the angular group with 11 updates ([#277](https://github.com/hochfrequenz/ahb-tabellen/issues/277))

Bumps the angular group with 11 updates:

| Package | From | To |
| --- | --- | --- |
| [@angular/animations](https://github.com/angular/angular/tree/HEAD/packages/animations) | `18.2.9` | `18.2.10` |
| [@angular/common](https://github.com/angular/angular/tree/HEAD/packages/common) | `18.2.9` | `18.2.10` |
| [@angular/compiler](https://github.com/angular/angular/tree/HEAD/packages/compiler) | `18.2.9` | `18.2.10` |
| [@angular/core](https://github.com/angular/angular/tree/HEAD/packages/core) | `18.2.9` | `18.2.10` |
| [@angular/forms](https://github.com/angular/angular/tree/HEAD/packages/forms) | `18.2.9` | `18.2.10` |
| [@angular/platform-browser](https://github.com/angular/angular/tree/HEAD/packages/platform-browser) | `18.2.9` | `18.2.10` |
| [@angular/platform-browser-dynamic](https://github.com/angular/angular/tree/HEAD/packages/platform-browser-dynamic) | `18.2.9` | `18.2.10` |
| [@angular/router](https://github.com/angular/angular/tree/HEAD/packages/router) | `18.2.9` | `18.2.10` |
| [@angular-devkit/build-angular](https://github.com/angular/angular-cli) | `18.2.10` | `18.2.11` |
| [@angular/cli](https://github.com/angular/angular-cli) | `18.2.10` | `18.2.11` |
| [@angular/compiler-cli](https://github.com/angular/angular/tree/HEAD/packages/compiler-cli) | `18.2.9` | `18.2.10` |


Updates `@angular/animations` from 18.2.9 to 18.2.10
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.10/packages/animations)

Updates `@angular/common` from 18.2.9 to 18.2.10
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.10/packages/common)

Updates `@angular/compiler` from 18.2.9 to 18.2.10
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.10/packages/compiler)

Updates `@angular/core` from 18.2.9 to 18.2.10
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.10/packages/core)

Updates `@angular/forms` from 18.2.9 to 18.2.10
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.10/packages/forms)

Updates `@angular/platform-browser` from 18.2.9 to 18.2.10
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.10/packages/platform-browser)

Updates `@angular/platform-browser-dynamic` from 18.2.9 to 18.2.10
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.10/packages/platform-browser-dynamic)

Updates `@angular/router` from 18.2.9 to 18.2.10
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.10/packages/router)

Updates `@angular-devkit/build-angular` from 18.2.10 to 18.2.11
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.2.10...18.2.11)

Updates `@angular/cli` from 18.2.10 to 18.2.11
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.2.10...18.2.11)

Updates `@angular/compiler-cli` from 18.2.9 to 18.2.10
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.10/packages/compiler-cli)

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([6c8309e](https://github.com/hochfrequenz/ahb-tabellen/commit/6c8309e9529050eba32c4e43e54d7d2d26b47092))
- *(other)* Bump node from 23.0-alpine to 23.1-alpine ([#276](https://github.com/hochfrequenz/ahb-tabellen/issues/276))

Bumps node from 23.0-alpine to 23.1-alpine.

---
updated-dependencies:
- dependency-name: node
  dependency-type: direct:production
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([f432941](https://github.com/hochfrequenz/ahb-tabellen/commit/f432941ef50f96a2f6f76c8b46f27b8544130805))
- *(other)* Bump @types/jest from 29.5.13 to 29.5.14 ([#275](https://github.com/hochfrequenz/ahb-tabellen/issues/275))

Bumps [@types/jest](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/HEAD/types/jest) from 29.5.13 to 29.5.14.
- [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- [Commits](https://github.com/DefinitelyTyped/DefinitelyTyped/commits/HEAD/types/jest)

---
updated-dependencies:
- dependency-name: "@types/jest"
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([70eed70](https://github.com/hochfrequenz/ahb-tabellen/commit/70eed70dec673dabd8a73eee8d530c79d3b7e336))
- *(other)* Bump @typescript-eslint/parser from 8.10.0 to 8.11.0 ([#273](https://github.com/hochfrequenz/ahb-tabellen/issues/273))

Bumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 8.10.0 to 8.11.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v8.11.0/packages/parser)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/parser"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([9909471](https://github.com/hochfrequenz/ahb-tabellen/commit/9909471ab14d6176360330d1a7a453e457222539))
- *(other)* Bump eslint from 9.12.0 to 9.13.0 ([#274](https://github.com/hochfrequenz/ahb-tabellen/issues/274))

Bumps [eslint](https://github.com/eslint/eslint) from 9.12.0 to 9.13.0.
- [Release notes](https://github.com/eslint/eslint/releases)
- [Changelog](https://github.com/eslint/eslint/blob/main/CHANGELOG.md)
- [Commits](https://github.com/eslint/eslint/compare/v9.12.0...v9.13.0)

---
updated-dependencies:
- dependency-name: eslint
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([e95e9b9](https://github.com/hochfrequenz/ahb-tabellen/commit/e95e9b9378e75a3ee9d0ca98b4dcabf2d3d7cdc4))
- *(other)* Bump @typescript-eslint/eslint-plugin from 8.10.0 to 8.11.0 ([#272](https://github.com/hochfrequenz/ahb-tabellen/issues/272))

Bumps [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/eslint-plugin) from 8.10.0 to 8.11.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v8.11.0/packages/eslint-plugin)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([5c35231](https://github.com/hochfrequenz/ahb-tabellen/commit/5c35231b0f86e7886f62faa081ac253a1b6d6574))
- *(other)* Bump the angular group with 16 updates ([#271](https://github.com/hochfrequenz/ahb-tabellen/issues/271))

Bumps the angular group with 16 updates:

| Package | From | To |
| --- | --- | --- |
| [@angular/animations](https://github.com/angular/angular/tree/HEAD/packages/animations) | `18.2.8` | `18.2.9` |
| [@angular/common](https://github.com/angular/angular/tree/HEAD/packages/common) | `18.2.8` | `18.2.9` |
| [@angular/compiler](https://github.com/angular/angular/tree/HEAD/packages/compiler) | `18.2.8` | `18.2.9` |
| [@angular/core](https://github.com/angular/angular/tree/HEAD/packages/core) | `18.2.8` | `18.2.9` |
| [@angular/forms](https://github.com/angular/angular/tree/HEAD/packages/forms) | `18.2.8` | `18.2.9` |
| [@angular/platform-browser](https://github.com/angular/angular/tree/HEAD/packages/platform-browser) | `18.2.8` | `18.2.9` |
| [@angular/platform-browser-dynamic](https://github.com/angular/angular/tree/HEAD/packages/platform-browser-dynamic) | `18.2.8` | `18.2.9` |
| [@angular/router](https://github.com/angular/angular/tree/HEAD/packages/router) | `18.2.8` | `18.2.9` |
| [@angular-devkit/build-angular](https://github.com/angular/angular-cli) | `18.2.9` | `18.2.10` |
| [@angular-eslint/builder](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/builder) | `18.3.1` | `18.4.0` |
| [@angular-eslint/eslint-plugin](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/eslint-plugin) | `18.3.1` | `18.4.0` |
| [@angular-eslint/eslint-plugin-template](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/eslint-plugin-template) | `18.3.1` | `18.4.0` |
| [@angular-eslint/schematics](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/schematics) | `18.3.1` | `18.4.0` |
| [@angular-eslint/template-parser](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/template-parser) | `18.3.1` | `18.4.0` |
| [@angular/cli](https://github.com/angular/angular-cli) | `18.2.9` | `18.2.10` |
| [@angular/compiler-cli](https://github.com/angular/angular/tree/HEAD/packages/compiler-cli) | `18.2.8` | `18.2.9` |


Updates `@angular/animations` from 18.2.8 to 18.2.9
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.9/packages/animations)

Updates `@angular/common` from 18.2.8 to 18.2.9
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.9/packages/common)

Updates `@angular/compiler` from 18.2.8 to 18.2.9
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.9/packages/compiler)

Updates `@angular/core` from 18.2.8 to 18.2.9
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.9/packages/core)

Updates `@angular/forms` from 18.2.8 to 18.2.9
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.9/packages/forms)

Updates `@angular/platform-browser` from 18.2.8 to 18.2.9
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.9/packages/platform-browser)

Updates `@angular/platform-browser-dynamic` from 18.2.8 to 18.2.9
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.9/packages/platform-browser-dynamic)

Updates `@angular/router` from 18.2.8 to 18.2.9
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.9/packages/router)

Updates `@angular-devkit/build-angular` from 18.2.9 to 18.2.10
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.2.9...18.2.10)

Updates `@angular-eslint/builder` from 18.3.1 to 18.4.0
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/builder/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.4.0/packages/builder)

Updates `@angular-eslint/eslint-plugin` from 18.3.1 to 18.4.0
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.4.0/packages/eslint-plugin)

Updates `@angular-eslint/eslint-plugin-template` from 18.3.1 to 18.4.0
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.4.0/packages/eslint-plugin-template)

Updates `@angular-eslint/schematics` from 18.3.1 to 18.4.0
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/schematics/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.4.0/packages/schematics)

Updates `@angular-eslint/template-parser` from 18.3.1 to 18.4.0
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/template-parser/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.4.0/packages/template-parser)

Updates `@angular/cli` from 18.2.9 to 18.2.10
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.2.9...18.2.10)

Updates `@angular/compiler-cli` from 18.2.8 to 18.2.9
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.9/packages/compiler-cli)

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-eslint/builder"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-eslint/eslint-plugin-template"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-eslint/schematics"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-eslint/template-parser"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([43643c4](https://github.com/hochfrequenz/ahb-tabellen/commit/43643c4272112c7d464e9cafac7c906462f5a5c6))
- *(other)* Bump @typescript-eslint/parser from 8.8.1 to 8.10.0 ([#269](https://github.com/hochfrequenz/ahb-tabellen/issues/269))

Bumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 8.8.1 to 8.10.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v8.10.0/packages/parser)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/parser"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([e6539ea](https://github.com/hochfrequenz/ahb-tabellen/commit/e6539eaabf4d8b0fce5221e0ce56987afc2333a6))
- *(other)* Bump tailwindcss from 3.4.13 to 3.4.14 ([#270](https://github.com/hochfrequenz/ahb-tabellen/issues/270))

Bumps [tailwindcss](https://github.com/tailwindlabs/tailwindcss) from 3.4.13 to 3.4.14.
- [Release notes](https://github.com/tailwindlabs/tailwindcss/releases)
- [Changelog](https://github.com/tailwindlabs/tailwindcss/blob/v3.4.14/CHANGELOG.md)
- [Commits](https://github.com/tailwindlabs/tailwindcss/compare/v3.4.13...v3.4.14)

---
updated-dependencies:
- dependency-name: tailwindcss
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([0e07ed2](https://github.com/hochfrequenz/ahb-tabellen/commit/0e07ed20e287053bfe00fb2bd445d4cadcf39f38))
- *(other)* Bump @typescript-eslint/eslint-plugin from 8.8.1 to 8.10.0 ([#268](https://github.com/hochfrequenz/ahb-tabellen/issues/268))

Bumps [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/eslint-plugin) from 8.8.1 to 8.10.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v8.10.0/packages/eslint-plugin)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([ee8bcb5](https://github.com/hochfrequenz/ahb-tabellen/commit/ee8bcb5a5f5c648cef65b179ad4a3c8828fd7d4d))
- *(other)* Bump tslib from 2.7.0 to 2.8.0 ([#267](https://github.com/hochfrequenz/ahb-tabellen/issues/267))

Bumps [tslib](https://github.com/Microsoft/tslib) from 2.7.0 to 2.8.0.
- [Release notes](https://github.com/Microsoft/tslib/releases)
- [Commits](https://github.com/Microsoft/tslib/compare/v2.7.0...v2.8.0)

---
updated-dependencies:
- dependency-name: tslib
  dependency-type: direct:production
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([ccdbf95](https://github.com/hochfrequenz/ahb-tabellen/commit/ccdbf95a94a23b5e136a06e66560caa29a1d87b3))
- *(other)* Bump the angular group with 2 updates ([#266](https://github.com/hochfrequenz/ahb-tabellen/issues/266))

Bumps the angular group with 2 updates: [@angular-devkit/build-angular](https://github.com/angular/angular-cli) and [@angular/cli](https://github.com/angular/angular-cli).


Updates `@angular-devkit/build-angular` from 18.2.8 to 18.2.9
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.2.8...18.2.9)

Updates `@angular/cli` from 18.2.8 to 18.2.9
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.2.8...18.2.9)

---
updated-dependencies:
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([89e4d1a](https://github.com/hochfrequenz/ahb-tabellen/commit/89e4d1ab07ccbe71aa288359a536522453bbe53f))
- *(other)* Bump node from 22.9-alpine to 23.0-alpine ([#265](https://github.com/hochfrequenz/ahb-tabellen/issues/265))

Bumps node from 22.9-alpine to 23.0-alpine.

---
updated-dependencies:
- dependency-name: node
  dependency-type: direct:production
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([33822cd](https://github.com/hochfrequenz/ahb-tabellen/commit/33822cdba3fe66c0cc2534343f5972fbc6930b49))
- *(other)* Bump @typescript-eslint/parser from 8.8.0 to 8.8.1 ([#262](https://github.com/hochfrequenz/ahb-tabellen/issues/262))

Bumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 8.8.0 to 8.8.1.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v8.8.1/packages/parser)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/parser"
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([4feac74](https://github.com/hochfrequenz/ahb-tabellen/commit/4feac7477b0f0104b3b982150126305939442b1a))
- *(other)* Bump express from 4.21.0 to 4.21.1 ([#263](https://github.com/hochfrequenz/ahb-tabellen/issues/263))

Bumps [express](https://github.com/expressjs/express) from 4.21.0 to 4.21.1.
- [Release notes](https://github.com/expressjs/express/releases)
- [Changelog](https://github.com/expressjs/express/blob/4.21.1/History.md)
- [Commits](https://github.com/expressjs/express/compare/4.21.0...4.21.1)

---
updated-dependencies:
- dependency-name: express
  dependency-type: direct:production
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([f035a4c](https://github.com/hochfrequenz/ahb-tabellen/commit/f035a4ca0b8f85003a68714a3d1a9c6b2b65d7bb))
- *(other)* Bump @typescript-eslint/eslint-plugin from 8.8.0 to 8.8.1 ([#261](https://github.com/hochfrequenz/ahb-tabellen/issues/261))

Bumps [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/eslint-plugin) from 8.8.0 to 8.8.1.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v8.8.1/packages/eslint-plugin)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([7663ea2](https://github.com/hochfrequenz/ahb-tabellen/commit/7663ea294be6748bf64d20e51e71d9bd45788c78))
- *(other)* Bump the angular group with 11 updates ([#260](https://github.com/hochfrequenz/ahb-tabellen/issues/260))

Bumps the angular group with 11 updates:

| Package | From | To |
| --- | --- | --- |
| [@angular/animations](https://github.com/angular/angular/tree/HEAD/packages/animations) | `18.2.7` | `18.2.8` |
| [@angular/common](https://github.com/angular/angular/tree/HEAD/packages/common) | `18.2.7` | `18.2.8` |
| [@angular/compiler](https://github.com/angular/angular/tree/HEAD/packages/compiler) | `18.2.7` | `18.2.8` |
| [@angular/core](https://github.com/angular/angular/tree/HEAD/packages/core) | `18.2.7` | `18.2.8` |
| [@angular/forms](https://github.com/angular/angular/tree/HEAD/packages/forms) | `18.2.7` | `18.2.8` |
| [@angular/platform-browser](https://github.com/angular/angular/tree/HEAD/packages/platform-browser) | `18.2.7` | `18.2.8` |
| [@angular/platform-browser-dynamic](https://github.com/angular/angular/tree/HEAD/packages/platform-browser-dynamic) | `18.2.7` | `18.2.8` |
| [@angular/router](https://github.com/angular/angular/tree/HEAD/packages/router) | `18.2.7` | `18.2.8` |
| [@angular-devkit/build-angular](https://github.com/angular/angular-cli) | `18.2.7` | `18.2.8` |
| [@angular/cli](https://github.com/angular/angular-cli) | `18.2.7` | `18.2.8` |
| [@angular/compiler-cli](https://github.com/angular/angular/tree/HEAD/packages/compiler-cli) | `18.2.7` | `18.2.8` |


Updates `@angular/animations` from 18.2.7 to 18.2.8
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.8/packages/animations)

Updates `@angular/common` from 18.2.7 to 18.2.8
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.8/packages/common)

Updates `@angular/compiler` from 18.2.7 to 18.2.8
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.8/packages/compiler)

Updates `@angular/core` from 18.2.7 to 18.2.8
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.8/packages/core)

Updates `@angular/forms` from 18.2.7 to 18.2.8
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.8/packages/forms)

Updates `@angular/platform-browser` from 18.2.7 to 18.2.8
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.8/packages/platform-browser)

Updates `@angular/platform-browser-dynamic` from 18.2.7 to 18.2.8
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.8/packages/platform-browser-dynamic)

Updates `@angular/router` from 18.2.7 to 18.2.8
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.8/packages/router)

Updates `@angular-devkit/build-angular` from 18.2.7 to 18.2.8
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.2.7...18.2.8)

Updates `@angular/cli` from 18.2.7 to 18.2.8
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.2.7...18.2.8)

Updates `@angular/compiler-cli` from 18.2.7 to 18.2.8
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.8/packages/compiler-cli)

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([a90bf57](https://github.com/hochfrequenz/ahb-tabellen/commit/a90bf57c87e0c660982938db30906013624e2438))
- *(other)* Bump docker/build-push-action from 6.8.0 to 6.9.0 ([#259](https://github.com/hochfrequenz/ahb-tabellen/issues/259))

Bumps [docker/build-push-action](https://github.com/docker/build-push-action) from 6.8.0 to 6.9.0.
- [Release notes](https://github.com/docker/build-push-action/releases)
- [Commits](https://github.com/docker/build-push-action/compare/v6.8.0...v6.9.0)

---
updated-dependencies:
- dependency-name: docker/build-push-action
  dependency-type: direct:production
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([627f3a9](https://github.com/hochfrequenz/ahb-tabellen/commit/627f3a929d16f0551ffe863319bf397889cd4c41))
- *(other)* Bump @typescript-eslint/eslint-plugin from 8.7.0 to 8.8.0 ([#258](https://github.com/hochfrequenz/ahb-tabellen/issues/258))

Bumps [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/eslint-plugin) from 8.7.0 to 8.8.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v8.8.0/packages/eslint-plugin)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([56ea279](https://github.com/hochfrequenz/ahb-tabellen/commit/56ea27907442f3074e2e296f0ef4ab9d197ed8e2))
- *(other)* Bump @typescript-eslint/parser from 8.7.0 to 8.8.0 ([#257](https://github.com/hochfrequenz/ahb-tabellen/issues/257))

Bumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 8.7.0 to 8.8.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v8.8.0/packages/parser)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/parser"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([5dbe3b0](https://github.com/hochfrequenz/ahb-tabellen/commit/5dbe3b07a0ba9668ab0d64edb0609305855de691))
- *(other)* Bump eslint from 9.11.1 to 9.12.0 ([#256](https://github.com/hochfrequenz/ahb-tabellen/issues/256))

Bumps [eslint](https://github.com/eslint/eslint) from 9.11.1 to 9.12.0.
- [Release notes](https://github.com/eslint/eslint/releases)
- [Changelog](https://github.com/eslint/eslint/blob/main/CHANGELOG.md)
- [Commits](https://github.com/eslint/eslint/compare/v9.11.1...v9.12.0)

---
updated-dependencies:
- dependency-name: eslint
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([78c54ed](https://github.com/hochfrequenz/ahb-tabellen/commit/78c54ed4bbde7be2fa08580877679ae556deb0d8))
- *(other)* Bump the angular group with 11 updates ([#255](https://github.com/hochfrequenz/ahb-tabellen/issues/255))

Bumps the angular group with 11 updates:

| Package | From | To |
| --- | --- | --- |
| [@angular/animations](https://github.com/angular/angular/tree/HEAD/packages/animations) | `18.2.6` | `18.2.7` |
| [@angular/common](https://github.com/angular/angular/tree/HEAD/packages/common) | `18.2.6` | `18.2.7` |
| [@angular/compiler](https://github.com/angular/angular/tree/HEAD/packages/compiler) | `18.2.6` | `18.2.7` |
| [@angular/core](https://github.com/angular/angular/tree/HEAD/packages/core) | `18.2.6` | `18.2.7` |
| [@angular/forms](https://github.com/angular/angular/tree/HEAD/packages/forms) | `18.2.6` | `18.2.7` |
| [@angular/platform-browser](https://github.com/angular/angular/tree/HEAD/packages/platform-browser) | `18.2.6` | `18.2.7` |
| [@angular/platform-browser-dynamic](https://github.com/angular/angular/tree/HEAD/packages/platform-browser-dynamic) | `18.2.6` | `18.2.7` |
| [@angular/router](https://github.com/angular/angular/tree/HEAD/packages/router) | `18.2.6` | `18.2.7` |
| [@angular-devkit/build-angular](https://github.com/angular/angular-cli) | `18.2.6` | `18.2.7` |
| [@angular/cli](https://github.com/angular/angular-cli) | `18.2.6` | `18.2.7` |
| [@angular/compiler-cli](https://github.com/angular/angular/tree/HEAD/packages/compiler-cli) | `18.2.6` | `18.2.7` |


Updates `@angular/animations` from 18.2.6 to 18.2.7
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.7/packages/animations)

Updates `@angular/common` from 18.2.6 to 18.2.7
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.7/packages/common)

Updates `@angular/compiler` from 18.2.6 to 18.2.7
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.7/packages/compiler)

Updates `@angular/core` from 18.2.6 to 18.2.7
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.7/packages/core)

Updates `@angular/forms` from 18.2.6 to 18.2.7
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.7/packages/forms)

Updates `@angular/platform-browser` from 18.2.6 to 18.2.7
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.7/packages/platform-browser)

Updates `@angular/platform-browser-dynamic` from 18.2.6 to 18.2.7
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.7/packages/platform-browser-dynamic)

Updates `@angular/router` from 18.2.6 to 18.2.7
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.7/packages/router)

Updates `@angular-devkit/build-angular` from 18.2.6 to 18.2.7
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.2.6...18.2.7)

Updates `@angular/cli` from 18.2.6 to 18.2.7
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.2.6...18.2.7)

Updates `@angular/compiler-cli` from 18.2.6 to 18.2.7
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.7/packages/compiler-cli)

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([91217d4](https://github.com/hochfrequenz/ahb-tabellen/commit/91217d4027d889b4fe4ff5061fd3894e1e96e1bc))
- *(other)* Improve footer layout and text ([#252](https://github.com/hochfrequenz/ahb-tabellen/issues/252))

* improve footer layout and text

* bring back heroicon

* apply prettier

* add more icons

* switch position of datenschutz and impressum

* apply prettier - ([d42cc40](https://github.com/hochfrequenz/ahb-tabellen/commit/d42cc400079e8b5c77ce54e200cfcc1029cbc11b))

### ⚙️ Miscellaneous Tasks

- *(check conventional commits)* Add Check For Conventional Commits ([#253](https://github.com/hochfrequenz/ahb-tabellen/issues/253)) - ([3348f47](https://github.com/hochfrequenz/ahb-tabellen/commit/3348f4741b0ef8f3f79df8fc53ce38adeaca35d3))


## [0.0.9](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.8..v0.0.9) - 2024-09-30

### 🧹 Other

- *(other)* 🔄 Refresh table and URL upon format version change ([#249](https://github.com/hochfrequenz/ahb-tabellen/issues/249))

Refresh table and URL upon format version change - ([e8394c2](https://github.com/hochfrequenz/ahb-tabellen/commit/e8394c2ed2c3692569eae6e7e9b9c33b0c620ea9))
- *(other)* Bump pulumi version 0.0.9 ([#250](https://github.com/hochfrequenz/ahb-tabellen/issues/250)) - ([25bfacf](https://github.com/hochfrequenz/ahb-tabellen/commit/25bfacfe3caa097bcb1a173106a61a1ce8b576e2))
- *(other)* Fix auto scrolling through highlighted search matches ([#243](https://github.com/hochfrequenz/ahb-tabellen/issues/243))

* Use computed signals and fix highlight behavior

* Fix auto scrolling through search highlights

* Remove effect causing signal write errors - ([6cc8c50](https://github.com/hochfrequenz/ahb-tabellen/commit/6cc8c509df7c210426613ae2f00199700725bad8))
- *(other)* Bump docker/build-push-action from 6.7.0 to 6.8.0 ([#247](https://github.com/hochfrequenz/ahb-tabellen/issues/247))

Bumps [docker/build-push-action](https://github.com/docker/build-push-action) from 6.7.0 to 6.8.0.
- [Release notes](https://github.com/docker/build-push-action/releases)
- [Commits](https://github.com/docker/build-push-action/compare/v6.7.0...v6.8.0)

---
updated-dependencies:
- dependency-name: docker/build-push-action
  dependency-type: direct:production
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([5be0660](https://github.com/hochfrequenz/ahb-tabellen/commit/5be066001a8232d11e80af54be584c7b2cfbd077))
- *(other)* Bump eslint from 9.11.0 to 9.11.1 ([#246](https://github.com/hochfrequenz/ahb-tabellen/issues/246))

Bumps [eslint](https://github.com/eslint/eslint) from 9.11.0 to 9.11.1.
- [Release notes](https://github.com/eslint/eslint/releases)
- [Changelog](https://github.com/eslint/eslint/blob/main/CHANGELOG.md)
- [Commits](https://github.com/eslint/eslint/compare/v9.11.0...v9.11.1)

---
updated-dependencies:
- dependency-name: eslint
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([6a970a2](https://github.com/hochfrequenz/ahb-tabellen/commit/6a970a2c9a221c0cf7f16693df3f4ef078f9b92e))


## [0.0.8](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.7..v0.0.8) - 2024-09-27

### 🧹 Other

- *(other)* 🩹 Handle empty direction meta information ([#240](https://github.com/hochfrequenz/ahb-tabellen/issues/240))

* Make direction meta information nullable

* Format

* Bump version to v0.0.8

* Add text if the direction is empty

* update unit test

* add pulumi to prettierignore

* apply prettier

---------

Co-authored-by: kevin <kevin.krechan@hochfrequenz.de> - ([f202681](https://github.com/hochfrequenz/ahb-tabellen/commit/f2026815766bdebb410ea52caeaa0e98297cca10))
- *(other)* 🗓️ Add dates to formatversion <select> options ([#238](https://github.com/hochfrequenz/ahb-tabellen/issues/238))

* Add dates to formatversion <select> options

* Remove future dates - ([2ae1e01](https://github.com/hochfrequenz/ahb-tabellen/commit/2ae1e0131acacdda8f9a825ee68809af0409a384))
- *(other)* ✨ Add scroll hijacking to hide meta information on ahb-page ([#237](https://github.com/hochfrequenz/ahb-tabellen/issues/237))

* Make meta information scrolling out of viewport and table sticky

* why is this still in here? - ([701545a](https://github.com/hochfrequenz/ahb-tabellen/commit/701545a691a3dc716b26b749361747e8512295a4))
- *(other)* Fix Upload Document Script ([#239](https://github.com/hochfrequenz/ahb-tabellen/issues/239))

* add INSRPT to the edifactFormats list

* Refactor createBlobServiceClient function

* update submodule

* prettier

---------

Co-authored-by: olli <info@oliverlahr.de> - ([6fe8dac](https://github.com/hochfrequenz/ahb-tabellen/commit/6fe8dac792cfe2aead5f9f5e7a57fdf78f53a67f))
- *(other)* ↩️ Add linebreaks for conditions in ahb-table ([#235](https://github.com/hochfrequenz/ahb-tabellen/issues/235))

Add linebreaks for conditions in ahb-table - ([374f016](https://github.com/hochfrequenz/ahb-tabellen/commit/374f016013a491ed378c334ace53841b9d98bc58))
- *(other)* Bump the angular group with 11 updates ([#226](https://github.com/hochfrequenz/ahb-tabellen/issues/226))

* Bump the angular group with 11 updates

Bumps the angular group with 11 updates:

| Package | From | To |
| --- | --- | --- |
| [@angular/animations](https://github.com/angular/angular/tree/HEAD/packages/animations) | `18.2.5` | `18.2.6` |
| [@angular/common](https://github.com/angular/angular/tree/HEAD/packages/common) | `18.2.5` | `18.2.6` |
| [@angular/compiler](https://github.com/angular/angular/tree/HEAD/packages/compiler) | `18.2.5` | `18.2.6` |
| [@angular/core](https://github.com/angular/angular/tree/HEAD/packages/core) | `18.2.5` | `18.2.6` |
| [@angular/forms](https://github.com/angular/angular/tree/HEAD/packages/forms) | `18.2.5` | `18.2.6` |
| [@angular/platform-browser](https://github.com/angular/angular/tree/HEAD/packages/platform-browser) | `18.2.5` | `18.2.6` |
| [@angular/platform-browser-dynamic](https://github.com/angular/angular/tree/HEAD/packages/platform-browser-dynamic) | `18.2.5` | `18.2.6` |
| [@angular/router](https://github.com/angular/angular/tree/HEAD/packages/router) | `18.2.5` | `18.2.6` |
| [@angular-devkit/build-angular](https://github.com/angular/angular-cli) | `18.2.5` | `18.2.6` |
| [@angular/cli](https://github.com/angular/angular-cli) | `18.2.5` | `18.2.6` |
| [@angular/compiler-cli](https://github.com/angular/angular/tree/HEAD/packages/compiler-cli) | `18.2.5` | `18.2.6` |


Updates `@angular/animations` from 18.2.5 to 18.2.6
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.6/packages/animations)

Updates `@angular/common` from 18.2.5 to 18.2.6
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.6/packages/common)

Updates `@angular/compiler` from 18.2.5 to 18.2.6
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.6/packages/compiler)

Updates `@angular/core` from 18.2.5 to 18.2.6
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.6/packages/core)

Updates `@angular/forms` from 18.2.5 to 18.2.6
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.6/packages/forms)

Updates `@angular/platform-browser` from 18.2.5 to 18.2.6
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.6/packages/platform-browser)

Updates `@angular/platform-browser-dynamic` from 18.2.5 to 18.2.6
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.6/packages/platform-browser-dynamic)

Updates `@angular/router` from 18.2.5 to 18.2.6
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.6/packages/router)

Updates `@angular-devkit/build-angular` from 18.2.5 to 18.2.6
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.2.5...18.2.6)

Updates `@angular/cli` from 18.2.5 to 18.2.6
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.2.5...18.2.6)

Updates `@angular/compiler-cli` from 18.2.5 to 18.2.6
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.6/packages/compiler-cli)

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>

* provide type annotation for router

---------

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
Co-authored-by: olli <info@oliverlahr.de> - ([ebccdb1](https://github.com/hochfrequenz/ahb-tabellen/commit/ebccdb132bbaff01418934906df9c452824e9a10))
- *(other)* 🩹 Trigger auto search and prevent page from loading incomplete pruefids ([#233](https://github.com/hochfrequenz/ahb-tabellen/issues/233))

* Trigger auto search and prevent page from loading incomplete pruefids

* Fix regex and missing placeholder - ([7e3aaba](https://github.com/hochfrequenz/ahb-tabellen/commit/7e3aabae0ccc3e04ad9436f821bc37d202731505))
- *(other)* 🗺️ Fix pruefid 44 and 55 UTILMD mapping ([#232](https://github.com/hochfrequenz/ahb-tabellen/issues/232))

Map 44 and 55 pruefid to UTILMD - ([9318e65](https://github.com/hochfrequenz/ahb-tabellen/commit/9318e654d6bec12d1245254014a6c18bca3d1793))


## [0.0.7](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.6..v0.0.7) - 2024-09-26

### 🧹 Other

- *(other)* Bump @typescript-eslint/parser from 8.6.0 to 8.7.0 ([#228](https://github.com/hochfrequenz/ahb-tabellen/issues/228))

Bumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 8.6.0 to 8.7.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v8.7.0/packages/parser)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/parser"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([2d645e6](https://github.com/hochfrequenz/ahb-tabellen/commit/2d645e61ea96a06a6ced541391d7a4d21c244bdb))
- *(other)* Bump @azure/storage-blob from 12.24.0 to 12.25.0 ([#230](https://github.com/hochfrequenz/ahb-tabellen/issues/230))

Bumps [@azure/storage-blob](https://github.com/Azure/azure-sdk-for-js) from 12.24.0 to 12.25.0.
- [Release notes](https://github.com/Azure/azure-sdk-for-js/releases)
- [Changelog](https://github.com/Azure/azure-sdk-for-js/blob/main/documentation/Changelog-for-next-generation.md)
- [Commits](https://github.com/Azure/azure-sdk-for-js/compare/@azure/storage-blob_12.24.0...@azure/storage-blob_12.25.0)

---
updated-dependencies:
- dependency-name: "@azure/storage-blob"
  dependency-type: direct:production
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([6a158c7](https://github.com/hochfrequenz/ahb-tabellen/commit/6a158c77498b0f108373f120f6d1e71c29c699db))
- *(other)* Bump tailwindcss from 3.4.12 to 3.4.13 ([#229](https://github.com/hochfrequenz/ahb-tabellen/issues/229))

Bumps [tailwindcss](https://github.com/tailwindlabs/tailwindcss) from 3.4.12 to 3.4.13.
- [Release notes](https://github.com/tailwindlabs/tailwindcss/releases)
- [Changelog](https://github.com/tailwindlabs/tailwindcss/blob/v3.4.13/CHANGELOG.md)
- [Commits](https://github.com/tailwindlabs/tailwindcss/compare/v3.4.12...v3.4.13)

---
updated-dependencies:
- dependency-name: tailwindcss
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([8dabca3](https://github.com/hochfrequenz/ahb-tabellen/commit/8dabca354bf5eed1cc127e534a86efa407fa914a))
- *(other)* Bump @typescript-eslint/eslint-plugin from 8.6.0 to 8.7.0 ([#227](https://github.com/hochfrequenz/ahb-tabellen/issues/227))

Bumps [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/eslint-plugin) from 8.6.0 to 8.7.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v8.7.0/packages/eslint-plugin)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([e4a6f8e](https://github.com/hochfrequenz/ahb-tabellen/commit/e4a6f8e84dfb2f809bf7ee7bdc1b6704e4a403fa))
- *(other)* 🔗 Add deeplinks to bedingungsbaum ([#223](https://github.com/hochfrequenz/ahb-tabellen/issues/223))

* Add expression deeplinks to bedingungsbaum

* Make only segment/_group /_name bold in first row of new segment

* Use bedingungsbaumBaseUrl environment variable instead of hard-coded URL

* Add bedingungsbaumBasreUrl (stage) to pulumi dev config

* Rename `Pulumi.dev.yaml` to `Pulumi.stage.yaml`

* Revert 534fa82 - ([a63440d](https://github.com/hochfrequenz/ahb-tabellen/commit/a63440db375708b1e807a6af7cce1e7f7d7f478b))
- *(other)* Bump version to 0.0.7 ([#225](https://github.com/hochfrequenz/ahb-tabellen/issues/225)) - ([5082814](https://github.com/hochfrequenz/ahb-tabellen/commit/50828140c7c8630660cac0c81c4ea55c8b304ee0))
- *(other)* 🩹 Limit pruefid input to 5 digits and disable special characters ([#224](https://github.com/hochfrequenz/ahb-tabellen/issues/224))

Limit pruefid input to 5 digits and disable special characters - ([ab3cc5e](https://github.com/hochfrequenz/ahb-tabellen/commit/ab3cc5ece40930579afbab8f0ab02fd86a507cce))
- *(other)* Bump image version to v0.0.6 ([#220](https://github.com/hochfrequenz/ahb-tabellen/issues/220))

bump image version - ([4fdfafd](https://github.com/hochfrequenz/ahb-tabellen/commit/4fdfafd595c6fbc9c44988be6eeba52a6d0aa489))
- *(other)* 💅 Add default horizontal line below each row ([#221](https://github.com/hochfrequenz/ahb-tabellen/issues/221))

* Add default horizontal line below each row

* Return solid top border only if data_elements are equivalent - ([437258a](https://github.com/hochfrequenz/ahb-tabellen/commit/437258a64e28cf28c1f55f75d708e8153adc9daf))
- *(other)* 💅 Make ahb-page footer sticky ([#222](https://github.com/hochfrequenz/ahb-tabellen/issues/222))

Make ahb-page footer sticky - ([3a20ff5](https://github.com/hochfrequenz/ahb-tabellen/commit/3a20ff5d565d58ccc1b5588f60db86dfdc6e6406))


## [0.0.6](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.5..v0.0.6) - 2024-09-24

### 🧹 Other

- *(other)* 💫 Add AHB-style rules to improve table readability ([#219](https://github.com/hochfrequenz/ahb-tabellen/issues/219))

* Add bold horizontal line each time the `segment_name` changes

* Add dashed line each time the `daten_element` changes

* Make text in first row of each new segment bold - ([baf64bb](https://github.com/hochfrequenz/ahb-tabellen/commit/baf64bbd8c7790136c295b7c62f3e10d3c88e1e1))
- *(other)* 🐛 Fix export function downloading json instead of xlsx ([#218](https://github.com/hochfrequenz/ahb-tabellen/issues/218))

* Distinguish between different file types for backend queries

* Update azure-mock submodule

* Linter

* Remove unnecessary catch block

* Return ahb or buffer object for json or binary files respectively - ([7f14de8](https://github.com/hochfrequenz/ahb-tabellen/commit/7f14de8fe17ff57f4ea6d936331ab1b5c06cf540))
- *(other)* Bump eslint from 9.10.0 to 9.11.0 ([#217](https://github.com/hochfrequenz/ahb-tabellen/issues/217))

Bumps [eslint](https://github.com/eslint/eslint) from 9.10.0 to 9.11.0.
- [Release notes](https://github.com/eslint/eslint/releases)
- [Changelog](https://github.com/eslint/eslint/blob/main/CHANGELOG.md)
- [Commits](https://github.com/eslint/eslint/compare/v9.10.0...v9.11.0)

---
updated-dependencies:
- dependency-name: eslint
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([de4bfe4](https://github.com/hochfrequenz/ahb-tabellen/commit/de4bfe4d10182a3dd5f71ecbe3e3a5886a4307c0))
- *(other)* Bump tailwindcss from 3.4.10 to 3.4.12 ([#216](https://github.com/hochfrequenz/ahb-tabellen/issues/216))

Bumps [tailwindcss](https://github.com/tailwindlabs/tailwindcss) from 3.4.10 to 3.4.12.
- [Release notes](https://github.com/tailwindlabs/tailwindcss/releases)
- [Changelog](https://github.com/tailwindlabs/tailwindcss/blob/v3.4.12/CHANGELOG.md)
- [Commits](https://github.com/tailwindlabs/tailwindcss/compare/v3.4.10...v3.4.12)

---
updated-dependencies:
- dependency-name: tailwindcss
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([a56dd5d](https://github.com/hochfrequenz/ahb-tabellen/commit/a56dd5dab3e143a1c9ffaf15cee955eea544baaa))
- *(other)* Bump the angular group with 11 updates ([#215](https://github.com/hochfrequenz/ahb-tabellen/issues/215))

Bumps the angular group with 11 updates:

| Package | From | To |
| --- | --- | --- |
| [@angular/animations](https://github.com/angular/angular/tree/HEAD/packages/animations) | `18.2.4` | `18.2.5` |
| [@angular/common](https://github.com/angular/angular/tree/HEAD/packages/common) | `18.2.4` | `18.2.5` |
| [@angular/compiler](https://github.com/angular/angular/tree/HEAD/packages/compiler) | `18.2.4` | `18.2.5` |
| [@angular/core](https://github.com/angular/angular/tree/HEAD/packages/core) | `18.2.4` | `18.2.5` |
| [@angular/forms](https://github.com/angular/angular/tree/HEAD/packages/forms) | `18.2.4` | `18.2.5` |
| [@angular/platform-browser](https://github.com/angular/angular/tree/HEAD/packages/platform-browser) | `18.2.4` | `18.2.5` |
| [@angular/platform-browser-dynamic](https://github.com/angular/angular/tree/HEAD/packages/platform-browser-dynamic) | `18.2.4` | `18.2.5` |
| [@angular/router](https://github.com/angular/angular/tree/HEAD/packages/router) | `18.2.4` | `18.2.5` |
| [@angular-devkit/build-angular](https://github.com/angular/angular-cli) | `18.2.4` | `18.2.5` |
| [@angular/cli](https://github.com/angular/angular-cli) | `18.2.4` | `18.2.5` |
| [@angular/compiler-cli](https://github.com/angular/angular/tree/HEAD/packages/compiler-cli) | `18.2.4` | `18.2.5` |


Updates `@angular/animations` from 18.2.4 to 18.2.5
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.5/packages/animations)

Updates `@angular/common` from 18.2.4 to 18.2.5
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.5/packages/common)

Updates `@angular/compiler` from 18.2.4 to 18.2.5
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.5/packages/compiler)

Updates `@angular/core` from 18.2.4 to 18.2.5
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.5/packages/core)

Updates `@angular/forms` from 18.2.4 to 18.2.5
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.5/packages/forms)

Updates `@angular/platform-browser` from 18.2.4 to 18.2.5
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.5/packages/platform-browser)

Updates `@angular/platform-browser-dynamic` from 18.2.4 to 18.2.5
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.5/packages/platform-browser-dynamic)

Updates `@angular/router` from 18.2.4 to 18.2.5
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.5/packages/router)

Updates `@angular-devkit/build-angular` from 18.2.4 to 18.2.5
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.2.4...18.2.5)

Updates `@angular/cli` from 18.2.4 to 18.2.5
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.2.4...18.2.5)

Updates `@angular/compiler-cli` from 18.2.4 to 18.2.5
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.5/packages/compiler-cli)

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([182c870](https://github.com/hochfrequenz/ahb-tabellen/commit/182c87096d2195c6563274d0eab8e140d327e46d))
- *(other)* Bump node from 22.8-alpine to 22.9-alpine ([#214](https://github.com/hochfrequenz/ahb-tabellen/issues/214))

Bumps node from 22.8-alpine to 22.9-alpine.

---
updated-dependencies:
- dependency-name: node
  dependency-type: direct:production
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([03ad907](https://github.com/hochfrequenz/ahb-tabellen/commit/03ad9075b7558ef5e2fcbf1d42753a91c91d6946))
- *(other)* 🩹 Fix URL not automatically highlighting and scrolling to search queries ([#213](https://github.com/hochfrequenz/ahb-tabellen/issues/213))

* Highlight search query keywords automatically

* Scroll to the first matching search query automatically

* Add searchquery to ahb page html

* Mock active route in the ahb-page component test - ([fc100b4](https://github.com/hochfrequenz/ahb-tabellen/commit/fc100b4a5d027b82023cb107dd27b1b7701ea1c9))


## [0.0.5](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.4..v0.0.5) - 2024-09-18

### 🧹 Other

- *(other)* Bump version to 0.0.5 ([#210](https://github.com/hochfrequenz/ahb-tabellen/issues/210)) - ([7834d5d](https://github.com/hochfrequenz/ahb-tabellen/commit/7834d5d356ee80fd177e57a2c84eee5b3e27b552))
- *(other)* Add URL query Parameter support for search functionality ([#109](https://github.com/hochfrequenz/ahb-tabellen/issues/109))

* add URL query Parameter support for search functionality

* prettier

* Provide mock implementations for `ActivatedRoute` and routers

---------

Co-authored-by: olli <144932831+OLILHR@users.noreply.github.com>
Co-authored-by: kevin <68426071+hf-krechan@users.noreply.github.com> - ([c431219](https://github.com/hochfrequenz/ahb-tabellen/commit/c431219144b7d321b0806a033b15499089c2bcb3))
- *(other)* ✨ Add component to export AHB tables as xlsx ([#103](https://github.com/hochfrequenz/ahb-tabellen/issues/103))

* Add download button component

* Fix export button offset

* Add API endpoint with query parameters to export AHBs as json/xlsx/csv

* Regenerate api

* Apply new getAhb$Json method call

* Add mock implementations for all new methods to ahb-page test

* Add export functionality to xlsx download component

* Add test for button onClick() event

* Use Promises instead of Observables

Co-authored-by: Maxim Uhlemann <maxim.uhlemann@gmail.com>

* Import firstValueFrom and format

* Mock URL.createObjectURL

* Remove unused mocks functions

---------

Co-authored-by: Maxim Uhlemann <maxim.uhlemann@gmail.com> - ([a2b2854](https://github.com/hochfrequenz/ahb-tabellen/commit/a2b2854a686a929f942904370ebd3e8fa733a5c8))
- *(other)* Bump @typescript-eslint/eslint-plugin from 8.4.0 to 8.6.0 ([#206](https://github.com/hochfrequenz/ahb-tabellen/issues/206))

Bumps [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/eslint-plugin) from 8.4.0 to 8.6.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v8.6.0/packages/eslint-plugin)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([1c2f55c](https://github.com/hochfrequenz/ahb-tabellen/commit/1c2f55c220285c9bdee396d0c9d05d65091e3096))
- *(other)* Bump @typescript-eslint/parser from 8.3.0 to 8.6.0 ([#208](https://github.com/hochfrequenz/ahb-tabellen/issues/208))

Bumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 8.3.0 to 8.6.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v8.6.0/packages/parser)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/parser"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([e520898](https://github.com/hochfrequenz/ahb-tabellen/commit/e520898b5cc44612c2a51901947d668bfcf4dcce))
- *(other)* Bump tsx from 4.19.0 to 4.19.1 ([#209](https://github.com/hochfrequenz/ahb-tabellen/issues/209))

Bumps [tsx](https://github.com/privatenumber/tsx) from 4.19.0 to 4.19.1.
- [Release notes](https://github.com/privatenumber/tsx/releases)
- [Changelog](https://github.com/privatenumber/tsx/blob/master/release.config.cjs)
- [Commits](https://github.com/privatenumber/tsx/compare/v4.19.0...v4.19.1)

---
updated-dependencies:
- dependency-name: tsx
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([272a778](https://github.com/hochfrequenz/ahb-tabellen/commit/272a77805f09cc1a38a9528cfb59f7651dabf6ed))
- *(other)* Bump @types/jest from 29.5.12 to 29.5.13 ([#207](https://github.com/hochfrequenz/ahb-tabellen/issues/207))

Bumps [@types/jest](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/HEAD/types/jest) from 29.5.12 to 29.5.13.
- [Release notes](https://github.com/DefinitelyTyped/DefinitelyTyped/releases)
- [Commits](https://github.com/DefinitelyTyped/DefinitelyTyped/commits/HEAD/types/jest)

---
updated-dependencies:
- dependency-name: "@types/jest"
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([9f47ae6](https://github.com/hochfrequenz/ahb-tabellen/commit/9f47ae61ffade86913d304ba8298919d73519d36))
- *(other)* Bump eslint from 9.9.1 to 9.10.0 ([#205](https://github.com/hochfrequenz/ahb-tabellen/issues/205))

Bumps [eslint](https://github.com/eslint/eslint) from 9.9.1 to 9.10.0.
- [Release notes](https://github.com/eslint/eslint/releases)
- [Changelog](https://github.com/eslint/eslint/blob/main/CHANGELOG.md)
- [Commits](https://github.com/eslint/eslint/compare/v9.9.1...v9.10.0)

---
updated-dependencies:
- dependency-name: eslint
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([2d9e874](https://github.com/hochfrequenz/ahb-tabellen/commit/2d9e87408a07b0d3d5be60b3c9f8fd01b521f27b))
- *(other)* Bump node from 20.13-alpine to 22.8-alpine ([#204](https://github.com/hochfrequenz/ahb-tabellen/issues/204))

Bumps node from 20.13-alpine to 22.8-alpine.

---
updated-dependencies:
- dependency-name: node
  dependency-type: direct:production
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([9c1ca3f](https://github.com/hochfrequenz/ahb-tabellen/commit/9c1ca3f2c82d022a68f65f892e7dc16de25f5d26))
- *(other)* 🔍️ Relocate search bar to header ([#172](https://github.com/hochfrequenz/ahb-tabellen/issues/172))

* Relocate search bar to header

* Format - ([e42be1b](https://github.com/hochfrequenz/ahb-tabellen/commit/e42be1b4198be9ea762aa0ae1a310b5da0ccd64e))
- *(other)* 🐳🪝 Pull latest azurite image automatically ([#170](https://github.com/hochfrequenz/ahb-tabellen/issues/170))

Pull latest azurite image automatically - ([28308bf](https://github.com/hochfrequenz/ahb-tabellen/commit/28308bf7c6d27fbd7dcd400ad494628e5b0dbf26))
- *(other)* Bump postcss from 8.4.43 to 8.4.47 ([#202](https://github.com/hochfrequenz/ahb-tabellen/issues/202))

Bumps [postcss](https://github.com/postcss/postcss) from 8.4.43 to 8.4.47.
- [Release notes](https://github.com/postcss/postcss/releases)
- [Changelog](https://github.com/postcss/postcss/blob/main/CHANGELOG.md)
- [Commits](https://github.com/postcss/postcss/compare/8.4.43...8.4.47)

---
updated-dependencies:
- dependency-name: postcss
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([b8a1860](https://github.com/hochfrequenz/ahb-tabellen/commit/b8a186039022179f08f80a972cde8b13de59a51b))
- *(other)* Bump ng-openapi-gen from 0.51.0 to 0.52.0 ([#201](https://github.com/hochfrequenz/ahb-tabellen/issues/201))

Bumps [ng-openapi-gen](https://github.com/cyclosproject/ng-openapi-gen) from 0.51.0 to 0.52.0.
- [Release notes](https://github.com/cyclosproject/ng-openapi-gen/releases)
- [Commits](https://github.com/cyclosproject/ng-openapi-gen/compare/0.51.0...0.52.0)

---
updated-dependencies:
- dependency-name: ng-openapi-gen
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([6ab9dcb](https://github.com/hochfrequenz/ahb-tabellen/commit/6ab9dcb122383d4abd69d23530a932e884bcc1b7))
- *(other)* Bump jest-preset-angular from 14.2.2 to 14.2.4 ([#200](https://github.com/hochfrequenz/ahb-tabellen/issues/200))

Bumps [jest-preset-angular](https://github.com/thymikee/jest-preset-angular) from 14.2.2 to 14.2.4.
- [Release notes](https://github.com/thymikee/jest-preset-angular/releases)
- [Changelog](https://github.com/thymikee/jest-preset-angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/thymikee/jest-preset-angular/compare/v14.2.2...v14.2.4)

---
updated-dependencies:
- dependency-name: jest-preset-angular
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([82cd81f](https://github.com/hochfrequenz/ahb-tabellen/commit/82cd81f54f950930da3c3bffd12781ba03e73a77))
- *(other)* Bump express from 4.19.2 to 4.21.0 ([#199](https://github.com/hochfrequenz/ahb-tabellen/issues/199))

Bumps [express](https://github.com/expressjs/express) from 4.19.2 to 4.21.0.
- [Release notes](https://github.com/expressjs/express/releases)
- [Changelog](https://github.com/expressjs/express/blob/4.21.0/History.md)
- [Commits](https://github.com/expressjs/express/compare/4.19.2...4.21.0)

---
updated-dependencies:
- dependency-name: express
  dependency-type: direct:production
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([5b9264d](https://github.com/hochfrequenz/ahb-tabellen/commit/5b9264ddf82dff81aaafb870805d07a2d17990a9))
- *(other)* Bump concurrently from 9.0.0 to 9.0.1 ([#198](https://github.com/hochfrequenz/ahb-tabellen/issues/198))

Bumps [concurrently](https://github.com/open-cli-tools/concurrently) from 9.0.0 to 9.0.1.
- [Release notes](https://github.com/open-cli-tools/concurrently/releases)
- [Commits](https://github.com/open-cli-tools/concurrently/compare/v9.0.0...v9.0.1)

---
updated-dependencies:
- dependency-name: concurrently
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([4e4cfc1](https://github.com/hochfrequenz/ahb-tabellen/commit/4e4cfc1b7153de35db667aebe97396c3bd5741e6))
- *(other)* Bump the angular group with 16 updates ([#197](https://github.com/hochfrequenz/ahb-tabellen/issues/197))

Bumps the angular group with 16 updates:

| Package | From | To |
| --- | --- | --- |
| [@angular/animations](https://github.com/angular/angular/tree/HEAD/packages/animations) | `18.2.3` | `18.2.4` |
| [@angular/common](https://github.com/angular/angular/tree/HEAD/packages/common) | `18.2.3` | `18.2.4` |
| [@angular/compiler](https://github.com/angular/angular/tree/HEAD/packages/compiler) | `18.2.3` | `18.2.4` |
| [@angular/core](https://github.com/angular/angular/tree/HEAD/packages/core) | `18.2.3` | `18.2.4` |
| [@angular/forms](https://github.com/angular/angular/tree/HEAD/packages/forms) | `18.2.3` | `18.2.4` |
| [@angular/platform-browser](https://github.com/angular/angular/tree/HEAD/packages/platform-browser) | `18.2.3` | `18.2.4` |
| [@angular/platform-browser-dynamic](https://github.com/angular/angular/tree/HEAD/packages/platform-browser-dynamic) | `18.2.3` | `18.2.4` |
| [@angular/router](https://github.com/angular/angular/tree/HEAD/packages/router) | `18.2.3` | `18.2.4` |
| [@angular-devkit/build-angular](https://github.com/angular/angular-cli) | `18.2.3` | `18.2.4` |
| [@angular-eslint/builder](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/builder) | `18.3.0` | `18.3.1` |
| [@angular-eslint/eslint-plugin](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/eslint-plugin) | `18.3.0` | `18.3.1` |
| [@angular-eslint/eslint-plugin-template](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/eslint-plugin-template) | `18.3.0` | `18.3.1` |
| [@angular-eslint/schematics](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/schematics) | `18.3.0` | `18.3.1` |
| [@angular-eslint/template-parser](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/template-parser) | `18.3.0` | `18.3.1` |
| [@angular/cli](https://github.com/angular/angular-cli) | `18.2.3` | `18.2.4` |
| [@angular/compiler-cli](https://github.com/angular/angular/tree/HEAD/packages/compiler-cli) | `18.2.3` | `18.2.4` |


Updates `@angular/animations` from 18.2.3 to 18.2.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.4/packages/animations)

Updates `@angular/common` from 18.2.3 to 18.2.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.4/packages/common)

Updates `@angular/compiler` from 18.2.3 to 18.2.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.4/packages/compiler)

Updates `@angular/core` from 18.2.3 to 18.2.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.4/packages/core)

Updates `@angular/forms` from 18.2.3 to 18.2.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.4/packages/forms)

Updates `@angular/platform-browser` from 18.2.3 to 18.2.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.4/packages/platform-browser)

Updates `@angular/platform-browser-dynamic` from 18.2.3 to 18.2.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.4/packages/platform-browser-dynamic)

Updates `@angular/router` from 18.2.3 to 18.2.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.4/packages/router)

Updates `@angular-devkit/build-angular` from 18.2.3 to 18.2.4
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.2.3...18.2.4)

Updates `@angular-eslint/builder` from 18.3.0 to 18.3.1
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/builder/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.3.1/packages/builder)

Updates `@angular-eslint/eslint-plugin` from 18.3.0 to 18.3.1
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.3.1/packages/eslint-plugin)

Updates `@angular-eslint/eslint-plugin-template` from 18.3.0 to 18.3.1
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.3.1/packages/eslint-plugin-template)

Updates `@angular-eslint/schematics` from 18.3.0 to 18.3.1
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/schematics/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.3.1/packages/schematics)

Updates `@angular-eslint/template-parser` from 18.3.0 to 18.3.1
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/template-parser/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.3.1/packages/template-parser)

Updates `@angular/cli` from 18.2.3 to 18.2.4
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.2.3...18.2.4)

Updates `@angular/compiler-cli` from 18.2.3 to 18.2.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.4/packages/compiler-cli)

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-eslint/builder"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-eslint/eslint-plugin-template"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-eslint/schematics"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-eslint/template-parser"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([b5c46d5](https://github.com/hochfrequenz/ahb-tabellen/commit/b5c46d589ad67ca946d8fd10cb19d99a8dec88d1))

## New Contributors ❤️

* @JonasSchneegans made their first contribution in [#109](https://github.com/hochfrequenz/ahb-tabellen/pull/109)

## [0.0.4](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.3..v0.0.4) - 2024-09-09

### 🧹 Other

- *(other)* Bump ng-mocks from 14.13.0 to 14.13.1 ([#196](https://github.com/hochfrequenz/ahb-tabellen/issues/196))

Bumps [ng-mocks](https://github.com/help-me-mom/ng-mocks) from 14.13.0 to 14.13.1.
- [Release notes](https://github.com/help-me-mom/ng-mocks/releases)
- [Changelog](https://github.com/help-me-mom/ng-mocks/blob/master/CHANGELOG.md)
- [Commits](https://github.com/help-me-mom/ng-mocks/compare/v14.13.0...v14.13.1)

---
updated-dependencies:
- dependency-name: ng-mocks
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([7b12bc0](https://github.com/hochfrequenz/ahb-tabellen/commit/7b12bc0ee6977950a85172b7f15abfbd618b2ade))
- *(other)* Bump concurrently from 8.2.2 to 9.0.0 ([#194](https://github.com/hochfrequenz/ahb-tabellen/issues/194))

Bumps [concurrently](https://github.com/open-cli-tools/concurrently) from 8.2.2 to 9.0.0.
- [Release notes](https://github.com/open-cli-tools/concurrently/releases)
- [Commits](https://github.com/open-cli-tools/concurrently/compare/v8.2.2...v9.0.0)

---
updated-dependencies:
- dependency-name: concurrently
  dependency-type: direct:development
  update-type: version-update:semver-major
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([22b276f](https://github.com/hochfrequenz/ahb-tabellen/commit/22b276fb1e1338c1e0b27ebaa9c32f4ab4158b20))
- *(other)* Bump @typescript-eslint/eslint-plugin from 8.3.0 to 8.4.0 ([#195](https://github.com/hochfrequenz/ahb-tabellen/issues/195))

Bumps [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/eslint-plugin) from 8.3.0 to 8.4.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v8.4.0/packages/eslint-plugin)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([62035ef](https://github.com/hochfrequenz/ahb-tabellen/commit/62035efc800942938c63cc27c2be29aabca1ee2b))
- *(other)* Bump tslib from 2.6.3 to 2.7.0 ([#193](https://github.com/hochfrequenz/ahb-tabellen/issues/193))

Bumps [tslib](https://github.com/Microsoft/tslib) from 2.6.3 to 2.7.0.
- [Release notes](https://github.com/Microsoft/tslib/releases)
- [Commits](https://github.com/Microsoft/tslib/compare/v2.6.3...v2.7.0)

---
updated-dependencies:
- dependency-name: tslib
  dependency-type: direct:production
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([9b12e6a](https://github.com/hochfrequenz/ahb-tabellen/commit/9b12e6a94a82438b9a81fbe4301526d6425033a2))
- *(other)* Bump the angular group with 11 updates ([#192](https://github.com/hochfrequenz/ahb-tabellen/issues/192))

Bumps the angular group with 11 updates:

| Package | From | To |
| --- | --- | --- |
| [@angular/animations](https://github.com/angular/angular/tree/HEAD/packages/animations) | `18.2.2` | `18.2.3` |
| [@angular/common](https://github.com/angular/angular/tree/HEAD/packages/common) | `18.2.2` | `18.2.3` |
| [@angular/compiler](https://github.com/angular/angular/tree/HEAD/packages/compiler) | `18.2.2` | `18.2.3` |
| [@angular/core](https://github.com/angular/angular/tree/HEAD/packages/core) | `18.2.2` | `18.2.3` |
| [@angular/forms](https://github.com/angular/angular/tree/HEAD/packages/forms) | `18.2.2` | `18.2.3` |
| [@angular/platform-browser](https://github.com/angular/angular/tree/HEAD/packages/platform-browser) | `18.2.2` | `18.2.3` |
| [@angular/platform-browser-dynamic](https://github.com/angular/angular/tree/HEAD/packages/platform-browser-dynamic) | `18.2.2` | `18.2.3` |
| [@angular/router](https://github.com/angular/angular/tree/HEAD/packages/router) | `18.2.2` | `18.2.3` |
| [@angular-devkit/build-angular](https://github.com/angular/angular-cli) | `18.2.2` | `18.2.3` |
| [@angular/cli](https://github.com/angular/angular-cli) | `18.2.2` | `18.2.3` |
| [@angular/compiler-cli](https://github.com/angular/angular/tree/HEAD/packages/compiler-cli) | `18.2.2` | `18.2.3` |


Updates `@angular/animations` from 18.2.2 to 18.2.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.3/packages/animations)

Updates `@angular/common` from 18.2.2 to 18.2.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.3/packages/common)

Updates `@angular/compiler` from 18.2.2 to 18.2.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.3/packages/compiler)

Updates `@angular/core` from 18.2.2 to 18.2.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.3/packages/core)

Updates `@angular/forms` from 18.2.2 to 18.2.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.3/packages/forms)

Updates `@angular/platform-browser` from 18.2.2 to 18.2.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.3/packages/platform-browser)

Updates `@angular/platform-browser-dynamic` from 18.2.2 to 18.2.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.3/packages/platform-browser-dynamic)

Updates `@angular/router` from 18.2.2 to 18.2.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.3/packages/router)

Updates `@angular-devkit/build-angular` from 18.2.2 to 18.2.3
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.2.2...18.2.3)

Updates `@angular/cli` from 18.2.2 to 18.2.3
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.2.2...18.2.3)

Updates `@angular/compiler-cli` from 18.2.2 to 18.2.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.3/packages/compiler-cli)

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([1851bbd](https://github.com/hochfrequenz/ahb-tabellen/commit/1851bbd0b83a4123b1d801f6f1f03549078b281f))
- *(other)* Bump @typescript-eslint/eslint-plugin from 8.2.0 to 8.3.0 ([#188](https://github.com/hochfrequenz/ahb-tabellen/issues/188))

Bumps [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/eslint-plugin) from 8.2.0 to 8.3.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v8.3.0/packages/eslint-plugin)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([ea1546e](https://github.com/hochfrequenz/ahb-tabellen/commit/ea1546e49008f1a382e346011e978fba4ff84812))
- *(other)* Bump postcss from 8.4.41 to 8.4.43 ([#189](https://github.com/hochfrequenz/ahb-tabellen/issues/189))

Bumps [postcss](https://github.com/postcss/postcss) from 8.4.41 to 8.4.43.
- [Release notes](https://github.com/postcss/postcss/releases)
- [Changelog](https://github.com/postcss/postcss/blob/main/CHANGELOG.md)
- [Commits](https://github.com/postcss/postcss/compare/8.4.41...8.4.43)

---
updated-dependencies:
- dependency-name: postcss
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([363a4d5](https://github.com/hochfrequenz/ahb-tabellen/commit/363a4d500a263e24c74fb25b7413321c0b1b0f1e))
- *(other)* Bump tsx from 4.18.0 to 4.19.0 ([#187](https://github.com/hochfrequenz/ahb-tabellen/issues/187))

Bumps [tsx](https://github.com/privatenumber/tsx) from 4.18.0 to 4.19.0.
- [Release notes](https://github.com/privatenumber/tsx/releases)
- [Changelog](https://github.com/privatenumber/tsx/blob/master/release.config.cjs)
- [Commits](https://github.com/privatenumber/tsx/compare/v4.18.0...v4.19.0)

---
updated-dependencies:
- dependency-name: tsx
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([22caee8](https://github.com/hochfrequenz/ahb-tabellen/commit/22caee84d02355e18e73d0f68f84b971056b03b7))
- *(other)* Bump @typescript-eslint/parser from 8.2.0 to 8.3.0 ([#186](https://github.com/hochfrequenz/ahb-tabellen/issues/186))

Bumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 8.2.0 to 8.3.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v8.3.0/packages/parser)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/parser"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([1887df2](https://github.com/hochfrequenz/ahb-tabellen/commit/1887df22046d42161850375a48d10a2b4bd9e553))
- *(other)* Bump the angular group with 11 updates ([#185](https://github.com/hochfrequenz/ahb-tabellen/issues/185))

Bumps the angular group with 11 updates:

| Package | From | To |
| --- | --- | --- |
| [@angular/animations](https://github.com/angular/angular/tree/HEAD/packages/animations) | `18.2.1` | `18.2.2` |
| [@angular/common](https://github.com/angular/angular/tree/HEAD/packages/common) | `18.2.1` | `18.2.2` |
| [@angular/compiler](https://github.com/angular/angular/tree/HEAD/packages/compiler) | `18.2.1` | `18.2.2` |
| [@angular/core](https://github.com/angular/angular/tree/HEAD/packages/core) | `18.2.1` | `18.2.2` |
| [@angular/forms](https://github.com/angular/angular/tree/HEAD/packages/forms) | `18.2.1` | `18.2.2` |
| [@angular/platform-browser](https://github.com/angular/angular/tree/HEAD/packages/platform-browser) | `18.2.1` | `18.2.2` |
| [@angular/platform-browser-dynamic](https://github.com/angular/angular/tree/HEAD/packages/platform-browser-dynamic) | `18.2.1` | `18.2.2` |
| [@angular/router](https://github.com/angular/angular/tree/HEAD/packages/router) | `18.2.1` | `18.2.2` |
| [@angular-devkit/build-angular](https://github.com/angular/angular-cli) | `18.2.1` | `18.2.2` |
| [@angular/cli](https://github.com/angular/angular-cli) | `18.2.1` | `18.2.2` |
| [@angular/compiler-cli](https://github.com/angular/angular/tree/HEAD/packages/compiler-cli) | `18.2.1` | `18.2.2` |


Updates `@angular/animations` from 18.2.1 to 18.2.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.2/packages/animations)

Updates `@angular/common` from 18.2.1 to 18.2.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.2/packages/common)

Updates `@angular/compiler` from 18.2.1 to 18.2.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.2/packages/compiler)

Updates `@angular/core` from 18.2.1 to 18.2.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.2/packages/core)

Updates `@angular/forms` from 18.2.1 to 18.2.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.2/packages/forms)

Updates `@angular/platform-browser` from 18.2.1 to 18.2.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.2/packages/platform-browser)

Updates `@angular/platform-browser-dynamic` from 18.2.1 to 18.2.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.2/packages/platform-browser-dynamic)

Updates `@angular/router` from 18.2.1 to 18.2.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.2/packages/router)

Updates `@angular-devkit/build-angular` from 18.2.1 to 18.2.2
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.2.1...18.2.2)

Updates `@angular/cli` from 18.2.1 to 18.2.2
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.2.1...18.2.2)

Updates `@angular/compiler-cli` from 18.2.1 to 18.2.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.2/packages/compiler-cli)

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([57b7eff](https://github.com/hochfrequenz/ahb-tabellen/commit/57b7eff0037c024bb07cef64fe73861ad5993d3a))
- *(other)* Bump @typescript-eslint/eslint-plugin from 8.0.1 to 8.2.0 ([#182](https://github.com/hochfrequenz/ahb-tabellen/issues/182))

Bumps [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/eslint-plugin) from 8.0.1 to 8.2.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v8.2.0/packages/eslint-plugin)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([9a02823](https://github.com/hochfrequenz/ahb-tabellen/commit/9a02823a9e90772f93d32d524066a78a56f536ab))
- *(other)* Bump @typescript-eslint/parser from 8.1.0 to 8.2.0 ([#183](https://github.com/hochfrequenz/ahb-tabellen/issues/183))

Bumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 8.1.0 to 8.2.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v8.2.0/packages/parser)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/parser"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([5f999a8](https://github.com/hochfrequenz/ahb-tabellen/commit/5f999a813df0e3051e8ba0300e2ebae677f8c09a))
- *(other)* Bump eslint from 9.9.0 to 9.9.1 ([#184](https://github.com/hochfrequenz/ahb-tabellen/issues/184))

Bumps [eslint](https://github.com/eslint/eslint) from 9.9.0 to 9.9.1.
- [Release notes](https://github.com/eslint/eslint/releases)
- [Changelog](https://github.com/eslint/eslint/blob/main/CHANGELOG.md)
- [Commits](https://github.com/eslint/eslint/compare/v9.9.0...v9.9.1)

---
updated-dependencies:
- dependency-name: eslint
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([58e8304](https://github.com/hochfrequenz/ahb-tabellen/commit/58e8304755fbc8392773855af80b0b98d62f7c1d))
- *(other)* Bump tsx from 4.17.0 to 4.18.0 ([#181](https://github.com/hochfrequenz/ahb-tabellen/issues/181))

Bumps [tsx](https://github.com/privatenumber/tsx) from 4.17.0 to 4.18.0.
- [Release notes](https://github.com/privatenumber/tsx/releases)
- [Changelog](https://github.com/privatenumber/tsx/blob/master/release.config.cjs)
- [Commits](https://github.com/privatenumber/tsx/compare/v4.17.0...v4.18.0)

---
updated-dependencies:
- dependency-name: tsx
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([fbad65d](https://github.com/hochfrequenz/ahb-tabellen/commit/fbad65d0433b083b633765a64acb6bdbe8e9ca2a))
- *(other)* Bump the angular group with 11 updates ([#180](https://github.com/hochfrequenz/ahb-tabellen/issues/180))

Bumps the angular group with 11 updates:

| Package | From | To |
| --- | --- | --- |
| [@angular/animations](https://github.com/angular/angular/tree/HEAD/packages/animations) | `18.2.0` | `18.2.1` |
| [@angular/common](https://github.com/angular/angular/tree/HEAD/packages/common) | `18.2.0` | `18.2.1` |
| [@angular/compiler](https://github.com/angular/angular/tree/HEAD/packages/compiler) | `18.2.0` | `18.2.1` |
| [@angular/core](https://github.com/angular/angular/tree/HEAD/packages/core) | `18.2.0` | `18.2.1` |
| [@angular/forms](https://github.com/angular/angular/tree/HEAD/packages/forms) | `18.2.0` | `18.2.1` |
| [@angular/platform-browser](https://github.com/angular/angular/tree/HEAD/packages/platform-browser) | `18.2.0` | `18.2.1` |
| [@angular/platform-browser-dynamic](https://github.com/angular/angular/tree/HEAD/packages/platform-browser-dynamic) | `18.2.0` | `18.2.1` |
| [@angular/router](https://github.com/angular/angular/tree/HEAD/packages/router) | `18.2.0` | `18.2.1` |
| [@angular-devkit/build-angular](https://github.com/angular/angular-cli) | `18.2.0` | `18.2.1` |
| [@angular/cli](https://github.com/angular/angular-cli) | `18.2.0` | `18.2.1` |
| [@angular/compiler-cli](https://github.com/angular/angular/tree/HEAD/packages/compiler-cli) | `18.2.0` | `18.2.1` |


Updates `@angular/animations` from 18.2.0 to 18.2.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.1/packages/animations)

Updates `@angular/common` from 18.2.0 to 18.2.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.1/packages/common)

Updates `@angular/compiler` from 18.2.0 to 18.2.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.1/packages/compiler)

Updates `@angular/core` from 18.2.0 to 18.2.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.1/packages/core)

Updates `@angular/forms` from 18.2.0 to 18.2.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.1/packages/forms)

Updates `@angular/platform-browser` from 18.2.0 to 18.2.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.1/packages/platform-browser)

Updates `@angular/platform-browser-dynamic` from 18.2.0 to 18.2.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.1/packages/platform-browser-dynamic)

Updates `@angular/router` from 18.2.0 to 18.2.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.1/packages/router)

Updates `@angular-devkit/build-angular` from 18.2.0 to 18.2.1
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.2.0...18.2.1)

Updates `@angular/cli` from 18.2.0 to 18.2.1
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.2.0...18.2.1)

Updates `@angular/compiler-cli` from 18.2.0 to 18.2.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.1/packages/compiler-cli)

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([73c04e1](https://github.com/hochfrequenz/ahb-tabellen/commit/73c04e158c9b6fb6ac89bf97dca1a7b17233ee42))
- *(other)* Bump eslint from 8.57.0 to 9.9.0 ([#175](https://github.com/hochfrequenz/ahb-tabellen/issues/175))

Bumps [eslint](https://github.com/eslint/eslint) from 8.57.0 to 9.9.0.
- [Release notes](https://github.com/eslint/eslint/releases)
- [Changelog](https://github.com/eslint/eslint/blob/main/CHANGELOG.md)
- [Commits](https://github.com/eslint/eslint/compare/v8.57.0...v9.9.0)

---
updated-dependencies:
- dependency-name: eslint
  dependency-type: direct:development
  update-type: version-update:semver-major
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
Co-authored-by: konstantin <konstantin.klein@hochfrequenz.de> - ([945d10e](https://github.com/hochfrequenz/ahb-tabellen/commit/945d10e1cf7a15df1bed25fbfc13e36574f8dfd9))
- *(other)* 🔧 Migrate from `eslintrc` to `eslint.config` ([#179](https://github.com/hochfrequenz/ahb-tabellen/issues/179))

Add eslint config - ([15daa78](https://github.com/hochfrequenz/ahb-tabellen/commit/15daa7883b4a3672e81ccd0003bb9e0c574f0ef6))
- *(other)* Bump zone.js from 0.14.8 to 0.14.10 ([#178](https://github.com/hochfrequenz/ahb-tabellen/issues/178))

Bumps [zone.js](https://github.com/angular/angular/tree/HEAD/packages/zone.js) from 0.14.8 to 0.14.10.
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/packages/zone.js/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/zone.js-0.14.10/packages/zone.js)

---
updated-dependencies:
- dependency-name: zone.js
  dependency-type: direct:production
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([a867ffe](https://github.com/hochfrequenz/ahb-tabellen/commit/a867ffe2b8b79292dc73a05c6640ba1fcbc31199))
- *(other)* Bump tailwindcss from 3.4.9 to 3.4.10 ([#177](https://github.com/hochfrequenz/ahb-tabellen/issues/177))

Bumps [tailwindcss](https://github.com/tailwindlabs/tailwindcss) from 3.4.9 to 3.4.10.
- [Release notes](https://github.com/tailwindlabs/tailwindcss/releases)
- [Changelog](https://github.com/tailwindlabs/tailwindcss/blob/v3.4.10/CHANGELOG.md)
- [Commits](https://github.com/tailwindlabs/tailwindcss/compare/v3.4.9...v3.4.10)

---
updated-dependencies:
- dependency-name: tailwindcss
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([a6c51bf](https://github.com/hochfrequenz/ahb-tabellen/commit/a6c51bfda84eb70b95f9d56cdbdfd41c880074fb))
- *(other)* Bump @typescript-eslint/parser from 8.0.1 to 8.1.0 ([#176](https://github.com/hochfrequenz/ahb-tabellen/issues/176))

Bumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 8.0.1 to 8.1.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v8.1.0/packages/parser)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/parser"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([058ae60](https://github.com/hochfrequenz/ahb-tabellen/commit/058ae604c04289d7f4cae18ef3268fbfdb776a7a))
- *(other)* Bump the angular group with 16 updates ([#174](https://github.com/hochfrequenz/ahb-tabellen/issues/174))

Bumps the angular group with 16 updates:

| Package | From | To |
| --- | --- | --- |
| [@angular/animations](https://github.com/angular/angular/tree/HEAD/packages/animations) | `18.1.4` | `18.2.0` |
| [@angular/common](https://github.com/angular/angular/tree/HEAD/packages/common) | `18.1.4` | `18.2.0` |
| [@angular/compiler](https://github.com/angular/angular/tree/HEAD/packages/compiler) | `18.1.4` | `18.2.0` |
| [@angular/core](https://github.com/angular/angular/tree/HEAD/packages/core) | `18.1.4` | `18.2.0` |
| [@angular/forms](https://github.com/angular/angular/tree/HEAD/packages/forms) | `18.1.4` | `18.2.0` |
| [@angular/platform-browser](https://github.com/angular/angular/tree/HEAD/packages/platform-browser) | `18.1.4` | `18.2.0` |
| [@angular/platform-browser-dynamic](https://github.com/angular/angular/tree/HEAD/packages/platform-browser-dynamic) | `18.1.4` | `18.2.0` |
| [@angular/router](https://github.com/angular/angular/tree/HEAD/packages/router) | `18.1.4` | `18.2.0` |
| [@angular-devkit/build-angular](https://github.com/angular/angular-cli) | `18.1.4` | `18.2.0` |
| [@angular-eslint/builder](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/builder) | `18.2.0` | `18.3.0` |
| [@angular-eslint/eslint-plugin](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/eslint-plugin) | `18.2.0` | `18.3.0` |
| [@angular-eslint/eslint-plugin-template](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/eslint-plugin-template) | `18.2.0` | `18.3.0` |
| [@angular-eslint/schematics](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/schematics) | `18.2.0` | `18.3.0` |
| [@angular-eslint/template-parser](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/template-parser) | `18.2.0` | `18.3.0` |
| [@angular/cli](https://github.com/angular/angular-cli) | `18.1.4` | `18.2.0` |
| [@angular/compiler-cli](https://github.com/angular/angular/tree/HEAD/packages/compiler-cli) | `18.1.4` | `18.2.0` |


Updates `@angular/animations` from 18.1.4 to 18.2.0
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.0/packages/animations)

Updates `@angular/common` from 18.1.4 to 18.2.0
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.0/packages/common)

Updates `@angular/compiler` from 18.1.4 to 18.2.0
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.0/packages/compiler)

Updates `@angular/core` from 18.1.4 to 18.2.0
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.0/packages/core)

Updates `@angular/forms` from 18.1.4 to 18.2.0
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.0/packages/forms)

Updates `@angular/platform-browser` from 18.1.4 to 18.2.0
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.0/packages/platform-browser)

Updates `@angular/platform-browser-dynamic` from 18.1.4 to 18.2.0
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.0/packages/platform-browser-dynamic)

Updates `@angular/router` from 18.1.4 to 18.2.0
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.0/packages/router)

Updates `@angular-devkit/build-angular` from 18.1.4 to 18.2.0
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.1.4...18.2.0)

Updates `@angular-eslint/builder` from 18.2.0 to 18.3.0
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/builder/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.3.0/packages/builder)

Updates `@angular-eslint/eslint-plugin` from 18.2.0 to 18.3.0
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.3.0/packages/eslint-plugin)

Updates `@angular-eslint/eslint-plugin-template` from 18.2.0 to 18.3.0
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.3.0/packages/eslint-plugin-template)

Updates `@angular-eslint/schematics` from 18.2.0 to 18.3.0
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/schematics/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.3.0/packages/schematics)

Updates `@angular-eslint/template-parser` from 18.2.0 to 18.3.0
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/template-parser/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.3.0/packages/template-parser)

Updates `@angular/cli` from 18.1.4 to 18.2.0
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.1.4...18.2.0)

Updates `@angular/compiler-cli` from 18.1.4 to 18.2.0
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.2.0/packages/compiler-cli)

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-eslint/builder"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-eslint/eslint-plugin-template"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-eslint/schematics"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-eslint/template-parser"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([7f2c06e](https://github.com/hochfrequenz/ahb-tabellen/commit/7f2c06ec44eb8c909dd70aa8f1d6dd67b3c7ac49))
- *(other)* Bump docker/build-push-action from 6.6.1 to 6.7.0 ([#173](https://github.com/hochfrequenz/ahb-tabellen/issues/173))

Bumps [docker/build-push-action](https://github.com/docker/build-push-action) from 6.6.1 to 6.7.0.
- [Release notes](https://github.com/docker/build-push-action/releases)
- [Commits](https://github.com/docker/build-push-action/compare/v6.6.1...v6.7.0)

---
updated-dependencies:
- dependency-name: docker/build-push-action
  dependency-type: direct:production
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([2e9abf5](https://github.com/hochfrequenz/ahb-tabellen/commit/2e9abf504f5c1c7be0467e7abc08e0fd5414645b))
- *(other)* ✏️ Fix title typo inside header ([#171](https://github.com/hochfrequenz/ahb-tabellen/issues/171))

Fix title typo inside header - ([f3b1b91](https://github.com/hochfrequenz/ahb-tabellen/commit/f3b1b91667b755f8552368ceea99660bd78a8e3f))
- *(other)* Add link to stage environment ([#162](https://github.com/hochfrequenz/ahb-tabellen/issues/162))

* add link to stage environment

* run prettier - ([4a9bba9](https://github.com/hochfrequenz/ahb-tabellen/commit/4a9bba913cf9390f3ab58280aba717749962d8bc))
- *(other)* Bump @typescript-eslint/eslint-plugin from 7.17.0 to 8.0.1 ([#166](https://github.com/hochfrequenz/ahb-tabellen/issues/166))

* Bump @typescript-eslint/eslint-plugin from 7.17.0 to 8.0.1

Bumps [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/eslint-plugin) from 7.17.0 to 8.0.1.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v8.0.1/packages/eslint-plugin)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-major
...

Signed-off-by: dependabot[bot] <support@github.com>

* Fix dependency conflict

* Fix ESLint-ignore comment

---------

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
Co-authored-by: olli <144932831+OLILHR@users.noreply.github.com> - ([1401596](https://github.com/hochfrequenz/ahb-tabellen/commit/140159653a1cd31dae82f366d9b6938ff44b8cf4))
- *(other)* Bump docker/build-push-action from 6.5.0 to 6.6.1 ([#168](https://github.com/hochfrequenz/ahb-tabellen/issues/168))

Bumps [docker/build-push-action](https://github.com/docker/build-push-action) from 6.5.0 to 6.6.1.
- [Release notes](https://github.com/docker/build-push-action/releases)
- [Commits](https://github.com/docker/build-push-action/compare/v6.5.0...v6.6.1)

---
updated-dependencies:
- dependency-name: docker/build-push-action
  dependency-type: direct:production
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([0cdf150](https://github.com/hochfrequenz/ahb-tabellen/commit/0cdf1508c7ec2cebf29519df0a93b27d7af329b8))
- *(other)* Bump tailwindcss from 3.4.7 to 3.4.9 ([#167](https://github.com/hochfrequenz/ahb-tabellen/issues/167))

Bumps [tailwindcss](https://github.com/tailwindlabs/tailwindcss) from 3.4.7 to 3.4.9.
- [Release notes](https://github.com/tailwindlabs/tailwindcss/releases)
- [Changelog](https://github.com/tailwindlabs/tailwindcss/blob/v3.4.9/CHANGELOG.md)
- [Commits](https://github.com/tailwindlabs/tailwindcss/compare/v3.4.7...v3.4.9)

---
updated-dependencies:
- dependency-name: tailwindcss
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([a284cb7](https://github.com/hochfrequenz/ahb-tabellen/commit/a284cb79deb2419e5eca01e037c4ca95a6085ce5))
- *(other)* Bump tsx from 4.16.5 to 4.17.0 ([#165](https://github.com/hochfrequenz/ahb-tabellen/issues/165))

Bumps [tsx](https://github.com/privatenumber/tsx) from 4.16.5 to 4.17.0.
- [Release notes](https://github.com/privatenumber/tsx/releases)
- [Changelog](https://github.com/privatenumber/tsx/blob/master/release.config.cjs)
- [Commits](https://github.com/privatenumber/tsx/compare/v4.16.5...v4.17.0)

---
updated-dependencies:
- dependency-name: tsx
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([d228c5f](https://github.com/hochfrequenz/ahb-tabellen/commit/d228c5faa6ce8749d2657b49e3d78e478c37cd2c))
- *(other)* Bump postcss from 8.4.40 to 8.4.41 ([#164](https://github.com/hochfrequenz/ahb-tabellen/issues/164))

Bumps [postcss](https://github.com/postcss/postcss) from 8.4.40 to 8.4.41.
- [Release notes](https://github.com/postcss/postcss/releases)
- [Changelog](https://github.com/postcss/postcss/blob/main/CHANGELOG.md)
- [Commits](https://github.com/postcss/postcss/compare/8.4.40...8.4.41)

---
updated-dependencies:
- dependency-name: postcss
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([b2eb86e](https://github.com/hochfrequenz/ahb-tabellen/commit/b2eb86eda854400d5b448acd87a05bfdf5fd4569))
- *(other)* Bump the angular group with 11 updates ([#163](https://github.com/hochfrequenz/ahb-tabellen/issues/163))

Bumps the angular group with 11 updates:

| Package | From | To |
| --- | --- | --- |
| [@angular/animations](https://github.com/angular/angular/tree/HEAD/packages/animations) | `18.1.3` | `18.1.4` |
| [@angular/common](https://github.com/angular/angular/tree/HEAD/packages/common) | `18.1.3` | `18.1.4` |
| [@angular/compiler](https://github.com/angular/angular/tree/HEAD/packages/compiler) | `18.1.3` | `18.1.4` |
| [@angular/core](https://github.com/angular/angular/tree/HEAD/packages/core) | `18.1.3` | `18.1.4` |
| [@angular/forms](https://github.com/angular/angular/tree/HEAD/packages/forms) | `18.1.3` | `18.1.4` |
| [@angular/platform-browser](https://github.com/angular/angular/tree/HEAD/packages/platform-browser) | `18.1.3` | `18.1.4` |
| [@angular/platform-browser-dynamic](https://github.com/angular/angular/tree/HEAD/packages/platform-browser-dynamic) | `18.1.3` | `18.1.4` |
| [@angular/router](https://github.com/angular/angular/tree/HEAD/packages/router) | `18.1.3` | `18.1.4` |
| [@angular-devkit/build-angular](https://github.com/angular/angular-cli) | `18.1.3` | `18.1.4` |
| [@angular/cli](https://github.com/angular/angular-cli) | `18.1.3` | `18.1.4` |
| [@angular/compiler-cli](https://github.com/angular/angular/tree/HEAD/packages/compiler-cli) | `18.1.3` | `18.1.4` |


Updates `@angular/animations` from 18.1.3 to 18.1.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.4/packages/animations)

Updates `@angular/common` from 18.1.3 to 18.1.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.4/packages/common)

Updates `@angular/compiler` from 18.1.3 to 18.1.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.4/packages/compiler)

Updates `@angular/core` from 18.1.3 to 18.1.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.4/packages/core)

Updates `@angular/forms` from 18.1.3 to 18.1.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.4/packages/forms)

Updates `@angular/platform-browser` from 18.1.3 to 18.1.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.4/packages/platform-browser)

Updates `@angular/platform-browser-dynamic` from 18.1.3 to 18.1.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.4/packages/platform-browser-dynamic)

Updates `@angular/router` from 18.1.3 to 18.1.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.4/packages/router)

Updates `@angular-devkit/build-angular` from 18.1.3 to 18.1.4
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.1.3...18.1.4)

Updates `@angular/cli` from 18.1.3 to 18.1.4
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.1.3...18.1.4)

Updates `@angular/compiler-cli` from 18.1.3 to 18.1.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.4/packages/compiler-cli)

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([7afdf5c](https://github.com/hochfrequenz/ahb-tabellen/commit/7afdf5c6363cd9eddcc09ba8968a427efbaa8adc))
- *(other)* ➗ Split `meta.direction` into `sender` and `empfaenger` ([#161](https://github.com/hochfrequenz/ahb-tabellen/issues/161))

* Split meta.direction into `sender` and `empfaenger`

* Fix comment

* Add test cases for splitting and receiving empty `sender`/`empfaenger` - ([052414e](https://github.com/hochfrequenz/ahb-tabellen/commit/052414e66422a9488cf5e4e5a3060a02efd03898))
- *(other)* Bump jest-preset-angular from 14.2.0 to 14.2.2 ([#158](https://github.com/hochfrequenz/ahb-tabellen/issues/158))

Bumps [jest-preset-angular](https://github.com/thymikee/jest-preset-angular) from 14.2.0 to 14.2.2.
- [Release notes](https://github.com/thymikee/jest-preset-angular/releases)
- [Changelog](https://github.com/thymikee/jest-preset-angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/thymikee/jest-preset-angular/compare/v14.2.0...v14.2.2)

---
updated-dependencies:
- dependency-name: jest-preset-angular
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([ccb1d45](https://github.com/hochfrequenz/ahb-tabellen/commit/ccb1d459b6898d27febecd657bb44f62611ad894))
- *(other)* Bump @typescript-eslint/parser from 7.17.0 to 7.18.0 ([#157](https://github.com/hochfrequenz/ahb-tabellen/issues/157))

Bumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 7.17.0 to 7.18.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v7.18.0/packages/parser)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/parser"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([67c157a](https://github.com/hochfrequenz/ahb-tabellen/commit/67c157a3db5a03b2297dab4bd9e06bf1f406be29))
- *(other)* 🧹 Outsource copy-url button related HTML ([#149](https://github.com/hochfrequenz/ahb-tabellen/issues/149))

Move button related html from ahb-page directly to copy component - ([c888581](https://github.com/hochfrequenz/ahb-tabellen/commit/c88858129df39c8c9196ed847ba10d60d575a588))
- *(other)* 🐳 Set restart policy of azurite container to `unless-stopped` ([#150](https://github.com/hochfrequenz/ahb-tabellen/issues/150))

Set restart policy of azurite container to `unless-stopped` - ([db04cc8](https://github.com/hochfrequenz/ahb-tabellen/commit/db04cc8282613b892f983dc8665e77f6ff5fc730))
- *(other)* Bump karma from 6.4.3 to 6.4.4 ([#156](https://github.com/hochfrequenz/ahb-tabellen/issues/156))

Bumps [karma](https://github.com/karma-runner/karma) from 6.4.3 to 6.4.4.
- [Release notes](https://github.com/karma-runner/karma/releases)
- [Changelog](https://github.com/karma-runner/karma/blob/master/CHANGELOG.md)
- [Commits](https://github.com/karma-runner/karma/compare/v6.4.3...v6.4.4)

---
updated-dependencies:
- dependency-name: karma
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([74cb072](https://github.com/hochfrequenz/ahb-tabellen/commit/74cb072d3091967a560ca0837f51b7f4560911da))
- *(other)* Bump tsx from 4.16.2 to 4.16.5 ([#155](https://github.com/hochfrequenz/ahb-tabellen/issues/155))

Bumps [tsx](https://github.com/privatenumber/tsx) from 4.16.2 to 4.16.5.
- [Release notes](https://github.com/privatenumber/tsx/releases)
- [Changelog](https://github.com/privatenumber/tsx/blob/master/release.config.cjs)
- [Commits](https://github.com/privatenumber/tsx/compare/v4.16.2...v4.16.5)

---
updated-dependencies:
- dependency-name: tsx
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([8e1f126](https://github.com/hochfrequenz/ahb-tabellen/commit/8e1f126b660a596b23a8303a906d93b0b3dfe389))
- *(other)* Bump autoprefixer from 10.4.19 to 10.4.20 ([#154](https://github.com/hochfrequenz/ahb-tabellen/issues/154))

Bumps [autoprefixer](https://github.com/postcss/autoprefixer) from 10.4.19 to 10.4.20.
- [Release notes](https://github.com/postcss/autoprefixer/releases)
- [Changelog](https://github.com/postcss/autoprefixer/blob/main/CHANGELOG.md)
- [Commits](https://github.com/postcss/autoprefixer/compare/10.4.19...10.4.20)

---
updated-dependencies:
- dependency-name: autoprefixer
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([6c9ff18](https://github.com/hochfrequenz/ahb-tabellen/commit/6c9ff184cfb65b2c8af69ef1ddab9b300317d20b))
- *(other)* Bump the angular group with 16 updates ([#152](https://github.com/hochfrequenz/ahb-tabellen/issues/152))

Bumps the angular group with 16 updates:

| Package | From | To |
| --- | --- | --- |
| [@angular/animations](https://github.com/angular/angular/tree/HEAD/packages/animations) | `18.1.2` | `18.1.3` |
| [@angular/common](https://github.com/angular/angular/tree/HEAD/packages/common) | `18.1.2` | `18.1.3` |
| [@angular/compiler](https://github.com/angular/angular/tree/HEAD/packages/compiler) | `18.1.2` | `18.1.3` |
| [@angular/core](https://github.com/angular/angular/tree/HEAD/packages/core) | `18.1.2` | `18.1.3` |
| [@angular/forms](https://github.com/angular/angular/tree/HEAD/packages/forms) | `18.1.2` | `18.1.3` |
| [@angular/platform-browser](https://github.com/angular/angular/tree/HEAD/packages/platform-browser) | `18.1.2` | `18.1.3` |
| [@angular/platform-browser-dynamic](https://github.com/angular/angular/tree/HEAD/packages/platform-browser-dynamic) | `18.1.2` | `18.1.3` |
| [@angular/router](https://github.com/angular/angular/tree/HEAD/packages/router) | `18.1.2` | `18.1.3` |
| [@angular-devkit/build-angular](https://github.com/angular/angular-cli) | `18.1.2` | `18.1.3` |
| [@angular-eslint/builder](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/builder) | `18.1.0` | `18.2.0` |
| [@angular-eslint/eslint-plugin](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/eslint-plugin) | `18.1.0` | `18.2.0` |
| [@angular-eslint/eslint-plugin-template](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/eslint-plugin-template) | `18.1.0` | `18.2.0` |
| [@angular-eslint/schematics](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/schematics) | `18.1.0` | `18.2.0` |
| [@angular-eslint/template-parser](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/template-parser) | `18.1.0` | `18.2.0` |
| [@angular/cli](https://github.com/angular/angular-cli) | `18.1.2` | `18.1.3` |
| [@angular/compiler-cli](https://github.com/angular/angular/tree/HEAD/packages/compiler-cli) | `18.1.2` | `18.1.3` |


Updates `@angular/animations` from 18.1.2 to 18.1.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.3/packages/animations)

Updates `@angular/common` from 18.1.2 to 18.1.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.3/packages/common)

Updates `@angular/compiler` from 18.1.2 to 18.1.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.3/packages/compiler)

Updates `@angular/core` from 18.1.2 to 18.1.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.3/packages/core)

Updates `@angular/forms` from 18.1.2 to 18.1.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.3/packages/forms)

Updates `@angular/platform-browser` from 18.1.2 to 18.1.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.3/packages/platform-browser)

Updates `@angular/platform-browser-dynamic` from 18.1.2 to 18.1.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.3/packages/platform-browser-dynamic)

Updates `@angular/router` from 18.1.2 to 18.1.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.3/packages/router)

Updates `@angular-devkit/build-angular` from 18.1.2 to 18.1.3
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.1.2...18.1.3)

Updates `@angular-eslint/builder` from 18.1.0 to 18.2.0
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/builder/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.2.0/packages/builder)

Updates `@angular-eslint/eslint-plugin` from 18.1.0 to 18.2.0
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.2.0/packages/eslint-plugin)

Updates `@angular-eslint/eslint-plugin-template` from 18.1.0 to 18.2.0
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.2.0/packages/eslint-plugin-template)

Updates `@angular-eslint/schematics` from 18.1.0 to 18.2.0
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/schematics/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.2.0/packages/schematics)

Updates `@angular-eslint/template-parser` from 18.1.0 to 18.2.0
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/template-parser/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.2.0/packages/template-parser)

Updates `@angular/cli` from 18.1.2 to 18.1.3
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.1.2...18.1.3)

Updates `@angular/compiler-cli` from 18.1.2 to 18.1.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.3/packages/compiler-cli)

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-eslint/builder"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-eslint/eslint-plugin-template"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-eslint/schematics"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-eslint/template-parser"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([66ae8e3](https://github.com/hochfrequenz/ahb-tabellen/commit/66ae8e325d2c654e44d1fd06e1cd6a8acaccd171))
- *(other)* Bump fast-xml-parser from 4.4.0 to 4.4.1 ([#151](https://github.com/hochfrequenz/ahb-tabellen/issues/151))

Bumps [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser) from 4.4.0 to 4.4.1.
- [Release notes](https://github.com/NaturalIntelligence/fast-xml-parser/releases)
- [Changelog](https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/CHANGELOG.md)
- [Commits](https://github.com/NaturalIntelligence/fast-xml-parser/compare/v4.4.0...v4.4.1)

---
updated-dependencies:
- dependency-name: fast-xml-parser
  dependency-type: indirect
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([46b6ee1](https://github.com/hochfrequenz/ahb-tabellen/commit/46b6ee1fd748da09a1cd17c32bf35928c6f16494))
- *(other)* 🩹 Change pruefi input type to `number` ([#147](https://github.com/hochfrequenz/ahb-tabellen/issues/147))

Change pruefi input type to `number` - ([14c6234](https://github.com/hochfrequenz/ahb-tabellen/commit/14c6234c852f7069ab80e54bfab951575802de16))
- *(other)* ✨ Add component to copy current URL ([#148](https://github.com/hochfrequenz/ahb-tabellen/issues/148))

* Add copy-URL component

* Add unittest for URL copy functionality - ([93cbb4a](https://github.com/hochfrequenz/ahb-tabellen/commit/93cbb4a555819e8dcf82f48c06285c1d16932d92))
- *(other)* ✨ Add EDIFACT format to AHB page ([#145](https://github.com/hochfrequenz/ahb-tabellen/issues/145))

* Add EDIFACT format to AHB page

* Remove unused constant

* Specify UTILMD Strom/Gas

Co-authored-by: kevin <68426071+hf-krechan@users.noreply.github.com>

---------

Co-authored-by: kevin <68426071+hf-krechan@users.noreply.github.com> - ([ca24b80](https://github.com/hochfrequenz/ahb-tabellen/commit/ca24b805806a3ec8f7c2e99696f09311949fa016))
- *(other)* ✏️ Fix typo on landing page ([#142](https://github.com/hochfrequenz/ahb-tabellen/issues/142))

Fix typo on landing page - ([896bb17](https://github.com/hochfrequenz/ahb-tabellen/commit/896bb17a839caf00cb10840108c7343bf5cef505))
- *(other)* Update Architecture Diagram ([#140](https://github.com/hochfrequenz/ahb-tabellen/issues/140)) - ([64fdadb](https://github.com/hochfrequenz/ahb-tabellen/commit/64fdadb6f2331fa5694ccc089cb1b1ea235df8ec))
- *(other)* Bump docker/build-push-action from 6.4.1 to 6.5.0 ([#135](https://github.com/hochfrequenz/ahb-tabellen/issues/135))

Bumps [docker/build-push-action](https://github.com/docker/build-push-action) from 6.4.1 to 6.5.0.
- [Release notes](https://github.com/docker/build-push-action/releases)
- [Commits](https://github.com/docker/build-push-action/compare/v6.4.1...v6.5.0)

---
updated-dependencies:
- dependency-name: docker/build-push-action
  dependency-type: direct:production
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
Co-authored-by: konstantin <konstantin.klein@hochfrequenz.de> - ([99bfb23](https://github.com/hochfrequenz/ahb-tabellen/commit/99bfb2320c5bd33164009bc9bd276247fa6b4b0b))
- *(other)* Bump tailwindcss from 3.4.6 to 3.4.7 ([#139](https://github.com/hochfrequenz/ahb-tabellen/issues/139))

Bumps [tailwindcss](https://github.com/tailwindlabs/tailwindcss) from 3.4.6 to 3.4.7.
- [Release notes](https://github.com/tailwindlabs/tailwindcss/releases)
- [Changelog](https://github.com/tailwindlabs/tailwindcss/blob/v3.4.7/CHANGELOG.md)
- [Commits](https://github.com/tailwindlabs/tailwindcss/compare/v3.4.6...v3.4.7)

---
updated-dependencies:
- dependency-name: tailwindcss
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([7269774](https://github.com/hochfrequenz/ahb-tabellen/commit/7269774512856070246b809ac0be679eaacd7cfa))
- *(other)* Bump postcss from 8.4.39 to 8.4.40 ([#138](https://github.com/hochfrequenz/ahb-tabellen/issues/138))

Bumps [postcss](https://github.com/postcss/postcss) from 8.4.39 to 8.4.40.
- [Release notes](https://github.com/postcss/postcss/releases)
- [Changelog](https://github.com/postcss/postcss/blob/main/CHANGELOG.md)
- [Commits](https://github.com/postcss/postcss/compare/8.4.39...8.4.40)

---
updated-dependencies:
- dependency-name: postcss
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([0fa783a](https://github.com/hochfrequenz/ahb-tabellen/commit/0fa783af0af3011449bf40699e9a39fda7a0515c))
- *(other)* Bump the angular group with 11 updates ([#137](https://github.com/hochfrequenz/ahb-tabellen/issues/137))

Bumps the angular group with 11 updates:

| Package | From | To |
| --- | --- | --- |
| [@angular/animations](https://github.com/angular/angular/tree/HEAD/packages/animations) | `18.1.1` | `18.1.2` |
| [@angular/common](https://github.com/angular/angular/tree/HEAD/packages/common) | `18.1.1` | `18.1.2` |
| [@angular/compiler](https://github.com/angular/angular/tree/HEAD/packages/compiler) | `18.1.1` | `18.1.2` |
| [@angular/core](https://github.com/angular/angular/tree/HEAD/packages/core) | `18.1.1` | `18.1.2` |
| [@angular/forms](https://github.com/angular/angular/tree/HEAD/packages/forms) | `18.1.1` | `18.1.2` |
| [@angular/platform-browser](https://github.com/angular/angular/tree/HEAD/packages/platform-browser) | `18.1.1` | `18.1.2` |
| [@angular/platform-browser-dynamic](https://github.com/angular/angular/tree/HEAD/packages/platform-browser-dynamic) | `18.1.1` | `18.1.2` |
| [@angular/router](https://github.com/angular/angular/tree/HEAD/packages/router) | `18.1.1` | `18.1.2` |
| [@angular-devkit/build-angular](https://github.com/angular/angular-cli) | `18.1.1` | `18.1.2` |
| [@angular/cli](https://github.com/angular/angular-cli) | `18.1.1` | `18.1.2` |
| [@angular/compiler-cli](https://github.com/angular/angular/tree/HEAD/packages/compiler-cli) | `18.1.1` | `18.1.2` |


Updates `@angular/animations` from 18.1.1 to 18.1.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.2/packages/animations)

Updates `@angular/common` from 18.1.1 to 18.1.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.2/packages/common)

Updates `@angular/compiler` from 18.1.1 to 18.1.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.2/packages/compiler)

Updates `@angular/core` from 18.1.1 to 18.1.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.2/packages/core)

Updates `@angular/forms` from 18.1.1 to 18.1.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.2/packages/forms)

Updates `@angular/platform-browser` from 18.1.1 to 18.1.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.2/packages/platform-browser)

Updates `@angular/platform-browser-dynamic` from 18.1.1 to 18.1.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.2/packages/platform-browser-dynamic)

Updates `@angular/router` from 18.1.1 to 18.1.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.2/packages/router)

Updates `@angular-devkit/build-angular` from 18.1.1 to 18.1.2
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.1.1...18.1.2)

Updates `@angular/cli` from 18.1.1 to 18.1.2
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.1.1...18.1.2)

Updates `@angular/compiler-cli` from 18.1.1 to 18.1.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.2/packages/compiler-cli)

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([e8a8b2f](https://github.com/hochfrequenz/ahb-tabellen/commit/e8a8b2fd3bb7f1d7a9669f32d206c2037a0154f6))
- *(other)* Bump docker/login-action from 3.2.0 to 3.3.0 ([#136](https://github.com/hochfrequenz/ahb-tabellen/issues/136))

Bumps [docker/login-action](https://github.com/docker/login-action) from 3.2.0 to 3.3.0.
- [Release notes](https://github.com/docker/login-action/releases)
- [Commits](https://github.com/docker/login-action/compare/v3.2.0...v3.3.0)

---
updated-dependencies:
- dependency-name: docker/login-action
  dependency-type: direct:production
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([2d52bd0](https://github.com/hochfrequenz/ahb-tabellen/commit/2d52bd0304e17f418f0a3ec969fe3761f0296001))
- *(other)* Bump image tag in pulumi ([#128](https://github.com/hochfrequenz/ahb-tabellen/issues/128)) - ([f57aad2](https://github.com/hochfrequenz/ahb-tabellen/commit/f57aad2933a51dba2039f8b5e5e8b247bfcde16d))


## [0.0.3](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.2..v0.0.3) - 2024-07-23

### 🧹 Other

- *(other)* Replace br with tailwind css ([#127](https://github.com/hochfrequenz/ahb-tabellen/issues/127))

* remove br

* use tailwind css - ([feb3b41](https://github.com/hochfrequenz/ahb-tabellen/commit/feb3b418f25b52fda558601e0f911212dd8b3c5b))
- *(other)* Bump @typescript-eslint/eslint-plugin from 7.16.0 to 7.17.0 ([#126](https://github.com/hochfrequenz/ahb-tabellen/issues/126))

Bumps [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/eslint-plugin) from 7.16.0 to 7.17.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v7.17.0/packages/eslint-plugin)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([49e2046](https://github.com/hochfrequenz/ahb-tabellen/commit/49e2046a451b03d4dd984828b890a139912f378a))
- *(other)* Bump @typescript-eslint/parser from 7.16.1 to 7.17.0 ([#125](https://github.com/hochfrequenz/ahb-tabellen/issues/125))

Bumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 7.16.1 to 7.17.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v7.17.0/packages/parser)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/parser"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([09d9315](https://github.com/hochfrequenz/ahb-tabellen/commit/09d9315e8eff5bd438e9e69a13723e5eea6c925b))
- *(other)* Bump @azure/storage-blob from 12.23.0 to 12.24.0 ([#124](https://github.com/hochfrequenz/ahb-tabellen/issues/124))

Bumps [@azure/storage-blob](https://github.com/Azure/azure-sdk-for-js) from 12.23.0 to 12.24.0.
- [Release notes](https://github.com/Azure/azure-sdk-for-js/releases)
- [Changelog](https://github.com/Azure/azure-sdk-for-js/blob/main/documentation/Changelog-for-next-generation.md)
- [Commits](https://github.com/Azure/azure-sdk-for-js/compare/@azure/storage-blob_12.23.0...@azure/storage-blob_12.24.0)

---
updated-dependencies:
- dependency-name: "@azure/storage-blob"
  dependency-type: direct:production
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([d4dba14](https://github.com/hochfrequenz/ahb-tabellen/commit/d4dba140d9b96aba13e1b62cfaf05b5eac26fc33))
- *(other)* Bump jest-preset-angular from 14.1.1 to 14.2.0 ([#123](https://github.com/hochfrequenz/ahb-tabellen/issues/123))

Bumps [jest-preset-angular](https://github.com/thymikee/jest-preset-angular) from 14.1.1 to 14.2.0.
- [Release notes](https://github.com/thymikee/jest-preset-angular/releases)
- [Changelog](https://github.com/thymikee/jest-preset-angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/thymikee/jest-preset-angular/compare/v14.1.1...v14.2.0)

---
updated-dependencies:
- dependency-name: jest-preset-angular
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([97059fe](https://github.com/hochfrequenz/ahb-tabellen/commit/97059fea3486571df2738851ce48172a33529e85))
- *(other)* Bump typescript from 5.5.3 to 5.5.4 ([#122](https://github.com/hochfrequenz/ahb-tabellen/issues/122))

Bumps [typescript](https://github.com/Microsoft/TypeScript) from 5.5.3 to 5.5.4.
- [Release notes](https://github.com/Microsoft/TypeScript/releases)
- [Changelog](https://github.com/microsoft/TypeScript/blob/main/azure-pipelines.release.yml)
- [Commits](https://github.com/Microsoft/TypeScript/compare/v5.5.3...v5.5.4)

---
updated-dependencies:
- dependency-name: typescript
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([82f08d2](https://github.com/hochfrequenz/ahb-tabellen/commit/82f08d2eeea96cce333dd1ca17b56ee316cc5e6e))
- *(other)* Improve the column names ([#121](https://github.com/hochfrequenz/ahb-tabellen/issues/121)) - ([87f9afe](https://github.com/hochfrequenz/ahb-tabellen/commit/87f9afec8770b160fd08c9b3c597954316cbd750))
- *(other)* Bump docker/build-push-action from 6.3.0 to 6.4.1 ([#120](https://github.com/hochfrequenz/ahb-tabellen/issues/120))

Bumps [docker/build-push-action](https://github.com/docker/build-push-action) from 6.3.0 to 6.4.1.
- [Release notes](https://github.com/docker/build-push-action/releases)
- [Commits](https://github.com/docker/build-push-action/compare/v6.3.0...v6.4.1)

---
updated-dependencies:
- dependency-name: docker/build-push-action
  dependency-type: direct:production
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([a3169b0](https://github.com/hochfrequenz/ahb-tabellen/commit/a3169b0c5c5367db07059ca8c053c3759becf1f4))
- *(other)* Bump typescript from 5.4.5 to 5.5.3 ([#119](https://github.com/hochfrequenz/ahb-tabellen/issues/119))

Bumps [typescript](https://github.com/Microsoft/TypeScript) from 5.4.5 to 5.5.3.
- [Release notes](https://github.com/Microsoft/TypeScript/releases)
- [Changelog](https://github.com/microsoft/TypeScript/blob/main/azure-pipelines.release.yml)
- [Commits](https://github.com/Microsoft/TypeScript/compare/v5.4.5...v5.5.3)

---
updated-dependencies:
- dependency-name: typescript
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([bc6f08c](https://github.com/hochfrequenz/ahb-tabellen/commit/bc6f08cc0fa483c963bee3a5b3fb208cb00496ca))
- *(other)* Bump @typescript-eslint/parser from 7.16.0 to 7.16.1 ([#118](https://github.com/hochfrequenz/ahb-tabellen/issues/118))

Bumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 7.16.0 to 7.16.1.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v7.16.1/packages/parser)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/parser"
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([256067b](https://github.com/hochfrequenz/ahb-tabellen/commit/256067b0e76c2b8d4d8e18a85f4ec2187bc31224))
- *(other)* Bump zone.js from 0.14.7 to 0.14.8 ([#117](https://github.com/hochfrequenz/ahb-tabellen/issues/117))

Bumps [zone.js](https://github.com/angular/angular/tree/HEAD/packages/zone.js) from 0.14.7 to 0.14.8.
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/packages/zone.js/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/zone.js-0.14.8/packages/zone.js)

---
updated-dependencies:
- dependency-name: zone.js
  dependency-type: direct:production
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([6ce9afe](https://github.com/hochfrequenz/ahb-tabellen/commit/6ce9afeff9b5304ae43008a783acb7a101ddff86))
- *(other)* Bump tailwindcss from 3.4.4 to 3.4.6 ([#116](https://github.com/hochfrequenz/ahb-tabellen/issues/116))

Bumps [tailwindcss](https://github.com/tailwindlabs/tailwindcss) from 3.4.4 to 3.4.6.
- [Release notes](https://github.com/tailwindlabs/tailwindcss/releases)
- [Changelog](https://github.com/tailwindlabs/tailwindcss/blob/v3.4.6/CHANGELOG.md)
- [Commits](https://github.com/tailwindlabs/tailwindcss/compare/v3.4.4...v3.4.6)

---
updated-dependencies:
- dependency-name: tailwindcss
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([807b7d6](https://github.com/hochfrequenz/ahb-tabellen/commit/807b7d63c494f03617b5faeba18cb59a8ad61b4e))
- *(other)* Bump the angular group with 11 updates ([#115](https://github.com/hochfrequenz/ahb-tabellen/issues/115))

Bumps the angular group with 11 updates:

| Package | From | To |
| --- | --- | --- |
| [@angular/animations](https://github.com/angular/angular/tree/HEAD/packages/animations) | `18.1.0` | `18.1.1` |
| [@angular/common](https://github.com/angular/angular/tree/HEAD/packages/common) | `18.1.0` | `18.1.1` |
| [@angular/compiler](https://github.com/angular/angular/tree/HEAD/packages/compiler) | `18.1.0` | `18.1.1` |
| [@angular/core](https://github.com/angular/angular/tree/HEAD/packages/core) | `18.1.0` | `18.1.1` |
| [@angular/forms](https://github.com/angular/angular/tree/HEAD/packages/forms) | `18.1.0` | `18.1.1` |
| [@angular/platform-browser](https://github.com/angular/angular/tree/HEAD/packages/platform-browser) | `18.1.0` | `18.1.1` |
| [@angular/platform-browser-dynamic](https://github.com/angular/angular/tree/HEAD/packages/platform-browser-dynamic) | `18.1.0` | `18.1.1` |
| [@angular/router](https://github.com/angular/angular/tree/HEAD/packages/router) | `18.1.0` | `18.1.1` |
| [@angular-devkit/build-angular](https://github.com/angular/angular-cli) | `18.1.0` | `18.1.1` |
| [@angular/cli](https://github.com/angular/angular-cli) | `18.1.0` | `18.1.1` |
| [@angular/compiler-cli](https://github.com/angular/angular/tree/HEAD/packages/compiler-cli) | `18.1.0` | `18.1.1` |


Updates `@angular/animations` from 18.1.0 to 18.1.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.1/packages/animations)

Updates `@angular/common` from 18.1.0 to 18.1.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.1/packages/common)

Updates `@angular/compiler` from 18.1.0 to 18.1.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.1/packages/compiler)

Updates `@angular/core` from 18.1.0 to 18.1.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.1/packages/core)

Updates `@angular/forms` from 18.1.0 to 18.1.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.1/packages/forms)

Updates `@angular/platform-browser` from 18.1.0 to 18.1.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.1/packages/platform-browser)

Updates `@angular/platform-browser-dynamic` from 18.1.0 to 18.1.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.1/packages/platform-browser-dynamic)

Updates `@angular/router` from 18.1.0 to 18.1.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.1/packages/router)

Updates `@angular-devkit/build-angular` from 18.1.0 to 18.1.1
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.1.0...18.1.1)

Updates `@angular/cli` from 18.1.0 to 18.1.1
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.1.0...18.1.1)

Updates `@angular/compiler-cli` from 18.1.0 to 18.1.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.1/packages/compiler-cli)

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([e3697d1](https://github.com/hochfrequenz/ahb-tabellen/commit/e3697d19d6d6c3192185d9a4ee49cf5953222cb6))
- *(other)* 📝 Add more setup information ([#64](https://github.com/hochfrequenz/ahb-tabellen/issues/64))

* Add setup information

* Format

* Typo

* Fix markdown

* Format

* Remove line breaks and add note to the top of the setup information - ([8ea9678](https://github.com/hochfrequenz/ahb-tabellen/commit/8ea9678b58de45f3edd7e7588a97ba74004d9221))
- *(other)* Use AppService Instead of ContainerGroup ([#113](https://github.com/hochfrequenz/ahb-tabellen/issues/113))

* wip

* use app service plan and web app

* change port to 80 and bump version

* add comment

* update ahb documents - ([2cfefaf](https://github.com/hochfrequenz/ahb-tabellen/commit/2cfefafeb942b122b59fbd11274b1928fc970190))
- *(other)* Format Text On AHB Landing Page ([#114](https://github.com/hochfrequenz/ahb-tabellen/issues/114))

* Stick to "Sie"

* Add new line - ([d685cf6](https://github.com/hochfrequenz/ahb-tabellen/commit/d685cf676908bbc21765388f22ea25a0404d8aed))
- *(other)* Add column for bedingung ([#112](https://github.com/hochfrequenz/ahb-tabellen/issues/112)) - ([7ac9932](https://github.com/hochfrequenz/ahb-tabellen/commit/7ac993265c3ad6c7964cfd62eee90917ca84ddc6))


## [0.0.2](https://github.com/hochfrequenz/ahb-tabellen/compare/v0.0.1..v0.0.2) - 2024-07-16

### 🧹 Other

- *(other)* Bump @typescript-eslint/parser from 7.15.0 to 7.16.0 ([#108](https://github.com/hochfrequenz/ahb-tabellen/issues/108))

* Bump @typescript-eslint/parser from 7.15.0 to 7.16.0

Bumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 7.15.0 to 7.16.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v7.16.0/packages/parser)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/parser"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>

* bump version of @typescript-eslint/parser

* bump version of @typescript-eslint/eslint-plugin

---------

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
Co-authored-by: kevin <kevin.krechan@hochfrequenz.de> - ([5015992](https://github.com/hochfrequenz/ahb-tabellen/commit/50159920e7061ce45afd99ef6b99cae9153dd860))
- *(other)* Change search placeholder ([#110](https://github.com/hochfrequenz/ahb-tabellen/issues/110))

* change search placeholder

* change placeholde - ([3adad4b](https://github.com/hochfrequenz/ahb-tabellen/commit/3adad4b2a04a4a4d21ec1420948411c62ff064ed))
- *(other)* Add qualifier column ([#111](https://github.com/hochfrequenz/ahb-tabellen/issues/111)) - ([321e708](https://github.com/hochfrequenz/ahb-tabellen/commit/321e70842be2ab5a010ec345604fb2a33814b6c3))
- *(other)* ✨ Change app title to `AHB Tabellen` ([#104](https://github.com/hochfrequenz/ahb-tabellen/issues/104)) - ([dd17379](https://github.com/hochfrequenz/ahb-tabellen/commit/dd17379ba493948faa46f4a374253c504a993914))
- *(other)* Bump prettier from 3.3.2 to 3.3.3 ([#107](https://github.com/hochfrequenz/ahb-tabellen/issues/107))

Bumps [prettier](https://github.com/prettier/prettier) from 3.3.2 to 3.3.3.
- [Release notes](https://github.com/prettier/prettier/releases)
- [Changelog](https://github.com/prettier/prettier/blob/main/CHANGELOG.md)
- [Commits](https://github.com/prettier/prettier/compare/3.3.2...3.3.3)

---
updated-dependencies:
- dependency-name: prettier
  dependency-type: direct:production
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([8b6ead8](https://github.com/hochfrequenz/ahb-tabellen/commit/8b6ead8dd85fd5b912f9b24c14d25dfc39850f7f))
- *(other)* Bump @typescript-eslint/eslint-plugin from 7.15.0 to 7.16.0 ([#106](https://github.com/hochfrequenz/ahb-tabellen/issues/106))

Bumps [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/eslint-plugin) from 7.15.0 to 7.16.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v7.16.0/packages/eslint-plugin)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([f2ddac7](https://github.com/hochfrequenz/ahb-tabellen/commit/f2ddac7b96e8a8e2eb3a6f4a61f16f7cc0600842))
- *(other)* Bump the angular group with 11 updates ([#105](https://github.com/hochfrequenz/ahb-tabellen/issues/105))

Bumps the angular group with 11 updates:

| Package | From | To |
| --- | --- | --- |
| [@angular/animations](https://github.com/angular/angular/tree/HEAD/packages/animations) | `18.0.6` | `18.1.0` |
| [@angular/common](https://github.com/angular/angular/tree/HEAD/packages/common) | `18.0.6` | `18.1.0` |
| [@angular/compiler](https://github.com/angular/angular/tree/HEAD/packages/compiler) | `18.0.6` | `18.1.0` |
| [@angular/core](https://github.com/angular/angular/tree/HEAD/packages/core) | `18.0.6` | `18.1.0` |
| [@angular/forms](https://github.com/angular/angular/tree/HEAD/packages/forms) | `18.0.6` | `18.1.0` |
| [@angular/platform-browser](https://github.com/angular/angular/tree/HEAD/packages/platform-browser) | `18.0.6` | `18.1.0` |
| [@angular/platform-browser-dynamic](https://github.com/angular/angular/tree/HEAD/packages/platform-browser-dynamic) | `18.0.6` | `18.1.0` |
| [@angular/router](https://github.com/angular/angular/tree/HEAD/packages/router) | `18.0.6` | `18.1.0` |
| [@angular-devkit/build-angular](https://github.com/angular/angular-cli) | `18.0.7` | `18.1.0` |
| [@angular/cli](https://github.com/angular/angular-cli) | `18.0.7` | `18.1.0` |
| [@angular/compiler-cli](https://github.com/angular/angular/tree/HEAD/packages/compiler-cli) | `18.0.6` | `18.1.0` |


Updates `@angular/animations` from 18.0.6 to 18.1.0
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.0/packages/animations)

Updates `@angular/common` from 18.0.6 to 18.1.0
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.0/packages/common)

Updates `@angular/compiler` from 18.0.6 to 18.1.0
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.0/packages/compiler)

Updates `@angular/core` from 18.0.6 to 18.1.0
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.0/packages/core)

Updates `@angular/forms` from 18.0.6 to 18.1.0
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.0/packages/forms)

Updates `@angular/platform-browser` from 18.0.6 to 18.1.0
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.0/packages/platform-browser)

Updates `@angular/platform-browser-dynamic` from 18.0.6 to 18.1.0
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.0/packages/platform-browser-dynamic)

Updates `@angular/router` from 18.0.6 to 18.1.0
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.0/packages/router)

Updates `@angular-devkit/build-angular` from 18.0.7 to 18.1.0
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.0.7...18.1.0)

Updates `@angular/cli` from 18.0.7 to 18.1.0
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.0.7...18.1.0)

Updates `@angular/compiler-cli` from 18.0.6 to 18.1.0
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.1.0/packages/compiler-cli)

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([286d7bd](https://github.com/hochfrequenz/ahb-tabellen/commit/286d7bd43a74d83f681c5b23231a04b1ff454a0a))
- *(other)* ➕ Add footer component to AHB pages ([#62](https://github.com/hochfrequenz/ahb-tabellen/issues/62))

* Add footer component to AHB pages

* Fix footer padding

* Fix ahb landing page viewport

* Format

* Match header and footer height

* Fix landing page viewport

* Format - ([0b60286](https://github.com/hochfrequenz/ahb-tabellen/commit/0b6028656d77a3debe0e3dcdb8e6118b704fd197))
- *(other)* Add Pulumi Setup ([#91](https://github.com/hochfrequenz/ahb-tabellen/issues/91))

* pulumi new

* 🚧wip

* 🙈 pulumi/.venv

* 🚧 WIP Gh action

* ⚙️ Change trigger

* remove unused imports

* 🖤 apply black

* 🚧 wip

* update pulumi dev config

* read ghcr_token from ahb tabellen config

* 🚧📝 WIP PulumiDocumentation

* 🐳🙈 add pulumi folder to dockerignore

* 🚧🎨 clean up

* Fix typo in comment

* 🎉 starting container

* ⚙️ update dev config

* 🔥 remove unused files

* 🔥 remove uneccessary lines

* set variable for format_version_container_name

* 📝 add documentation

* Add info about python virtual environment

* 🙈 Update gitignore

* ➖ remove unused dependencies

* apply prettier

---------

Co-authored-by: Leon Haffmans <leon.haffmans@hochfrequenz.de> - ([a5023b7](https://github.com/hochfrequenz/ahb-tabellen/commit/a5023b7ac8326c85dbaa92c72fd4f1ba13001f8c))
- *(other)* Bump @typescript-eslint/parser from 7.14.1 to 7.15.0 ([#96](https://github.com/hochfrequenz/ahb-tabellen/issues/96))

Bumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 7.14.1 to 7.15.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v7.15.0/packages/parser)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/parser"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([1047c3e](https://github.com/hochfrequenz/ahb-tabellen/commit/1047c3e024ba2439b03e2710912eba262d40c610))
- *(other)* Bump @typescript-eslint/eslint-plugin from 7.14.1 to 7.15.0 ([#95](https://github.com/hochfrequenz/ahb-tabellen/issues/95))

Bumps [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/eslint-plugin) from 7.14.1 to 7.15.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v7.15.0/packages/eslint-plugin)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([b9ad15b](https://github.com/hochfrequenz/ahb-tabellen/commit/b9ad15bd4c6b3ecb0d5d9c2bbf3b4242136a2b50))
- *(other)* Bump tsx from 4.16.0 to 4.16.2 ([#94](https://github.com/hochfrequenz/ahb-tabellen/issues/94))

Bumps [tsx](https://github.com/privatenumber/tsx) from 4.16.0 to 4.16.2.
- [Release notes](https://github.com/privatenumber/tsx/releases)
- [Changelog](https://github.com/privatenumber/tsx/blob/master/release.config.cjs)
- [Commits](https://github.com/privatenumber/tsx/compare/v4.16.0...v4.16.2)

---
updated-dependencies:
- dependency-name: tsx
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([332f124](https://github.com/hochfrequenz/ahb-tabellen/commit/332f124bed0e9bf4f24fc912981f2ee6ff5d6f25))
- *(other)* Bump the angular group with 16 updates ([#93](https://github.com/hochfrequenz/ahb-tabellen/issues/93))

Bumps the angular group with 16 updates:

| Package | From | To |
| --- | --- | --- |
| [@angular/animations](https://github.com/angular/angular/tree/HEAD/packages/animations) | `18.0.5` | `18.0.6` |
| [@angular/common](https://github.com/angular/angular/tree/HEAD/packages/common) | `18.0.5` | `18.0.6` |
| [@angular/compiler](https://github.com/angular/angular/tree/HEAD/packages/compiler) | `18.0.5` | `18.0.6` |
| [@angular/core](https://github.com/angular/angular/tree/HEAD/packages/core) | `18.0.5` | `18.0.6` |
| [@angular/forms](https://github.com/angular/angular/tree/HEAD/packages/forms) | `18.0.5` | `18.0.6` |
| [@angular/platform-browser](https://github.com/angular/angular/tree/HEAD/packages/platform-browser) | `18.0.5` | `18.0.6` |
| [@angular/platform-browser-dynamic](https://github.com/angular/angular/tree/HEAD/packages/platform-browser-dynamic) | `18.0.5` | `18.0.6` |
| [@angular/router](https://github.com/angular/angular/tree/HEAD/packages/router) | `18.0.5` | `18.0.6` |
| [@angular-devkit/build-angular](https://github.com/angular/angular-cli) | `18.0.6` | `18.0.7` |
| [@angular-eslint/builder](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/builder) | `18.0.1` | `18.1.0` |
| [@angular-eslint/eslint-plugin](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/eslint-plugin) | `18.0.1` | `18.1.0` |
| [@angular-eslint/eslint-plugin-template](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/eslint-plugin-template) | `18.0.1` | `18.1.0` |
| [@angular-eslint/schematics](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/schematics) | `18.0.1` | `18.1.0` |
| [@angular-eslint/template-parser](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/template-parser) | `18.0.1` | `18.1.0` |
| [@angular/cli](https://github.com/angular/angular-cli) | `18.0.6` | `18.0.7` |
| [@angular/compiler-cli](https://github.com/angular/angular/tree/HEAD/packages/compiler-cli) | `18.0.5` | `18.0.6` |


Updates `@angular/animations` from 18.0.5 to 18.0.6
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.6/packages/animations)

Updates `@angular/common` from 18.0.5 to 18.0.6
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.6/packages/common)

Updates `@angular/compiler` from 18.0.5 to 18.0.6
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.6/packages/compiler)

Updates `@angular/core` from 18.0.5 to 18.0.6
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.6/packages/core)

Updates `@angular/forms` from 18.0.5 to 18.0.6
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.6/packages/forms)

Updates `@angular/platform-browser` from 18.0.5 to 18.0.6
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.6/packages/platform-browser)

Updates `@angular/platform-browser-dynamic` from 18.0.5 to 18.0.6
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.6/packages/platform-browser-dynamic)

Updates `@angular/router` from 18.0.5 to 18.0.6
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.6/packages/router)

Updates `@angular-devkit/build-angular` from 18.0.6 to 18.0.7
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.0.6...18.0.7)

Updates `@angular-eslint/builder` from 18.0.1 to 18.1.0
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/builder/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.1.0/packages/builder)

Updates `@angular-eslint/eslint-plugin` from 18.0.1 to 18.1.0
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.1.0/packages/eslint-plugin)

Updates `@angular-eslint/eslint-plugin-template` from 18.0.1 to 18.1.0
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.1.0/packages/eslint-plugin-template)

Updates `@angular-eslint/schematics` from 18.0.1 to 18.1.0
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/schematics/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.1.0/packages/schematics)

Updates `@angular-eslint/template-parser` from 18.0.1 to 18.1.0
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/template-parser/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.1.0/packages/template-parser)

Updates `@angular/cli` from 18.0.6 to 18.0.7
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.0.6...18.0.7)

Updates `@angular/compiler-cli` from 18.0.5 to 18.0.6
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.6/packages/compiler-cli)

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-eslint/builder"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-eslint/eslint-plugin-template"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-eslint/schematics"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-eslint/template-parser"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([e0d70b2](https://github.com/hochfrequenz/ahb-tabellen/commit/e0d70b25563b3bd46df9045a79d5d782fd2a83a6))
- *(other)* Bump docker/build-push-action from 5.3.0 to 6.3.0 ([#92](https://github.com/hochfrequenz/ahb-tabellen/issues/92))

Bumps [docker/build-push-action](https://github.com/docker/build-push-action) from 5.3.0 to 6.3.0.
- [Release notes](https://github.com/docker/build-push-action/releases)
- [Commits](https://github.com/docker/build-push-action/compare/v5.3.0...v6.3.0)

---
updated-dependencies:
- dependency-name: docker/build-push-action
  dependency-type: direct:production
  update-type: version-update:semver-major
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([d17c1c2](https://github.com/hochfrequenz/ahb-tabellen/commit/d17c1c2996d2fc53132babde519423151a0d5a80))


## [0.0.1] - 2024-07-05

### 🧹 Other

- *(other)* Add GH Action To Create Docker Image ([#90](https://github.com/hochfrequenz/ahb-tabellen/issues/90))

* 🚧 WIP Gh action

* ⚙️ Change trigger

* Apply prettier - ([407f5d9](https://github.com/hochfrequenz/ahb-tabellen/commit/407f5d9f51b2f03d22c8cd9d325e7a4c8dedc573))
- *(other)* Bump @typescript-eslint/eslint-plugin from 7.13.1 to 7.14.1 ([#87](https://github.com/hochfrequenz/ahb-tabellen/issues/87))

Bumps [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/eslint-plugin) from 7.13.1 to 7.14.1.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v7.14.1/packages/eslint-plugin)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([3059493](https://github.com/hochfrequenz/ahb-tabellen/commit/3059493ff791d85601165ce0f48b0a7b1e5d9ea9))
- *(other)* Bump tsx from 4.15.7 to 4.16.0 ([#88](https://github.com/hochfrequenz/ahb-tabellen/issues/88))

Bumps [tsx](https://github.com/privatenumber/tsx) from 4.15.7 to 4.16.0.
- [Release notes](https://github.com/privatenumber/tsx/releases)
- [Changelog](https://github.com/privatenumber/tsx/blob/master/release.config.cjs)
- [Commits](https://github.com/privatenumber/tsx/compare/v4.15.7...v4.16.0)

---
updated-dependencies:
- dependency-name: tsx
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([01eeca8](https://github.com/hochfrequenz/ahb-tabellen/commit/01eeca824f206f4a661fc0fafa00a5c130a1339c))
- *(other)* Bump postcss from 8.4.38 to 8.4.39 ([#86](https://github.com/hochfrequenz/ahb-tabellen/issues/86))

Bumps [postcss](https://github.com/postcss/postcss) from 8.4.38 to 8.4.39.
- [Release notes](https://github.com/postcss/postcss/releases)
- [Changelog](https://github.com/postcss/postcss/blob/main/CHANGELOG.md)
- [Commits](https://github.com/postcss/postcss/compare/8.4.38...8.4.39)

---
updated-dependencies:
- dependency-name: postcss
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([41541cb](https://github.com/hochfrequenz/ahb-tabellen/commit/41541cb44d93aa7b30c0065ba27127e8d86790a4))
- *(other)* Bump @typescript-eslint/parser from 7.13.1 to 7.14.1 ([#85](https://github.com/hochfrequenz/ahb-tabellen/issues/85))

Bumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 7.13.1 to 7.14.1.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v7.14.1/packages/parser)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/parser"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([77c8459](https://github.com/hochfrequenz/ahb-tabellen/commit/77c8459342a059042141769fc81126a766f5f06a))
- *(other)* Bump the angular group with 11 updates ([#84](https://github.com/hochfrequenz/ahb-tabellen/issues/84))

Bumps the angular group with 11 updates:

| Package | From | To |
| --- | --- | --- |
| [@angular/animations](https://github.com/angular/angular/tree/HEAD/packages/animations) | `18.0.4` | `18.0.5` |
| [@angular/common](https://github.com/angular/angular/tree/HEAD/packages/common) | `18.0.4` | `18.0.5` |
| [@angular/compiler](https://github.com/angular/angular/tree/HEAD/packages/compiler) | `18.0.4` | `18.0.5` |
| [@angular/core](https://github.com/angular/angular/tree/HEAD/packages/core) | `18.0.4` | `18.0.5` |
| [@angular/forms](https://github.com/angular/angular/tree/HEAD/packages/forms) | `18.0.4` | `18.0.5` |
| [@angular/platform-browser](https://github.com/angular/angular/tree/HEAD/packages/platform-browser) | `18.0.4` | `18.0.5` |
| [@angular/platform-browser-dynamic](https://github.com/angular/angular/tree/HEAD/packages/platform-browser-dynamic) | `18.0.4` | `18.0.5` |
| [@angular/router](https://github.com/angular/angular/tree/HEAD/packages/router) | `18.0.4` | `18.0.5` |
| [@angular-devkit/build-angular](https://github.com/angular/angular-cli) | `18.0.5` | `18.0.6` |
| [@angular/cli](https://github.com/angular/angular-cli) | `18.0.5` | `18.0.6` |
| [@angular/compiler-cli](https://github.com/angular/angular/tree/HEAD/packages/compiler-cli) | `18.0.4` | `18.0.5` |


Updates `@angular/animations` from 18.0.4 to 18.0.5
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.5/packages/animations)

Updates `@angular/common` from 18.0.4 to 18.0.5
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.5/packages/common)

Updates `@angular/compiler` from 18.0.4 to 18.0.5
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.5/packages/compiler)

Updates `@angular/core` from 18.0.4 to 18.0.5
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.5/packages/core)

Updates `@angular/forms` from 18.0.4 to 18.0.5
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.5/packages/forms)

Updates `@angular/platform-browser` from 18.0.4 to 18.0.5
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.5/packages/platform-browser)

Updates `@angular/platform-browser-dynamic` from 18.0.4 to 18.0.5
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.5/packages/platform-browser-dynamic)

Updates `@angular/router` from 18.0.4 to 18.0.5
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.5/packages/router)

Updates `@angular-devkit/build-angular` from 18.0.5 to 18.0.6
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.0.5...18.0.6)

Updates `@angular/cli` from 18.0.5 to 18.0.6
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.0.5...18.0.6)

Updates `@angular/compiler-cli` from 18.0.4 to 18.0.5
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.5/packages/compiler-cli)

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([7582732](https://github.com/hochfrequenz/ahb-tabellen/commit/7582732b74a5881c3185714ed4071c7ea3fdcbb6))
- *(other)* Bump @typescript-eslint/parser from 7.13.0 to 7.13.1 ([#83](https://github.com/hochfrequenz/ahb-tabellen/issues/83))

Bumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 7.13.0 to 7.13.1.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v7.13.1/packages/parser)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/parser"
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([4cf1595](https://github.com/hochfrequenz/ahb-tabellen/commit/4cf1595e0b62ea58628020135a8be9e333719a85))
- *(other)* Bump jest-preset-angular from 14.1.0 to 14.1.1 ([#82](https://github.com/hochfrequenz/ahb-tabellen/issues/82))

Bumps [jest-preset-angular](https://github.com/thymikee/jest-preset-angular) from 14.1.0 to 14.1.1.
- [Release notes](https://github.com/thymikee/jest-preset-angular/releases)
- [Changelog](https://github.com/thymikee/jest-preset-angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/thymikee/jest-preset-angular/compare/v14.1.0...v14.1.1)

---
updated-dependencies:
- dependency-name: jest-preset-angular
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([882231f](https://github.com/hochfrequenz/ahb-tabellen/commit/882231ffd535d4a8d4e2a0c23865e7c7456ea661))
- *(other)* Bump tsx from 4.15.5 to 4.15.7 ([#81](https://github.com/hochfrequenz/ahb-tabellen/issues/81))

Bumps [tsx](https://github.com/privatenumber/tsx) from 4.15.5 to 4.15.7.
- [Release notes](https://github.com/privatenumber/tsx/releases)
- [Changelog](https://github.com/privatenumber/tsx/blob/master/release.config.cjs)
- [Commits](https://github.com/privatenumber/tsx/compare/v4.15.5...v4.15.7)

---
updated-dependencies:
- dependency-name: tsx
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([d30346d](https://github.com/hochfrequenz/ahb-tabellen/commit/d30346dfd62d549b5ae0b4c3a16c23a3199e5058))
- *(other)* Bump @typescript-eslint/eslint-plugin from 7.13.0 to 7.13.1 ([#80](https://github.com/hochfrequenz/ahb-tabellen/issues/80))

Bumps [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/eslint-plugin) from 7.13.0 to 7.13.1.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v7.13.1/packages/eslint-plugin)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([da7a6ee](https://github.com/hochfrequenz/ahb-tabellen/commit/da7a6ee377950607927e54cdeb6898de3523c4c2))
- *(other)* Bump the angular group with 11 updates ([#79](https://github.com/hochfrequenz/ahb-tabellen/issues/79))

Bumps the angular group with 11 updates:

| Package | From | To |
| --- | --- | --- |
| [@angular/animations](https://github.com/angular/angular/tree/HEAD/packages/animations) | `18.0.3` | `18.0.4` |
| [@angular/common](https://github.com/angular/angular/tree/HEAD/packages/common) | `18.0.3` | `18.0.4` |
| [@angular/compiler](https://github.com/angular/angular/tree/HEAD/packages/compiler) | `18.0.3` | `18.0.4` |
| [@angular/core](https://github.com/angular/angular/tree/HEAD/packages/core) | `18.0.3` | `18.0.4` |
| [@angular/forms](https://github.com/angular/angular/tree/HEAD/packages/forms) | `18.0.3` | `18.0.4` |
| [@angular/platform-browser](https://github.com/angular/angular/tree/HEAD/packages/platform-browser) | `18.0.3` | `18.0.4` |
| [@angular/platform-browser-dynamic](https://github.com/angular/angular/tree/HEAD/packages/platform-browser-dynamic) | `18.0.3` | `18.0.4` |
| [@angular/router](https://github.com/angular/angular/tree/HEAD/packages/router) | `18.0.3` | `18.0.4` |
| [@angular-devkit/build-angular](https://github.com/angular/angular-cli) | `18.0.4` | `18.0.5` |
| [@angular/cli](https://github.com/angular/angular-cli) | `18.0.4` | `18.0.5` |
| [@angular/compiler-cli](https://github.com/angular/angular/tree/HEAD/packages/compiler-cli) | `18.0.3` | `18.0.4` |


Updates `@angular/animations` from 18.0.3 to 18.0.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.4/packages/animations)

Updates `@angular/common` from 18.0.3 to 18.0.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.4/packages/common)

Updates `@angular/compiler` from 18.0.3 to 18.0.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.4/packages/compiler)

Updates `@angular/core` from 18.0.3 to 18.0.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.4/packages/core)

Updates `@angular/forms` from 18.0.3 to 18.0.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.4/packages/forms)

Updates `@angular/platform-browser` from 18.0.3 to 18.0.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.4/packages/platform-browser)

Updates `@angular/platform-browser-dynamic` from 18.0.3 to 18.0.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.4/packages/platform-browser-dynamic)

Updates `@angular/router` from 18.0.3 to 18.0.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.4/packages/router)

Updates `@angular-devkit/build-angular` from 18.0.4 to 18.0.5
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.0.4...18.0.5)

Updates `@angular/cli` from 18.0.4 to 18.0.5
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.0.4...18.0.5)

Updates `@angular/compiler-cli` from 18.0.3 to 18.0.4
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.4/packages/compiler-cli)

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([00f6b67](https://github.com/hochfrequenz/ahb-tabellen/commit/00f6b6751297ab944266971e084c7aea9cc3ab2a))
- *(other)* Bump @typescript-eslint/parser from 7.12.0 to 7.13.0 ([#76](https://github.com/hochfrequenz/ahb-tabellen/issues/76))

Bumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 7.12.0 to 7.13.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v7.13.0/packages/parser)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/parser"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([255d445](https://github.com/hochfrequenz/ahb-tabellen/commit/255d445ec0bbf45d163b1d4d146a52b82ed97bfd))
- *(other)* Bump prettier from 3.3.1 to 3.3.2 ([#78](https://github.com/hochfrequenz/ahb-tabellen/issues/78))

Bumps [prettier](https://github.com/prettier/prettier) from 3.3.1 to 3.3.2.
- [Release notes](https://github.com/prettier/prettier/releases)
- [Changelog](https://github.com/prettier/prettier/blob/main/CHANGELOG.md)
- [Commits](https://github.com/prettier/prettier/compare/3.3.1...3.3.2)

---
updated-dependencies:
- dependency-name: prettier
  dependency-type: direct:production
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([fc34b2a](https://github.com/hochfrequenz/ahb-tabellen/commit/fc34b2a1a49f188f8404314a274ed248dd709bd4))
- *(other)* Bump tsx from 4.15.1 to 4.15.5 ([#77](https://github.com/hochfrequenz/ahb-tabellen/issues/77))

Bumps [tsx](https://github.com/privatenumber/tsx) from 4.15.1 to 4.15.5.
- [Release notes](https://github.com/privatenumber/tsx/releases)
- [Changelog](https://github.com/privatenumber/tsx/blob/master/release.config.cjs)
- [Commits](https://github.com/privatenumber/tsx/compare/v4.15.1...v4.15.5)

---
updated-dependencies:
- dependency-name: tsx
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([fdfd409](https://github.com/hochfrequenz/ahb-tabellen/commit/fdfd40998086c395a17f0e27cad431a28161ea82))
- *(other)* Bump @typescript-eslint/eslint-plugin from 7.12.0 to 7.13.0 ([#75](https://github.com/hochfrequenz/ahb-tabellen/issues/75))

Bumps [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/eslint-plugin) from 7.12.0 to 7.13.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v7.13.0/packages/eslint-plugin)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([75bae5e](https://github.com/hochfrequenz/ahb-tabellen/commit/75bae5ed49e602a9efa31ef990389e05ab25f3cc))
- *(other)* Bump the angular group with 11 updates ([#74](https://github.com/hochfrequenz/ahb-tabellen/issues/74))

Bumps the angular group with 11 updates:

| Package | From | To |
| --- | --- | --- |
| [@angular/animations](https://github.com/angular/angular/tree/HEAD/packages/animations) | `18.0.2` | `18.0.3` |
| [@angular/common](https://github.com/angular/angular/tree/HEAD/packages/common) | `18.0.2` | `18.0.3` |
| [@angular/compiler](https://github.com/angular/angular/tree/HEAD/packages/compiler) | `18.0.2` | `18.0.3` |
| [@angular/core](https://github.com/angular/angular/tree/HEAD/packages/core) | `18.0.2` | `18.0.3` |
| [@angular/forms](https://github.com/angular/angular/tree/HEAD/packages/forms) | `18.0.2` | `18.0.3` |
| [@angular/platform-browser](https://github.com/angular/angular/tree/HEAD/packages/platform-browser) | `18.0.2` | `18.0.3` |
| [@angular/platform-browser-dynamic](https://github.com/angular/angular/tree/HEAD/packages/platform-browser-dynamic) | `18.0.2` | `18.0.3` |
| [@angular/router](https://github.com/angular/angular/tree/HEAD/packages/router) | `18.0.2` | `18.0.3` |
| [@angular-devkit/build-angular](https://github.com/angular/angular-cli) | `18.0.3` | `18.0.4` |
| [@angular/cli](https://github.com/angular/angular-cli) | `18.0.3` | `18.0.4` |
| [@angular/compiler-cli](https://github.com/angular/angular/tree/HEAD/packages/compiler-cli) | `18.0.2` | `18.0.3` |


Updates `@angular/animations` from 18.0.2 to 18.0.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.3/packages/animations)

Updates `@angular/common` from 18.0.2 to 18.0.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.3/packages/common)

Updates `@angular/compiler` from 18.0.2 to 18.0.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.3/packages/compiler)

Updates `@angular/core` from 18.0.2 to 18.0.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.3/packages/core)

Updates `@angular/forms` from 18.0.2 to 18.0.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.3/packages/forms)

Updates `@angular/platform-browser` from 18.0.2 to 18.0.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.3/packages/platform-browser)

Updates `@angular/platform-browser-dynamic` from 18.0.2 to 18.0.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.3/packages/platform-browser-dynamic)

Updates `@angular/router` from 18.0.2 to 18.0.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.3/packages/router)

Updates `@angular-devkit/build-angular` from 18.0.3 to 18.0.4
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.0.3...18.0.4)

Updates `@angular/cli` from 18.0.3 to 18.0.4
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.0.3...18.0.4)

Updates `@angular/compiler-cli` from 18.0.2 to 18.0.3
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.3/packages/compiler-cli)

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([b7b82e8](https://github.com/hochfrequenz/ahb-tabellen/commit/b7b82e805bae085f9594236aa7be8b457fe37eab))
- *(other)* Bump @typescript-eslint/parser from 7.11.0 to 7.12.0 ([#71](https://github.com/hochfrequenz/ahb-tabellen/issues/71))

Bumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 7.11.0 to 7.12.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v7.12.0/packages/parser)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/parser"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([8dbc788](https://github.com/hochfrequenz/ahb-tabellen/commit/8dbc78803f9364ac0b6451da154190cba0473be3))
- *(other)* Bump @azure/storage-blob from 12.18.0 to 12.23.0 ([#70](https://github.com/hochfrequenz/ahb-tabellen/issues/70))

Bumps [@azure/storage-blob](https://github.com/Azure/azure-sdk-for-js) from 12.18.0 to 12.23.0.
- [Release notes](https://github.com/Azure/azure-sdk-for-js/releases)
- [Changelog](https://github.com/Azure/azure-sdk-for-js/blob/main/documentation/Changelog-for-next-generation.md)
- [Commits](https://github.com/Azure/azure-sdk-for-js/compare/@azure/storage-blob_12.18.0...@azure/storage-blob_12.23.0)

---
updated-dependencies:
- dependency-name: "@azure/storage-blob"
  dependency-type: direct:production
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([0d2964f](https://github.com/hochfrequenz/ahb-tabellen/commit/0d2964fc22533dec04dac722d006a34f6bf34697))
- *(other)* Bump tslib from 2.6.2 to 2.6.3 ([#73](https://github.com/hochfrequenz/ahb-tabellen/issues/73))

Bumps [tslib](https://github.com/Microsoft/tslib) from 2.6.2 to 2.6.3.
- [Release notes](https://github.com/Microsoft/tslib/releases)
- [Commits](https://github.com/Microsoft/tslib/compare/v2.6.2...v2.6.3)

---
updated-dependencies:
- dependency-name: tslib
  dependency-type: direct:production
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([673f7a6](https://github.com/hochfrequenz/ahb-tabellen/commit/673f7a6e8f717116392dc96707f1e06b2656e407))
- *(other)* Bump tailwindcss from 3.4.3 to 3.4.4 ([#69](https://github.com/hochfrequenz/ahb-tabellen/issues/69))

Bumps [tailwindcss](https://github.com/tailwindlabs/tailwindcss) from 3.4.3 to 3.4.4.
- [Release notes](https://github.com/tailwindlabs/tailwindcss/releases)
- [Changelog](https://github.com/tailwindlabs/tailwindcss/blob/v3.4.4/CHANGELOG.md)
- [Commits](https://github.com/tailwindlabs/tailwindcss/compare/v3.4.3...v3.4.4)

---
updated-dependencies:
- dependency-name: tailwindcss
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([bae4dbf](https://github.com/hochfrequenz/ahb-tabellen/commit/bae4dbf088e1140290733d78eb786ba01f3ce86b))
- *(other)* Bump zone.js from 0.14.6 to 0.14.7 ([#72](https://github.com/hochfrequenz/ahb-tabellen/issues/72))

Bumps [zone.js](https://github.com/angular/angular/tree/HEAD/packages/zone.js) from 0.14.6 to 0.14.7.
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/packages/zone.js/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/zone.js-0.14.7/packages/zone.js)

---
updated-dependencies:
- dependency-name: zone.js
  dependency-type: direct:production
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([3cec967](https://github.com/hochfrequenz/ahb-tabellen/commit/3cec9672123c1a7236d257c538463e3125c3b956))
- *(other)* Bump @typescript-eslint/eslint-plugin from 7.11.0 to 7.12.0 ([#68](https://github.com/hochfrequenz/ahb-tabellen/issues/68))

Bumps [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/eslint-plugin) from 7.11.0 to 7.12.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v7.12.0/packages/eslint-plugin)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([e133621](https://github.com/hochfrequenz/ahb-tabellen/commit/e13362172886f080205bfc00272dbeec51fbcfc7))
- *(other)* Bump prettier from 3.3.0 to 3.3.1 ([#67](https://github.com/hochfrequenz/ahb-tabellen/issues/67))

Bumps [prettier](https://github.com/prettier/prettier) from 3.3.0 to 3.3.1.
- [Release notes](https://github.com/prettier/prettier/releases)
- [Changelog](https://github.com/prettier/prettier/blob/main/CHANGELOG.md)
- [Commits](https://github.com/prettier/prettier/compare/3.3.0...3.3.1)

---
updated-dependencies:
- dependency-name: prettier
  dependency-type: direct:production
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([bd74c77](https://github.com/hochfrequenz/ahb-tabellen/commit/bd74c7748db48c0dfb3ac1b8349bab97fb4d4390))
- *(other)* Bump tsx from 4.11.0 to 4.15.1 ([#66](https://github.com/hochfrequenz/ahb-tabellen/issues/66))

Bumps [tsx](https://github.com/privatenumber/tsx) from 4.11.0 to 4.15.1.
- [Release notes](https://github.com/privatenumber/tsx/releases)
- [Changelog](https://github.com/privatenumber/tsx/blob/master/release.config.cjs)
- [Commits](https://github.com/privatenumber/tsx/compare/v4.11.0...v4.15.1)

---
updated-dependencies:
- dependency-name: tsx
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([6ff144a](https://github.com/hochfrequenz/ahb-tabellen/commit/6ff144ae2295f98dbf88500741e874883e5ccc19))
- *(other)* Bump the angular group with 11 updates ([#65](https://github.com/hochfrequenz/ahb-tabellen/issues/65))

Bumps the angular group with 11 updates:

| Package | From | To |
| --- | --- | --- |
| [@angular/animations](https://github.com/angular/angular/tree/HEAD/packages/animations) | `18.0.1` | `18.0.2` |
| [@angular/common](https://github.com/angular/angular/tree/HEAD/packages/common) | `18.0.1` | `18.0.2` |
| [@angular/compiler](https://github.com/angular/angular/tree/HEAD/packages/compiler) | `18.0.1` | `18.0.2` |
| [@angular/core](https://github.com/angular/angular/tree/HEAD/packages/core) | `18.0.1` | `18.0.2` |
| [@angular/forms](https://github.com/angular/angular/tree/HEAD/packages/forms) | `18.0.1` | `18.0.2` |
| [@angular/platform-browser](https://github.com/angular/angular/tree/HEAD/packages/platform-browser) | `18.0.1` | `18.0.2` |
| [@angular/platform-browser-dynamic](https://github.com/angular/angular/tree/HEAD/packages/platform-browser-dynamic) | `18.0.1` | `18.0.2` |
| [@angular/router](https://github.com/angular/angular/tree/HEAD/packages/router) | `18.0.1` | `18.0.2` |
| [@angular-devkit/build-angular](https://github.com/angular/angular-cli) | `18.0.2` | `18.0.3` |
| [@angular/cli](https://github.com/angular/angular-cli) | `18.0.2` | `18.0.3` |
| [@angular/compiler-cli](https://github.com/angular/angular/tree/HEAD/packages/compiler-cli) | `18.0.1` | `18.0.2` |


Updates `@angular/animations` from 18.0.1 to 18.0.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.2/packages/animations)

Updates `@angular/common` from 18.0.1 to 18.0.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.2/packages/common)

Updates `@angular/compiler` from 18.0.1 to 18.0.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.2/packages/compiler)

Updates `@angular/core` from 18.0.1 to 18.0.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.2/packages/core)

Updates `@angular/forms` from 18.0.1 to 18.0.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.2/packages/forms)

Updates `@angular/platform-browser` from 18.0.1 to 18.0.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.2/packages/platform-browser)

Updates `@angular/platform-browser-dynamic` from 18.0.1 to 18.0.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.2/packages/platform-browser-dynamic)

Updates `@angular/router` from 18.0.1 to 18.0.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.2/packages/router)

Updates `@angular-devkit/build-angular` from 18.0.2 to 18.0.3
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.0.2...18.0.3)

Updates `@angular/cli` from 18.0.2 to 18.0.3
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/18.0.2...18.0.3)

Updates `@angular/compiler-cli` from 18.0.1 to 18.0.2
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.2/packages/compiler-cli)

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([c25a132](https://github.com/hochfrequenz/ahb-tabellen/commit/c25a1320fdca9b42f58aae78287eaa91048f6901))
- *(other)* Merge pull request #63 from Hochfrequenz/column-swap

🎨 Swap `Segmentname` and `Segmentgruppe` columns in AHB table - ([f7697a2](https://github.com/hochfrequenz/ahb-tabellen/commit/f7697a2c7dc079def77db4b404c46c9bd5ce54c9))
- *(other)* Swap `Segmentname` and `Segmentgruppe` columns in AHB table - ([6529457](https://github.com/hochfrequenz/ahb-tabellen/commit/65294579847bbb0be8944ec58407663f9b704609))
- *(other)* Merge pull request #59 from Hochfrequenz/readme-revision

📝 Revise documentation - ([97b38f8](https://github.com/hochfrequenz/ahb-tabellen/commit/97b38f8afdf498abc07c802275625888f8bd4be4))
- *(other)* Update docker command

Co-authored-by: kevin <68426071+hf-krechan@users.noreply.github.com> - ([1d85070](https://github.com/hochfrequenz/ahb-tabellen/commit/1d85070484585688cdd5a764538eb7961dd16a08))
- *(other)* New line

Co-authored-by: kevin <68426071+hf-krechan@users.noreply.github.com> - ([2a0c260](https://github.com/hochfrequenz/ahb-tabellen/commit/2a0c2604b79ea304097e1b5ef4182a1e7858ee9d))
- *(other)* Get me out - ([166964b](https://github.com/hochfrequenz/ahb-tabellen/commit/166964bc8f5d8c01224d43053b02ec9eab1658e5))
- *(other)* Format - ([c576d35](https://github.com/hochfrequenz/ahb-tabellen/commit/c576d35aa43115223d0d3730033408a20a294e01))
- *(other)* Add schematic file tree - ([1f3bdcf](https://github.com/hochfrequenz/ahb-tabellen/commit/1f3bdcffe5429723b82be928481ba09bd48a0b53))
- *(other)* Format - ([eec8fd3](https://github.com/hochfrequenz/ahb-tabellen/commit/eec8fd3604b56acc19b87dc10cfd1bd15b256019))
- *(other)* Add flowchart to architecture - ([22cfce5](https://github.com/hochfrequenz/ahb-tabellen/commit/22cfce563c5818abf53e1ba3b8f9306db8b41f53))
- *(other)* Format - ([3fff90f](https://github.com/hochfrequenz/ahb-tabellen/commit/3fff90ff170cd0dd4853fdfd32100acd9892ca4b))
- *(other)* Add misc information to links section - ([aef9812](https://github.com/hochfrequenz/ahb-tabellen/commit/aef9812de4b6a9da4469a4e78c607020efef91f0))
- *(other)* Add descriptions regarding installation and setup - ([6289b7c](https://github.com/hochfrequenz/ahb-tabellen/commit/6289b7c1aba6d94e316bff51effd0fa0694e0b90))
- *(other)* Add TOC - ([4b83832](https://github.com/hochfrequenz/ahb-tabellen/commit/4b838320e29b5e74301af44bb4a7144731c7aee8))
- *(other)* 📝 Revise documentation - ([38074cf](https://github.com/hochfrequenz/ahb-tabellen/commit/38074cf6c540013c9503d7851e3c3e1752fe2ee4))
- *(other)* Bump the angular group with 16 updates ([#54](https://github.com/hochfrequenz/ahb-tabellen/issues/54))

Bumps the angular group with 16 updates:

| Package | From | To |
| --- | --- | --- |
| [@angular/animations](https://github.com/angular/angular/tree/HEAD/packages/animations) | `17.3.9` | `18.0.1` |
| [@angular/common](https://github.com/angular/angular/tree/HEAD/packages/common) | `17.3.9` | `18.0.1` |
| [@angular/compiler](https://github.com/angular/angular/tree/HEAD/packages/compiler) | `17.3.9` | `18.0.1` |
| [@angular/core](https://github.com/angular/angular/tree/HEAD/packages/core) | `17.3.9` | `18.0.1` |
| [@angular/forms](https://github.com/angular/angular/tree/HEAD/packages/forms) | `17.3.9` | `18.0.1` |
| [@angular/platform-browser](https://github.com/angular/angular/tree/HEAD/packages/platform-browser) | `17.3.9` | `18.0.1` |
| [@angular/platform-browser-dynamic](https://github.com/angular/angular/tree/HEAD/packages/platform-browser-dynamic) | `17.3.9` | `18.0.1` |
| [@angular/router](https://github.com/angular/angular/tree/HEAD/packages/router) | `17.3.9` | `18.0.1` |
| [@angular-devkit/build-angular](https://github.com/angular/angular-cli) | `17.3.8` | `18.0.2` |
| [@angular-eslint/builder](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/builder) | `17.5.0` | `18.0.1` |
| [@angular-eslint/eslint-plugin](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/eslint-plugin) | `17.5.0` | `18.0.1` |
| [@angular-eslint/eslint-plugin-template](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/eslint-plugin-template) | `17.5.0` | `18.0.1` |
| [@angular-eslint/schematics](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/schematics) | `17.5.0` | `18.0.1` |
| [@angular-eslint/template-parser](https://github.com/angular-eslint/angular-eslint/tree/HEAD/packages/template-parser) | `17.5.0` | `18.0.1` |
| [@angular/cli](https://github.com/angular/angular-cli) | `17.3.8` | `18.0.2` |
| [@angular/compiler-cli](https://github.com/angular/angular/tree/HEAD/packages/compiler-cli) | `17.3.9` | `18.0.1` |


Updates `@angular/animations` from 17.3.9 to 18.0.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.1/packages/animations)

Updates `@angular/common` from 17.3.9 to 18.0.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.1/packages/common)

Updates `@angular/compiler` from 17.3.9 to 18.0.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.1/packages/compiler)

Updates `@angular/core` from 17.3.9 to 18.0.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.1/packages/core)

Updates `@angular/forms` from 17.3.9 to 18.0.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.1/packages/forms)

Updates `@angular/platform-browser` from 17.3.9 to 18.0.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.1/packages/platform-browser)

Updates `@angular/platform-browser-dynamic` from 17.3.9 to 18.0.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.1/packages/platform-browser-dynamic)

Updates `@angular/router` from 17.3.9 to 18.0.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.1/packages/router)

Updates `@angular-devkit/build-angular` from 17.3.8 to 18.0.2
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/17.3.8...18.0.2)

Updates `@angular-eslint/builder` from 17.5.0 to 18.0.1
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/builder/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.0.1/packages/builder)

Updates `@angular-eslint/eslint-plugin` from 17.5.0 to 18.0.1
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.0.1/packages/eslint-plugin)

Updates `@angular-eslint/eslint-plugin-template` from 17.5.0 to 18.0.1
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.0.1/packages/eslint-plugin-template)

Updates `@angular-eslint/schematics` from 17.5.0 to 18.0.1
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/schematics/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.0.1/packages/schematics)

Updates `@angular-eslint/template-parser` from 17.5.0 to 18.0.1
- [Release notes](https://github.com/angular-eslint/angular-eslint/releases)
- [Changelog](https://github.com/angular-eslint/angular-eslint/blob/main/packages/template-parser/CHANGELOG.md)
- [Commits](https://github.com/angular-eslint/angular-eslint/commits/v18.0.1/packages/template-parser)

Updates `@angular/cli` from 17.3.8 to 18.0.2
- [Release notes](https://github.com/angular/angular-cli/releases)
- [Changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular-cli/compare/17.3.8...18.0.2)

Updates `@angular/compiler-cli` from 17.3.9 to 18.0.1
- [Release notes](https://github.com/angular/angular/releases)
- [Changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
- [Commits](https://github.com/angular/angular/commits/18.0.1/packages/compiler-cli)

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-major
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-major
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-major
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-major
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-major
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-major
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-major
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-major
  dependency-group: angular
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-major
  dependency-group: angular
- dependency-name: "@angular-eslint/builder"
  dependency-type: direct:development
  update-type: version-update:semver-major
  dependency-group: angular
- dependency-name: "@angular-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-major
  dependency-group: angular
- dependency-name: "@angular-eslint/eslint-plugin-template"
  dependency-type: direct:development
  update-type: version-update:semver-major
  dependency-group: angular
- dependency-name: "@angular-eslint/schematics"
  dependency-type: direct:development
  update-type: version-update:semver-major
  dependency-group: angular
- dependency-name: "@angular-eslint/template-parser"
  dependency-type: direct:development
  update-type: version-update:semver-major
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-major
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-major
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([191bf9e](https://github.com/hochfrequenz/ahb-tabellen/commit/191bf9ef95b615c38bd1b8f0fa6d4419b97609a9))
- *(other)* Bump @typescript-eslint/eslint-plugin from 7.10.0 to 7.11.0 ([#58](https://github.com/hochfrequenz/ahb-tabellen/issues/58))

Bumps [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/eslint-plugin) from 7.10.0 to 7.11.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v7.11.0/packages/eslint-plugin)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([c07232c](https://github.com/hochfrequenz/ahb-tabellen/commit/c07232cd123e5dcc433b679e082a763ce50d64cb))
- *(other)* Bump prettier from 3.2.5 to 3.3.0 ([#57](https://github.com/hochfrequenz/ahb-tabellen/issues/57))

Bumps [prettier](https://github.com/prettier/prettier) from 3.2.5 to 3.3.0.
- [Release notes](https://github.com/prettier/prettier/releases)
- [Changelog](https://github.com/prettier/prettier/blob/main/CHANGELOG.md)
- [Commits](https://github.com/prettier/prettier/compare/3.2.5...3.3.0)

---
updated-dependencies:
- dependency-name: prettier
  dependency-type: direct:production
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([453e676](https://github.com/hochfrequenz/ahb-tabellen/commit/453e676db994c4606cd9487c6b4ac55bf4178438))
- *(other)* Bump ng-mocks from 14.12.2 to 14.13.0 ([#56](https://github.com/hochfrequenz/ahb-tabellen/issues/56))

Bumps [ng-mocks](https://github.com/help-me-mom/ng-mocks) from 14.12.2 to 14.13.0.
- [Release notes](https://github.com/help-me-mom/ng-mocks/releases)
- [Changelog](https://github.com/help-me-mom/ng-mocks/blob/master/CHANGELOG.md)
- [Commits](https://github.com/help-me-mom/ng-mocks/compare/v14.12.2...v14.13.0)

---
updated-dependencies:
- dependency-name: ng-mocks
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([65770b9](https://github.com/hochfrequenz/ahb-tabellen/commit/65770b9a52d694c0e746dab26a8656027b5d539c))
- *(other)* Bump @typescript-eslint/parser from 7.10.0 to 7.11.0 ([#55](https://github.com/hochfrequenz/ahb-tabellen/issues/55))

Bumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 7.10.0 to 7.11.0.
- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)
- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)
- [Commits](https://github.com/typescript-eslint/typescript-eslint/commits/v7.11.0/packages/parser)

---
updated-dependencies:
- dependency-name: "@typescript-eslint/parser"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([57ba0c0](https://github.com/hochfrequenz/ahb-tabellen/commit/57ba0c02ef527de779607a36bd4650e56b11ea76))
- *(other)* 🎨 Rename button to XLSX instead of XML ([#29](https://github.com/hochfrequenz/ahb-tabellen/issues/29)) - ([7130d26](https://github.com/hochfrequenz/ahb-tabellen/commit/7130d26545610b553636b64b83f0aff05129bf73))
- *(other)* Bump tsx from 4.10.5 to 4.11.0 ([#53](https://github.com/hochfrequenz/ahb-tabellen/issues/53))

Bumps [tsx](https://github.com/privatenumber/tsx) from 4.10.5 to 4.11.0.
- [Release notes](https://github.com/privatenumber/tsx/releases)
- [Changelog](https://github.com/privatenumber/tsx/blob/master/release.config.cjs)
- [Commits](https://github.com/privatenumber/tsx/compare/v4.10.5...v4.11.0)

---
updated-dependencies:
- dependency-name: tsx
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([d0a62f7](https://github.com/hochfrequenz/ahb-tabellen/commit/d0a62f7d34cfab9696f94abc71e6ef8863d45f0c))
- *(other)* Landing page designs ([#51](https://github.com/hochfrequenz/ahb-tabellen/issues/51))

* Outsource header search form

* Add command to init submodules

* Improve ahb page

* Improve ui for fulltext search

* Add ui for export button

* Floating labels

* Align align align

* Add init highlight logic

* Sticky header

* Fix color

* Sticky table header

* Make highlighting case insensitive

* Highlight selected elements

* Scroll scroll scroll

* Show results

* update tests

* AHB landing page design

* Landindpage design

* Texte

* Fix test

* Outsource icons

* Outsource layout components

* ...

* Fix test

* Update src/app/features/ahbs/views/ahb-landing-page/ahb-landing-page.component.html

Co-authored-by: kevin <68426071+hf-krechan@users.noreply.github.com>

* Update src/app/features/landingpage/views/landing-page/landing-page.component.html

Co-authored-by: kevin <68426071+hf-krechan@users.noreply.github.com>

* Update src/app/features/landingpage/views/landing-page/landing-page.component.html

Co-authored-by: kevin <68426071+hf-krechan@users.noreply.github.com>

* Update src/app/features/landingpage/views/landing-page/landing-page.component.html

Co-authored-by: kevin <68426071+hf-krechan@users.noreply.github.com>

* Update src/app/features/landingpage/views/landing-page/landing-page.component.html

Co-authored-by: kevin <68426071+hf-krechan@users.noreply.github.com>

* ...

---------

Co-authored-by: Maxim Uhlemann <maxim@bygga.io>
Co-authored-by: Maxim Uhlemann <maxim.uhlememann@lynq.tech>
Co-authored-by: kevin <68426071+hf-krechan@users.noreply.github.com> - ([6a21b70](https://github.com/hochfrequenz/ahb-tabellen/commit/6a21b70023ba2e84db5e65a5b1f5c06a436123e2))
- *(other)* Highlight search results ([#50](https://github.com/hochfrequenz/ahb-tabellen/issues/50)) - ([cb315c3](https://github.com/hochfrequenz/ahb-tabellen/commit/cb315c3fcd209be071048a79369dfbb696fd94a0))
- *(other)* ⚙️ lint the whole project ([#47](https://github.com/hochfrequenz/ahb-tabellen/issues/47))

* lint the whole project

* ...

* Debug

* Debug

* ...

* ...

* ...

* Ignore build dir

* Cleanup

---------

Co-authored-by: Maxim Uhlemann <maxim.uhlememann@lynq.tech> - ([d8197c1](https://github.com/hochfrequenz/ahb-tabellen/commit/d8197c1b61073c76e02b2ffea72398a0ee2970b2))
- *(other)* ⚙️ Unit tests with jest ([#49](https://github.com/hochfrequenz/ahb-tabellen/issues/49))

* Install jest

* Clean up angular.json

* Remove jasmine

* Add test to github actions

* Update tests with ng-mocks

* Fix format

---------

Co-authored-by: Maxim Uhlemann <maxim.uhlememann@lynq.tech> - ([6e4dd1a](https://github.com/hochfrequenz/ahb-tabellen/commit/6e4dd1a129648ceb0872ff8832f94d773be46464))
- *(other)* Bump the angular group with 7 updates ([#48](https://github.com/hochfrequenz/ahb-tabellen/issues/48))

---
updated-dependencies:
- dependency-name: "@angular-devkit/build-angular"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular-eslint/builder"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-eslint/eslint-plugin-template"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-eslint/schematics"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular-eslint/template-parser"
  dependency-type: direct:development
  update-type: version-update:semver-minor
  dependency-group: angular
- dependency-name: "@angular/cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([ef5b714](https://github.com/hochfrequenz/ahb-tabellen/commit/ef5b71405b1926baa634d281e701c7e139df4c12))
- *(other)* Add CI Action to automatically merge Dependabot PRs (if CI is green) ([#46](https://github.com/hochfrequenz/ahb-tabellen/issues/46)) - ([b1cb6a7](https://github.com/hochfrequenz/ahb-tabellen/commit/b1cb6a7e47dd0f6927c0aff1158f03a41481f5ef))
- *(other)* Bump @typescript-eslint/parser from 7.8.0 to 7.10.0 ([#39](https://github.com/hochfrequenz/ahb-tabellen/issues/39))

---
updated-dependencies:
- dependency-name: "@typescript-eslint/parser"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([32ed2ae](https://github.com/hochfrequenz/ahb-tabellen/commit/32ed2ae957455e50002e1cd2168011d0bee0e8a1))
- *(other)* Bump @typescript-eslint/eslint-plugin from 7.8.0 to 7.10.0 ([#43](https://github.com/hochfrequenz/ahb-tabellen/issues/43))

---
updated-dependencies:
- dependency-name: "@typescript-eslint/eslint-plugin"
  dependency-type: direct:development
  update-type: version-update:semver-minor
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([4dd33db](https://github.com/hochfrequenz/ahb-tabellen/commit/4dd33dbb1a732d9b6b2b1194549ff3e2616dc589))
- *(other)* Bump the angular group with 9 updates ([#42](https://github.com/hochfrequenz/ahb-tabellen/issues/42))

---
updated-dependencies:
- dependency-name: "@angular/animations"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/common"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/core"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/forms"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/platform-browser-dynamic"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/router"
  dependency-type: direct:production
  update-type: version-update:semver-patch
  dependency-group: angular
- dependency-name: "@angular/compiler-cli"
  dependency-type: direct:development
  update-type: version-update:semver-patch
  dependency-group: angular
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
Co-authored-by: Maxim Uhlemann <maxim.uhlemann@gmail.com> - ([aef93e6](https://github.com/hochfrequenz/ahb-tabellen/commit/aef93e6a02617ac1e3d276ecd61834e7453b4203))
- *(other)* Bump zone.js from 0.14.5 to 0.14.6 ([#44](https://github.com/hochfrequenz/ahb-tabellen/issues/44))

---
updated-dependencies:
- dependency-name: zone.js
  dependency-type: direct:production
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>
Co-authored-by: Maxim Uhlemann <maxim.uhlemann@gmail.com> - ([89b3572](https://github.com/hochfrequenz/ahb-tabellen/commit/89b3572f406de99f23199ea84e6864215dbbfe50))
- *(other)* Bump tsx from 4.10.2 to 4.10.5 ([#45](https://github.com/hochfrequenz/ahb-tabellen/issues/45))

---
updated-dependencies:
- dependency-name: tsx
  dependency-type: direct:development
  update-type: version-update:semver-patch
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([492613f](https://github.com/hochfrequenz/ahb-tabellen/commit/492613f3684303346f2e0dcc28882230c67c1aa2))
- *(other)* Group Dependabot Updates for Angular ([#41](https://github.com/hochfrequenz/ahb-tabellen/issues/41))

* Group Dependabot Updates for Angular

https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#example-3

* prettier - ([cd2cca1](https://github.com/hochfrequenz/ahb-tabellen/commit/cd2cca1ae591c5f11ac5d682128dfe5a4ec6a39e))
- *(other)* Fix Username/Handles in dependabot Config ([#35](https://github.com/hochfrequenz/ahb-tabellen/issues/35)) - ([c96f13d](https://github.com/hochfrequenz/ahb-tabellen/commit/c96f13d6d692bec5961a5b9841d40c0cb073dfde))
- *(other)* Bump actions/setup-node from 2 to 4 ([#33](https://github.com/hochfrequenz/ahb-tabellen/issues/33))

---
updated-dependencies:
- dependency-name: actions/setup-node
  dependency-type: direct:production
  update-type: version-update:semver-major
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([331e64e](https://github.com/hochfrequenz/ahb-tabellen/commit/331e64ea5729a43d92dd60ec601bd865243cba36))
- *(other)* Bump actions/checkout from 2 to 4 ([#32](https://github.com/hochfrequenz/ahb-tabellen/issues/32))

---
updated-dependencies:
- dependency-name: actions/checkout
  dependency-type: direct:production
  update-type: version-update:semver-major
...

Signed-off-by: dependabot[bot] <support@github.com>
Co-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> - ([75f7d36](https://github.com/hochfrequenz/ahb-tabellen/commit/75f7d3680f6541ceba62be4b8fb243eab94cd908))
- *(other)* 🤖Add Dependabot Config ([#31](https://github.com/hochfrequenz/ahb-tabellen/issues/31)) - ([1a280c5](https://github.com/hochfrequenz/ahb-tabellen/commit/1a280c5f0b9fdc2054cbcfbc994ddb2cf6002b5c))
- *(other)* 🔥 remove version to remove deprecation warning ([#28](https://github.com/hochfrequenz/ahb-tabellen/issues/28))

WARN[0000] /Users/kevin/workspaces/hochfrequenz/ahbesser/docker-compose.yaml: `version` is obsolete - ([cd82464](https://github.com/hochfrequenz/ahb-tabellen/commit/cd82464b428f643492ba8648248b5b151325600d))
- *(other)* Add Favicon ([#22](https://github.com/hochfrequenz/ahb-tabellen/issues/22))

* 🎨 Add media files for favicons

* 🎨 Update currently favicon

* 🎨 Add site.webmanifest

* 🎨 Add code lines to serve favicon

* 🎨 Apply prettier

* add favicon links into index.html

* 🔥 Delete site.webmanifest

* 🔥 Delete links to favicons

* 🎨 add empty line to leave file unchanged in PR - ([222913f](https://github.com/hochfrequenz/ahb-tabellen/commit/222913f0c1ee623958846022be321bcb79c27671))
- *(other)* UI improvements ([#27](https://github.com/hochfrequenz/ahb-tabellen/issues/27)) - ([a6fa5ee](https://github.com/hochfrequenz/ahb-tabellen/commit/a6fa5eea6e10c33dc6d75ad1cb079a331e52490f))
- *(other)* Use datalist as a native typeahead ([#26](https://github.com/hochfrequenz/ahb-tabellen/issues/26))

Co-authored-by: Maxim Uhlemann <maxim.uhlememann@lynq.tech> - ([63c15dc](https://github.com/hochfrequenz/ahb-tabellen/commit/63c15dc9e581215a339e76002c39a26fe18bb376))
- *(other)* ⚙️ Add launch config for debugging upload script ([#23](https://github.com/hochfrequenz/ahb-tabellen/issues/23))

* ⚙️ Add launch config for debugging upload script

* 🙈 Add azure-mock/data to prettierignore

* 🎨 npm run format - ([2d3b1cb](https://github.com/hochfrequenz/ahb-tabellen/commit/2d3b1cb77c4659e836347e4759e5ef4ab19be7d4))
- *(other)* 🎨 Filter for entries which start with FV ([#24](https://github.com/hochfrequenz/ahb-tabellen/issues/24))

* 🎨 Filter for entries which start with FV

* 🙈 Add azure-mock/data to prettierignore

* 🎨 use let instead of var

* 🎨 filter out non required files

* 🎨 apply prettier

* use const instead of let

Co-authored-by: Maxim Uhlemann <maxim.uhlemann@gmail.com>

* remove import

Co-authored-by: Maxim Uhlemann <maxim.uhlemann@gmail.com>

* ⬆️update submodule

---------

Co-authored-by: Maxim Uhlemann <maxim.uhlemann@gmail.com> - ([8aa5ed6](https://github.com/hochfrequenz/ahb-tabellen/commit/8aa5ed67ec28e4e8d74fde0439edf032ab66297a))
- *(other)* Use dynamic inputs ([#18](https://github.com/hochfrequenz/ahb-tabellen/issues/18)) - ([403838d](https://github.com/hochfrequenz/ahb-tabellen/commit/403838dc2e837fb3199039fa43c74a31fd203d92))
- *(other)* Merge pull request #19 from Hochfrequenz/add-machine-readable-ahb

Add Git Submodule For Machine Readable AHBs Documents - ([603fae8](https://github.com/hochfrequenz/ahb-tabellen/commit/603fae89a51e0104f195a5d82025dd63250b00d7))
- *(other)* Use https instead of ssh

Co-authored-by: konstantin <konstantin.klein@hochfrequenz.de> - ([7335c8b](https://github.com/hochfrequenz/ahb-tabellen/commit/7335c8b4fd1b5171506ad7abefaf42813061a697))
- *(other)* Update to the latest ahbs - ([403009c](https://github.com/hochfrequenz/ahb-tabellen/commit/403009c9ff422830ff2b8124e79547ab818973cf))
- *(other)* ➕ Add git submodule for machine readable ahbs - ([81849c2](https://github.com/hochfrequenz/ahb-tabellen/commit/81849c275149e665257fb5b759c8554215714ef9))
- *(other)* 🔥 Delete azuremock/data folder - ([a553cc6](https://github.com/hochfrequenz/ahb-tabellen/commit/a553cc604a61fc319aab42d9f7eeb9394c8e0a4f))
- *(other)* Set Json header ([#17](https://github.com/hochfrequenz/ahb-tabellen/issues/17)) - ([c0b9390](https://github.com/hochfrequenz/ahb-tabellen/commit/c0b939097686c86cb69735778cc057c586baa557))
- *(other)* Add pruefis endpoint ([#16](https://github.com/hochfrequenz/ahb-tabellen/issues/16)) - ([e95ea05](https://github.com/hochfrequenz/ahb-tabellen/commit/e95ea05f29e820cbda367ededc0d91e79208087d))
- *(other)* Format versions endpoint ([#15](https://github.com/hochfrequenz/ahb-tabellen/issues/15))

* /format-versions endpoint

* Refactor AHB Repository to use BlobStorageBacked abstract

* Enable format version repository to inject client dependency - ([781b13c](https://github.com/hochfrequenz/ahb-tabellen/commit/781b13c6736c60dbdadc8bb311c7a1a5239806a4))
- *(other)* Adjust openapi ([#14](https://github.com/hochfrequenz/ahb-tabellen/issues/14))

* Adjust pruefis endpoint

* Adjust pruefis endpoint openapi spec - ([78a6d13](https://github.com/hochfrequenz/ahb-tabellen/commit/78a6d1319719d3817b76233f44be43604b597c0e))
- *(other)* Ahb endpoint ([#13](https://github.com/hochfrequenz/ahb-tabellen/issues/13))

* Introduce /ahb endpoint WIP

* Add container name to container

* Get format name dynamically

* Introduce error handling middleware

* fix excel file format typo - ([6e2ddce](https://github.com/hochfrequenz/ahb-tabellen/commit/6e2ddce0631af271e985ac055cb7296aa632dcfe))
- *(other)* Backend base ([#12](https://github.com/hochfrequenz/ahb-tabellen/issues/12))

* 🚧 WIP upload script

* ➕ add azure storage blob

* Docker compose

* Improve server dockerfile

---------

Co-authored-by: hf-krechan <kevin.krechan@hochfrequenz.de> - ([f0e47d0](https://github.com/hochfrequenz/ahb-tabellen/commit/f0e47d049968c6268a453c2d5e64c29f0da850cb))
- *(other)* Init table  ([#4](https://github.com/hochfrequenz/ahb-tabellen/issues/4)) - ([dc0d9d8](https://github.com/hochfrequenz/ahb-tabellen/commit/dc0d9d8ca46c58057caeb8df613e70aedea580cd))
- *(other)* Init layout/design with tailwind ([#3](https://github.com/hochfrequenz/ahb-tabellen/issues/3)) - ([fda0b75](https://github.com/hochfrequenz/ahb-tabellen/commit/fda0b75744c866897ca11d486c537b0303fc54b7))
- *(other)* Merge pull request #2 from Hochfrequenz/containerize-app

Add dockerfile - ([7bb67aa](https://github.com/hochfrequenz/ahb-tabellen/commit/7bb67aae1aa29250c015a1d3cf29209b34f90215))
- *(other)* Add dockerfile - ([c3ecfac](https://github.com/hochfrequenz/ahb-tabellen/commit/c3ecfaca027611c9565c74df63d0e05e0f44b35e))
- *(other)* No google tracking - ([558ff79](https://github.com/hochfrequenz/ahb-tabellen/commit/558ff79dfae2c00e2c1dd3107525ab9bbd2a375a))
- *(other)* Merge pull request #1 from Hochfrequenz/add-open-api

🎨 add openapi.yml - ([271c806](https://github.com/hochfrequenz/ahb-tabellen/commit/271c80647a2b7470be5257af18c29f9ee5cba924))
- *(other)* Generate client - ([382f563](https://github.com/hochfrequenz/ahb-tabellen/commit/382f56366e4c87b87b9e0828c486bb5e06543e9b))
- *(other)* Update - ([a7c9887](https://github.com/hochfrequenz/ahb-tabellen/commit/a7c9887e7378c298e4d9d97ac3a0832393993f48))
- *(other)* Fix format - ([c47a4a4](https://github.com/hochfrequenz/ahb-tabellen/commit/c47a4a4ff102b0d11fdbb15145d4707b3127e363))
- *(other)* 🎨 add openapi.yml - ([e8e3edb](https://github.com/hochfrequenz/ahb-tabellen/commit/e8e3edb2e53071ecce2c6dad30ec8bf36e3da11b))
- *(other)* Init server - ([0abc696](https://github.com/hochfrequenz/ahb-tabellen/commit/0abc696d3e328e09a804df38e2c3684c0a1fb73f))
- *(other)* Add .nvmrc - ([dcac066](https://github.com/hochfrequenz/ahb-tabellen/commit/dcac06699b7bf7039d6a3e84683e3470a8c9144b))
- *(other)* Initial commit - ([7538bab](https://github.com/hochfrequenz/ahb-tabellen/commit/7538babe59f3cb6b2855917897fdf3a5126fbca6))

## New Contributors ❤️

* @hf-krechan made their first contribution in [#90](https://github.com/hochfrequenz/ahb-tabellen/pull/90)
* @dependabot[bot] made their first contribution in [#87](https://github.com/hochfrequenz/ahb-tabellen/pull/87)
* @OLILHR made their first contribution in [#63](https://github.com/hochfrequenz/ahb-tabellen/pull/63)
* @TommyBom made their first contribution in [#51](https://github.com/hochfrequenz/ahb-tabellen/pull/51)
* @hf-kklein made their first contribution in [#46](https://github.com/hochfrequenz/ahb-tabellen/pull/46)
* @ohenning made their first contribution in [#17](https://github.com/hochfrequenz/ahb-tabellen/pull/17)
* @ made their first contribution

<!-- generated by git-cliff -->
