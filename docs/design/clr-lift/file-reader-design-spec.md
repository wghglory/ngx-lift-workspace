# File reader value control

Status: Implemented (contract audit). Owner: clr-lift maintainers. Updated: October 16, 2026. Package: clr-lift.
Approval: F2 fix authorized by maintainer; existing value/encoding API preserved.

## Background

[FileReaderComponent](../../../libs/clr-lift/src/lib/components/file-reader/file-reader.component.ts) reads a local text
file into an Angular form string. It does not upload the File or return a data URL.

## Terminology

Raw content is decoded text; encoded content is base64 text bytes. `textEncoding` selects UTF-8 or legacy Latin-1 for
that conversion, not the FileReader source encoding. Empty value is `''`.

## Goals

- G1: Read text/encoded values through Angular 21 ngModel and Reactive Forms.
- G2: Preserve owner-write/reset behavior and prevent old file reads restoring removed/replaced content.

## Non-Goals

### Not now

Native signal-field integration, readonly mode, binary-file APIs, streaming reads or progress reporting.

### Outside this API

Uploads, content trust, virus scanning, certificate trust validation, and server size limits.

## Use cases and acceptance

| ID  | Task                | Initial state/action                      | Outcome                                                | Failure/recovery                     | Demo/test                        |
| --- | ------------------- | ----------------------------------------- | ------------------------------------------------------ | ------------------------------------ | -------------------------------- |
| F1  | Import Unicode text | Select valid file                         | Emit raw text or UTF-8 base64 once                     | Read/parse error invalidates control | file-reader.component.spec.ts    |
| F2  | Reset/reselect      | Read pending; reset/remove/select another | Old completion ignored; owner writes do not echo/touch | New valid selection clears errors    | race/CVA regressions             |
| F3  | Enforce size        | Select file over maxSize                  | No read starts; exceedLimit error                      | Choose smaller file                  | real form tests; file-reader E2E |

## Industry evidence and current gaps

Checked October 16, 2026: [FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader) supports aborting
pending reads. Adopt abort plus identity checks. [Angular CVA](https://angular.dev/api/forms/ControlValueAccessor)
separates model writes from user edits. Disabling through the CVA or disabled input must cancel an active read and
prevent obsolete callbacks from changing the owner; this change closes F2 in the
[gap register](../implementation-gaps.md).

## Public API and examples

```typescript
import {Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {FileReaderComponent} from 'clr-lift';

@Component({
  imports: [ReactiveFormsModule, FileReaderComponent],
  template: `<cll-file-reader [formControl]="content" [maxSize]="2" acceptFiles=".txt,.pem" />`,
})
export class ImportExample {
  readonly content = new FormControl('', {nonNullable: true});
}
```

Inputs: `encoded=false`, `textEncoding='utf-8'`, `maxSize=Infinity` in MiB, `acceptFiles='*'`, `disabled=false`,
`controlId=''`. `fileChange` emits a successful selected-file string; it is not a substitute for all CVA changes
(removal/errors do not emit that output). Legacy encoded data requires explicit `textEncoding="latin1"`. Reactive
Forms + `toSignalForm` observes the same FormControl; native fields follow the deferred shared policy.

## Behavior and architecture

Selection cancels the previous reader, checks size, then reads as text. Reader identity and disabled state guard
callbacks. Disabling cancels active work and clears its pending filename/native selection while preserving committed
content and form interaction state. Reenabling requires a fresh selection; it never resumes the aborted read. Reset,
replacement and destruction abort/detach old handlers. Owner `writeValue(null/undefined/'')` clears content and the
native file input without `onChange`/touch. Invalid owner base64/UTF-8 produces parse validation without writing back.
Oversized user files write `''`; read errors currently write a single-space sentinel to distinguish parse from required
errors. Successful file selection marks touched immediately; this is not composite-blur semantics.

## Clarity, accessibility, and localization

Clarity file input/helpers/errors use component translations. Host supplies a unique `controlId` when necessary and its
surrounding form label. Announce size/read errors and verify keyboard removal; acceptFiles is a chooser hint, not
content validation.

## Demo and validation plan

Existing `apps/demo-e2e/src/file-reader.spec.ts` and adjacent unit tests cover prefill, removal, Unicode/legacy
encoding, malformed data, stale reads, teardown and real form validation. Add deterministic CVA/input disabled-read
races and a rendered FormControl.disable regression. ngModel, facade and updateOn hosts remain separate acceptance work.

## Compatibility, rollout, and risks

Angular 21 CVA/Validator; browser FileReader/TextEncoder/TextDecoder APIs. No binary-size-independent memory bound:
text/base64 copies coexist. Applications should set maxSize. Native fields are required after the platform upgrade.

## Review decisions and delivery

Preserve the existing encoding migration. Disabling now cancels pending reads; touch timing remains separate. Changing
the single-space error sentinel also needs a payload/validation compatibility decision.

## Evidence

October 16, 2026: disabled-read regressions failed against the prior implementation, then all 44 file-reader tests
passed with the fix, including a rendered FormControl.disable case. Full clr-lift tests, lint, typecheck and production
library build passed. Browser acceptance is recorded in the PR; native Signal Forms remains deferred.
