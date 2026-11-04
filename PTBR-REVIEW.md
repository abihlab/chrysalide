# Brazilian Portuguese translation — work in progress

This feature branch adds Brazilian Portuguese locale support to Chrysalide v2 (SvelteKit). It is **not yet ready for an upstream Pull Request**.

## Verified catalog status

- Leaf entries: **1017**
- Values adapted from the English source: **269**
- Values still identical to English: **748** (some terms may legitimately remain identical, but all must be reviewed)
- Missing or extra keys: **0** across all four locales
- Integration: locale selector, browser language resolution, date-fns pt-BR locale, key parity tests and i18n tests updated
- No medication calculations, storage schema or clinical reference ranges intentionally changed

## Unreviewed locale sections (matching English)

- `objectives`: 164
- `appointments`: 99
- `journal`: 86
- `resources`: 80
- `progress`: 76
- `practitioners`: 65
- `bloodtests`: 56
- `dashboard`: 34
- `onboarding`: 25
- `theme`: 19
- `sync`: 17
- `export`: 17
- `medications`: 5
- `milestones`: 5

## Completion checklist

- [ ] Translate all remaining English-facing values in `src/messages/pt-BR.json`, including arrays of milestone steps
- [ ] Review medical terms and warnings with a pt-BR native speaker; preserve dose units, clinical meaning, and labels
- [ ] Preserve JSON key names, template variables (e.g. `{count}`), line breaks, tags and list lengths
- [ ] Audit date rendering, browser locale recognition and the language selector in an actual app build
- [ ] Run `pnpm install --frozen-lockfile`, `pnpm check:locale-keys`, `pnpm check`, `pnpm test:run`, `pnpm lint`, `pnpm build`
- [ ] Smoke-test Android Chrome PWA, desktop browsers and switching FR/EN/DE/PT-BR
- [ ] Remove this WIP file before sending an upstream PR

## PR plan

Fork: `abihlab/chrysalide` → source: `kushiemoon-dev/chrysalide`.
After translation and tests, open a PR from `abihlab:feat/i18n-pt-br` to `kushiemoon-dev:main` (main is the only current published branch; check CONTRIBUTING and maintainer preferences before submission).
