# Brazilian Portuguese (pt-BR) localization — review checklist

This branch adds the full Brazilian Portuguese UI translation to Chrysalide v2 (SvelteKit).

## Static catalog audit

- English source: **1,017** leaf entries (1,001 strings and 16 milestone arrays)
- Portuguese values different from English: **994**
- Identical values: **23** (technical terms, proper names, numeric placeholder, or shared words such as `Gel`, `LH`, `Normal` and `Total`)
- Missing or extra keys: **0** across French, English, German and Brazilian Portuguese
- Dynamic placeholders: **0 mismatches**
- Array sizes/types: **0 mismatches**
- Newline counts in existing localized strings: **0 mismatches**

These are static checks on repository content, **not results from a full SvelteKit build**.

## Changed functionality

- `src/messages/pt-BR.json`: localized messages, descriptions and milestones
- `src/lib/i18n.svelte.ts`: language registration, browser language selection, pt-BR date-fns locale
- `src/routes/settings/+page.svelte`: user-facing Brazilian Portuguese option
- `src/lib/locale-keys.mjs` and checks/tests: include pt-BR among supported locales
- Existing medical values, medications calculation logic, storage schema and reference ranges have not been edited

## Remaining pre-PR checks

- [ ] Brazilian Portuguese native review, especially medical content and procedure descriptions
- [ ] `pnpm install --frozen-lockfile`
- [ ] `pnpm check:locale-keys`
- [ ] `pnpm check`
- [ ] `pnpm test:run`
- [ ] `pnpm lint`
- [ ] `pnpm build`
- [ ] Manual language switching (FR / EN / DE / PT-BR)
- [ ] Browser automatic detection (`pt`, `pt-BR`)
- [ ] Android Chrome PWA + desktop layout smoke test
- [ ] Validate any locale-specific formatting (dates, currencies, and reminders)
- [ ] Remove this file from final PR after review

## Contribution plan

After review, open PR from `abihlab:feat/i18n-pt-br` to `kushiemoon-dev:main` (the source repository currently exposes `main`, although CONTRIBUTING still mentions a `dev` branch).
