import {Component, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {describe, expect, it, vi} from 'vitest';

import {ScrollIntoViewDirective} from './scroll-into-view.directive';

@Component({
  template: ` <div id="target" [ngxScrollIntoView]="shouldScroll()" [scrollOptions]="options"></div> `,
  imports: [ScrollIntoViewDirective],
})
class TestHostComponent {
  shouldScroll = signal<boolean | ''>(true);
  options: ScrollIntoViewOptions = {behavior: 'smooth', block: 'start'};
}

describe('ScrollIntoViewDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let targetEl: HTMLElement;
  let scrollMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    targetEl = fixture.nativeElement.querySelector('#target') as HTMLElement;
    scrollMock = vi.fn();
    targetEl.scrollIntoView = scrollMock;
  });

  it('should scroll element into view when enabled', () => {
    fixture.detectChanges();

    expect(scrollMock).toHaveBeenCalledWith({behavior: 'smooth', block: 'start'});
  });

  it('should not scroll when condition is false', () => {
    fixture.componentInstance.shouldScroll.set(false);
    fixture.detectChanges();

    expect(scrollMock).not.toHaveBeenCalled();
  });

  it('should scroll when condition transitions from false to true', () => {
    fixture.componentInstance.shouldScroll.set(false);
    fixture.detectChanges();
    expect(scrollMock).not.toHaveBeenCalled();

    fixture.componentInstance.shouldScroll.set(true);
    fixture.detectChanges();
    expect(scrollMock).toHaveBeenCalledTimes(1);
  });
});
