# Agent guidance

Keep this guidance small and repository-specific. The compiler, tooling configuration and public feature contracts are
authoritative; these files record integration pitfalls and boundaries that are easy to miss. Prefer engineering judgment
over blanket implementation prescriptions. Improve stale guidance rather than reproducing an obsolete pattern.

Read the files relevant to the task:

| Task                                         | Guidance                                 |
| -------------------------------------------- | ---------------------------------------- |
| Any implementation or review                 | [Library boundaries](general.md)         |
| Angular components, templates or forms       | [Angular integration](angular.md)        |
| Clarity/library/demo UI                      | [Rendered behavior](clarity.md)          |
| Async state, transport or streams            | [Async ownership](rxjs.md)               |
| Tests                                        | [Testing evidence](testing.md)           |
| Targets, dependencies or packaging           | [Workspace and packages](nx.md)          |
| New public APIs or material contract changes | [Design scope](component-development.md) |

These files have one physical source. Cursor's .mdc entries and Claude's .md entries are relative symlinks here; edit
the canonical files and run the tooling checks. Scope metadata assists client discovery; other agents use the task
routing above. A symlink-capable checkout is required (Windows needs Developer Mode or equivalent support).
