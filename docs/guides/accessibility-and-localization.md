# Accessibility and language acceptance

This contract applies to ngx-lift, clr-lift, and the demo app, including generated code, examples, and changes to
existing features. Angular 21 remains the delivery baseline; accessibility and localization do not depend on a platform
upgrade.

## Feature delivery

Before implementation, list the feature's visible messages and accessible names in its design spec. Include errors,
empty/loading states, validation, tooltips, announcements, button labels, and demo explanations. Reuse translation keys
where the meaning is identical. Preserve API names, code samples, interpolation placeholders, and caller-owned data.

Implement every owned message in all supported locales: **en, zh-CN, zh-TW, de, es, fr, ja, ko, nl, pt-BR, ru**.
Discover the current locale set from the language switcher and translation checker when adding a language. Library
defaults and demo text have the same completeness requirement. English fallback is runtime resilience; it does not
complete a translation. Pure developer diagnostics and API identifiers need not be translated as product UI.

Preserve additional locales and aliases already offered by a library dictionary; new keys must be complete there too.

For every rendered control:

- Use semantic controls and programmatic labels, descriptions, state, and errors. Keep IDs unique across instances.
- Support keyboard entry, operation, exit, and visible focus. Document overlay focus ownership, Escape behavior, and
  focus restoration; describe text tooltips and interactive dialogs with their appropriate roles.
- Announce meaningful async status/error changes without repeating announcements on every render.
- Verify light/dark contrast, narrow layouts, large text/zoom, long translations, and applicable RTL behavior. Keep
  essential actions reachable with keyboard and touch.
- Test reset, disabled/readonly, failure/recovery, repeated opening, and cleanup when those behaviors apply.

Generated work is ready for review when the library implementation, working demo, all locale dictionaries, relevant
specification, and regression tests agree. Apply this contract during code generation and review, including demo-only
changes. Record a concrete reason for requirements that do not apply to a headless utility.

## Automated verification

`pnpm run i18n:check` validates dictionary completeness, placeholders, API literals, and static translation-key
references. The accessibility browser suite derives its page inventory from the demo route configuration, so new static
demo routes enter the scans automatically. Scans visit initially rendered content and available tab panels in both
themes, and attach violations, checks needing manual review, and passed rule IDs. Language browser checks verify
supported locale metadata, translated rendering, and library controls.

Use the resolved Nx browser targets and the repository validation commands. A passing scan covers the tested page and
state; open menus, dialogs, tooltips, errors, and subsequent wizard steps need explicit interaction tests. Do not hide
failures with broad exclusions, disabled rules, fixed sleeps, or English fallback. Test results and exact revisions
belong in the PR and CI artifacts.

## Independent human acceptance

Automated checks and AI translation review establish engineering evidence. Independent language approval and a manual
assistive-technology (AT) decision are separate records. AT covers screen readers, keyboard-only navigation, magnifiers,
switch input and similar access tools. Keep these records separate from automated results in the roadmap and PR.

An independent language reviewer records the locale, name, reviewed commit, pages/components, issues and corrections,
and approval date in the PR. Review library messages and demo teaching content together, including technical meaning,
natural wording, grammar, consistent terminology, placeholders/plurals, accessible names and announcements, and long
label layouts. Read actual rendered states and exercise runtime switching; key parity alone is insufficient.

| Locale | Independent reviewer          | Acceptance                     |
| ------ | ----------------------------- | ------------------------------ |
| en     | Maintainer-appointed reviewer | Approved (2026-11-08, PR #218) |
| zh-CN  | Maintainer-appointed reviewer | Approved (2026-11-08, PR #218) |
| zh-TW  | Maintainer-appointed reviewer | Approved (2026-11-08, PR #218) |
| de     | Maintainer-appointed reviewer | Approved (2026-11-08, PR #218) |
| es     | Maintainer-appointed reviewer | Approved (2026-11-08, PR #218) |
| fr     | Maintainer-appointed reviewer | Approved (2026-11-08, PR #218) |
| ja     | Maintainer-appointed reviewer | Approved (2026-11-08, PR #218) |
| ko     | Maintainer-appointed reviewer | Approved (2026-11-08, PR #218) |
| nl     | Maintainer-appointed reviewer | Approved (2026-11-08, PR #218) |
| pt-BR  | Maintainer-appointed reviewer | Approved (2026-11-08, PR #218) |
| ru     | Maintainer-appointed reviewer | Approved (2026-11-08, PR #218) |

### Manual assistive-technology decision

The maintainer waived the independent manual assistive-technology assessment on 2026-11-10. This waiver is not a passed
assessment and does not turn automated scans into human approval. Automated accessibility checks, keyboard/focus
journeys, all-locale rendering, semantic names and states remain required for new or changed UI. Reintroduce human
assessment only through an explicit maintainer decision.

If reintroduced, record assessor, revision, operating system, browser, assistive technology, scope, findings and
disposition. Cover keyboard-only use, screen-reader reading/interaction, zoom/reflow, contrast and applicable motion
preferences.

## References

- [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing)
- [WCAG 2.2: language of page](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html)
- [WAI-ARIA tooltip pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)
