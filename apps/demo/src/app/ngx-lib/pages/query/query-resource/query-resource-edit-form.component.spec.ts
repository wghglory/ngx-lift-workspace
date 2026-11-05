import {signal} from '@angular/core';
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

  it('initializes a stable form from the query result', async () => {
    const fixture = TestBed.createComponent(QueryResourceEditFormComponent);
    expect(fixture.componentInstance.form.value.name).toBe('');
    fixture.detectChanges();
    await vi.waitFor(() => expect(fixture.componentInstance.form.value.name).toBe('Acme Corp'));
    expect(fixture.componentInstance.form.value.role).toBe('admin');
  });

  it('keeps user edits when the same entity refetches', async () => {
    const fixture = TestBed.createComponent(QueryResourceEditFormComponent);
    fixture.detectChanges();
    await vi.waitFor(() => expect(fixture.componentInstance.form.value.name).toBe('Acme Corp'));
    const form = fixture.componentInstance.form;
    form.controls.name.setValue('Edited Name');

    // execute() resolves after the fresh response arrives.
    const before = fixture.componentInstance.tenantQuery.value();
    await fixture.componentInstance.tenantQuery.execute();
    fixture.detectChanges();
    expect(fixture.componentInstance.tenantQuery.value()).not.toBe(before);
    // The same-id refetch must NOT rebuild the form nor clobber the edit.
    expect(fixture.componentInstance.form).toBe(form);
    expect(fixture.componentInstance.form.value.name).toBe('Edited Name');
  });

  it('retains edits through an absent value and resets the same form for a different entity', () => {
    const fixture = TestBed.createComponent(QueryResourceEditFormComponent);
    const value = signal<{id: string; name: string; role: string} | undefined>({
      id: 'one',
      name: 'First',
      role: 'admin',
    });
    vi.spyOn(fixture.componentInstance.tenantQuery, 'value').mockImplementation(value);
    fixture.detectChanges();
    const form = fixture.componentInstance.form;
    form.controls.name.setValue('Edited');
    form.markAsDirty();
    form.controls.name.markAsTouched();

    value.set(undefined);
    fixture.detectChanges();
    expect(fixture.componentInstance.form).toBe(form);
    value.set({id: 'one', name: 'Refetched', role: 'admin'});
    fixture.detectChanges();
    expect(fixture.componentInstance.form).toBe(form);
    expect(form.controls.name.value).toBe('Edited');
    value.set({id: 'two', name: 'Second', role: 'user'});
    expect(fixture.componentInstance.loaded()).toBe(false);
    const mutate = vi.spyOn(fixture.componentInstance.saveMutation, 'mutate');
    fixture.componentInstance.save();
    expect(mutate).not.toHaveBeenCalled();
    fixture.detectChanges();
    expect(fixture.componentInstance.form).toBe(form);
    expect(fixture.componentInstance.loaded()).toBe(true);
    expect(form.pristine).toBe(true);
    expect(form.controls.name.untouched).toBe(true);
    expect(fixture.componentInstance.form.controls.name.value).toBe('Second');
  });

  it('reflects the save result through the mutation ref state', async () => {
    const fixture = TestBed.createComponent(QueryResourceEditFormComponent);
    fixture.detectChanges();
    await vi.waitFor(() => expect(fixture.componentInstance.form.value.name).toBe('Acme Corp'));

    // Deterministic success (Math.random() < 0.15 is false).
    vi.spyOn(Math, 'random').mockReturnValue(1);
    const mutate = vi.spyOn(fixture.componentInstance.saveMutation, 'mutate');
    fixture.componentInstance.save();
    await vi.waitFor(() => expect(fixture.componentInstance.saveMutation.status()).toBe('resolved'));
    expect(mutate).toHaveBeenCalledWith({id: 'tenant-1', name: 'Acme Corp', role: 'admin'});
    expect(fixture.componentInstance.saveMutation.isLoading()).toBe(false);

    // Deterministic failure (Math.random() < 0.15 is true); status() tracks only the latest call.
    vi.spyOn(Math, 'random').mockReturnValue(0);
    fixture.componentInstance.save();
    await vi.waitFor(() => expect(fixture.componentInstance.saveMutation.status()).toBe('error'));
  });
});
