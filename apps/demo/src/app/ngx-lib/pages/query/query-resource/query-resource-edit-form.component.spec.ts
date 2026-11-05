import {TestBed} from '@angular/core/testing';
import {describe, expect, it, vi} from 'vitest';
import {QueryResourceEditFormComponent} from './query-resource-edit-form.component';

describe('QueryResourceEditFormComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({imports: [QueryResourceEditFormComponent]});
  });

  it('seeds the form from the query result without an effect', async () => {
    const fixture = TestBed.createComponent(QueryResourceEditFormComponent);
    expect(fixture.componentInstance.form().value.name).toBe('');
    fixture.detectChanges();
    await vi.waitFor(() => expect(fixture.componentInstance.form().value.name).toBe('Acme Corp'));
    expect(fixture.componentInstance.form().value.role).toBe('admin');
  });

  it('keeps user edits when the same entity refetches', async () => {
    const fixture = TestBed.createComponent(QueryResourceEditFormComponent);
    fixture.detectChanges();
    await vi.waitFor(() => expect(fixture.componentInstance.form().value.name).toBe('Acme Corp'));
    fixture.componentInstance.form().controls.name.setValue('Edited Name');
    // A background refetch of the same entity (id unchanged) must not clobber the user's edits.
    await fixture.componentInstance.tenantQuery.reload();
    expect(fixture.componentInstance.form().value.name).toBe('Edited Name');
  });

  it('reports save success through the per-call callback', async () => {
    const fixture = TestBed.createComponent(QueryResourceEditFormComponent);
    fixture.detectChanges();
    await vi.waitFor(() => expect(fixture.componentInstance.form().value.name).toBe('Acme Corp'));
    vi.spyOn(Math, 'random').mockReturnValue(1); // deterministic success (1 < 0.15 is false)
    fixture.componentInstance.save();
    await vi.waitFor(() => expect(fixture.componentInstance.saveOutcome()).toBe('success'));
    expect(fixture.componentInstance.saving()).toBe(false);
  });
});
