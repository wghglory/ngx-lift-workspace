# Documentation

Start with the guide for your task. Each topic has one canonical document; other pages link to it.

| Topic                                      | Canonical source                                                          |
| ------------------------------------------ | ------------------------------------------------------------------------- |
| Workspace setup                            | [Quick start](quick-start.md)                                             |
| Commands and validation                    | [Command reference](commands.md); executable scripts live in package.json |
| Publishing and demo deployment             | [Deployment](deployment.md); automation lives in .github/workflows        |
| Build and runtime architecture             | [Technology architecture](technology-analysis.md)                         |
| Utility and component contracts            | [API specifications](design/README.md); signatures and tests live in libs |
| Loading, localization and shared lifecycle | [Integration guide](guides/demo-and-library-integration.md)               |
| Planned work and acceptance status         | [Roadmap](priority-roadmap.md)                                            |
| Component delivery sequence                | [Component roadmap](component-roadmap.md)                                 |
| Component design workflow                  | [Development workflow](design/component-development.md)                   |
| Accessibility and language acceptance      | [Acceptance contract](guides/accessibility-and-localization.md)           |
| Current docs/codebase gaps                 | [Gap register](gap-register.md)                                           |
| Agent conventions                          | [Agent guidance](agents/)                                                 |
| Architecture decisions                     | [ADRs](adr/)                                                              |
| Released and unreleased changes            | [Changelog](../CHANGELOG.md)                                              |
| Demo documentation acceptance              | [Demo documentation status](documentation-refinement-roadmap.md)          |
| Demo page conventions                      | [Documentation standards](documentation-standards.md)                     |
| Contributions                              | [Contributing](../CONTRIBUTING.md)                                        |

[Active design and implementation gaps](design/implementation-gaps.md) lists current design-contract gaps and delivery
gates.

The workspace README introduces the libraries; package READMEs explain installation and public usage. API specifications
own behavior and limitations. The integration guide owns cross-library loading and lifecycle concerns. The roadmap owns
work status, and the changelog owns release history.

Maintain links instead of copying commands, version tables, API state definitions or status reports between pages.
Dependency versions are authoritative in package manifests and the lockfile. Validation evidence belongs to the
corresponding CI run and pull request. The [gap register](gap-register.md) is the maintained status artifact; temporary
local log snapshots are not maintained documentation.
