import {Clipboard} from '@angular/cdk/clipboard';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {CopyToClipboardDemoComponent} from './copy-to-clipboard-demo.component';

describe('CopyToClipboardDemoComponent', () => {
  let component: CopyToClipboardDemoComponent;
  let fixture: ComponentFixture<CopyToClipboardDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopyToClipboardDemoComponent],
      providers: [
        provideNoopAnimations(),
        {
          provide: Clipboard,
          useValue: {copy: vi.fn().mockReturnValue(true)},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CopyToClipboardDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update lastCopied on onCopied', () => {
    component.onCopied('test-token');
    expect(component.lastCopied()).toBe('test-token');
  });
});
