# Datagrid selection delivery plan

This plan records the story sequence used for the delivered local exports; it is not a schedule for remaining work.
Start with the [canonical contract](datagrid-selection-design-spec.md) and
[complete consumer examples](datagrid-selection-code-examples.md). The
[composition ADR](../../adr/0002-datagrid-selection-composition.md) owns the rendering decision, the
[detailed reference](datagrid-selection-reference.md) documents async, availability, reset and localization contracts,
and release history lives in [CHANGELOG](../../../CHANGELOG.md).

## Story coverage

Story numbers refer to the stable numbered list in #198. Shared stories are intentionally exercised by more than one
ticket; this is coverage, not additional blocking edges.

| Story group                                              | IDs                              | Delivery                                                                        |
| -------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------- |
| Native markup, identity and concise examples             | 1, 2, 11, 12, 33, 48, 50, 51, 54 | #200; #202 reuses the business examples                                         |
| Direct forms and reusable pickers                        | 3–10, 52                         | #200 supplies form/accessor behavior; #202 supplies full policy reuse           |
| Reconciliation, independent arrivals and stale responses | 13–16, 47                        | #200 local reconciliation; #201 remote pages; #202 edit-session initialization  |
| Filtering and logical select-all scope                   | 17–20                            | #200 local scope; #201 remote scope; #202 preserves policy choices              |
| Eligibility, clear and field state                       | 21–23, 27–29, 44                 | #200 common rules; #201 authoritative remote changes; #202 business composition |
| Validation and composite departure                       | 24–26                            | #200 form contract; #201/#202 repeat it at their actual public hosts            |
| Layout, feedback and stable size                         | 30–32                            | #200 core presentation; downstream hosts retain it                              |
| Query ownership, failure and retry                       | 34–36, 49                        | #200 local query; #201 HTTP pages; #202 picker/detail lifecycle                 |
| Edit baseline, DTOs and save outcomes                    | 37–43                            | #202; #201 separately proves complete key-only submission                       |
| Localization, accessibility and evidence                 | 45, 46, 53, 55                   | Each ticket owns these checks for its increment                                 |

## Done means evidence, not ticket activity

For each increment, record behavior/type checks, installed consumers, browser/accessibility/translation/cleanup results
and remaining limitations. Do not use old prototype totals as current release evidence. Independent native-language and
assistive-technology acceptance, CI at the actual head, merge, deployment and package publication are distinct gates.
