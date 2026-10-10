import {Clipboard} from '@angular/cdk/clipboard';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {MaskedValueFieldDemoComponent} from './masked-value-field-demo.component';

describe('MaskedValueFieldDemoComponent', () => {
  let component: MaskedValueFieldDemoComponent;
  let fixture: ComponentFixture<MaskedValueFieldDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaskedValueFieldDemoComponent],
      providers: [
        provideNoopAnimations(),
        {
          provide: Clipboard,
          useValue: {copy: vi.fn().mockReturnValue(true)},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MaskedValueFieldDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
