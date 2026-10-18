# Documentation

Start with the guide for your task. Each topic has one canonical document; other pages link to it.

| Topic                                                | Canonical source                                                          |
| ---------------------------------------------------- | ------------------------------------------------------------------------- |
| Workspace setup                                      | [Quick start](QUICK_START.md)                                             |
| Commands and validation                              | [Command reference](COMMANDS.md); executable scripts live in package.json |
| Publishing and demo deployment                       | [Deployment](DEPLOYMENT.md); automation lives in .github/workflows        |
| Build and runtime architecture                       | [Technology architecture](TECHNOLOGY_ANALYSIS.md)                         |
| Utility and component contracts                      | [API specifications](design/README.md); signatures and tests live in libs |
| Loading, localization and shared lifecycle           | [Integration guide](guides/demo-and-library-integration.md)               |
| Planned work and acceptance status                   | [Roadmap](priority-roadmap.md)                                            |
| Released and unreleased changes                      | [Changelog](../CHANGELOG.md)                                              |
| Demo documentation delivery and remaining acceptance | [Refinement roadmap](documentation-refinement-roadmap.md)                 |
| Demo page conventions                                | [Documentation standards](DOCUMENTATION_STANDARDS.md)                     |
| Contributions                                        | [Contributing](../CONTRIBUTING.md)                                        |

[Active design and implementation gaps](design/implementation-gaps.md) lists source-backed fixes and remaining gates.

The workspace README introduces the libraries; package READMEs explain installation and public usage. API specifications
own behavior and limitations. The integration guide owns cross-library loading and lifecycle concerns. The roadmap owns
work status, and the changelog owns release history.

Maintain links instead of copying commands, version tables, API state definitions or status reports between pages.
Dependency versions are authoritative in package manifests and the lockfile. Validation evidence belongs to the
corresponding CI run and pull request; temporary audits and local log snapshots are not maintained documentation.
