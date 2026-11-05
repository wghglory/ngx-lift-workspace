import {TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {describe, expect, it, vi} from 'vitest';
import {QueryResourceEditFormComponent} from './query-resource-edit-form.component';

describe('QueryResourceEditFormComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QueryResourceEditFormComponent],
      providers: [provideNoopAnimations()],
    });
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
    const form = fixture.componentInstance.form();
    form.controls.name.setValue('Edited Name');

    // reload() returns a boolean; it only kicks off the refetch, so we must wait for the NEW response
    // object to arrive (reference change) before asserting.
    const before = fixture.componentInstance.tenantQuery.value();
    fixture.componentInstance.tenantQuery.reload();
    await vi.waitFor(() => expect(fixture.componentInstance.tenantQuery.value()).not.toBe(before));

    // The same-id refetch must NOT rebuild the form nor clobber the edit.
    expect(fixture.componentInstance.form()).toBe(form);
    expect(fixture.componentInstance.form().value.name).toBe('Edited Name');
  });

  it('reflects the save result through the mutation ref state', async () => {
    const fixture = TestBed.createComponent(QueryResourceEditFormComponent);
    fixture.detectChanges();
    await vi.waitFor(() => expect(fixture.componentInstance.form().value.name).toBe('Acme Corp'));

    // Deterministic success (Math.random() < 0.15 is false).
    vi.spyOn(Math, 'random').mockReturnValue(1);
    fixture.componentInstance.save();
    await vi.waitFor(() => expect(fixture.componentInstance.saveMutation.status()).toBe('resolved'));
    expect(fixture.componentInstance.saveMutation.isLoading()).toBe(false);

    // Deterministic failure (Math.random() < 0.15 is true); status() tracks only the latest call.
    vi.spyOn(Math, 'random').mockReturnValue(0);
    fixture.componentInstance.save();
    await vi.waitFor(() => expect(fixture.componentInstance.saveMutation.status()).toBe('error'));
  });
});
