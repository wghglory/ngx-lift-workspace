import {ComponentFixture, TestBed} from '@angular/core/testing';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {MutationStarterComponent} from './mutation-starter.component';

describe('MutationStarterComponent save workflow', () => {
  let fixture: ComponentFixture<MutationStarterComponent>;
  let component: MutationStarterComponent;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({imports: [MutationStarterComponent]}).compileComponents();
    fixture = TestBed.createComponent(MutationStarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    fixture.destroy();
    vi.useRealTimers();
  });

  it('ignores empty names without starting a write', async () => {
    component.name.set('   ');
    expect(component.saveDisabled()).toBe(true);
    await component.save();
    expect(component.saveTeamMutation.isLoading()).toBe(false);
    expect(component.saveTeamMutation.value()).toBeUndefined();
  });

  it('trims the submitted name and prevents a second save while pending', async () => {
    component.name.set('  Atlas team  ');
    expect(component.saveDisabled()).toBe(false);
    const first = component.save();
    expect(component.saveTeamMutation.isLoading()).toBe(true);
    expect(component.saveDisabled()).toBe(true);
    component.name.set('A second click');
    await component.save();
    await vi.advanceTimersByTimeAsync(350);
    await first;
    expect(component.saveTeamMutation.value()).toEqual({name: 'Atlas team'});
    expect(component.saveTeamMutation.isLoading()).toBe(false);
    expect(component.saveDisabled()).toBe(false);
  });

  it('preserves failed input and clears the error on a successful retry', async () => {
    component.name.set('Beacon team');
    component.simulateFailure.set(true);
    const failed = component.save();
    await vi.advanceTimersByTimeAsync(350);
    await expect(failed).resolves.toBeUndefined();
    expect(component.saveTeamMutation.error()).toEqual(new Error('Simulated save failure'));
    expect(component.name()).toBe('Beacon team');
    expect(component.saveDisabled()).toBe(false);

    component.simulateFailure.set(false);
    const retry = component.save();
    await vi.advanceTimersByTimeAsync(350);
    await retry;
    expect(component.saveTeamMutation.error()).toBeNull();
    expect(component.saveTeamMutation.value()).toEqual({name: 'Beacon team'});
  });
});
