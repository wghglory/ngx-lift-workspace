---
name: lift-design
description:
  Design or change public ngx-lift utilities and clr-lift components through use cases, industry comparisons, and API
  review. Use before implementation or when an existing public contract changes.
---

# Design library behavior

Use the repository's [development workflow](../../../docs/design/component-development.md) as the canonical acceptance
policy. Read the relevant existing design spec and current source first. The
[component roadmap](../../../docs/component-roadmap.md) defines Angular 21 delivery and the deferred platform upgrade.

1. Identify the actual consumer use cases and current gaps. Inspect Clarity and current primary documentation/source
   from Angular Material, NG-ZORRO and relevant React libraries. Record specific adopt/adapt/reject decisions.
2. Create or update the spec under `docs/design/ngx-lift/` or `docs/design/clr-lift/` using the
   [template](../../../docs/design/templates/component-design-spec.md). Preserve the existing canonical spec when one
   exists. Include goals, non-goals, acceptance use cases, minimal/advanced examples, failure states and compatibility.
3. Apply the [form contract](../../../docs/design/clr-lift/forms-compatibility-design-spec.md) to value controls. For
   display, navigation and utilities, explain the relevant integration instead of adding an artificial form value.
4. Present the draft/API changes for review before implementation unless explicit approval already covers that scope.
   Keep proposal status and unavailable exports clear. On a design-only request, stop after producing the reviewable
   docs.
5. After approval, implement functional increments and satisfy the workflow's demos, localization, tests, accessibility,
   lifecycle, performance and installed-consumer gates. Update the spec with actual evidence.

Read [documentation standards](../../../docs/DOCUMENTATION_STANDARDS.md) when editing demo pages. Use the local
nx-workspace skill to discover targets and the manifest/command guide for actual commands. Scale validation to the
change; do not run component suites for a documentation-only draft or claim planned tests passed.

Completion means the requested scope is concrete and reviewable: either a draft with unresolved decisions stated, or an
approved implementation with acceptance evidence and remaining external gates reported. Merge/publication require their
own authorization and evidence. This skill does not create that authorization.
