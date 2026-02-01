import {A11yModule} from '@angular/cdk/a11y';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  Type,
  viewChild,
  ViewContainerRef,
} from '@angular/core';

import {TooltipPosition} from './tooltip.model';
import {isElementClickable, isElementInsideCollection} from './tooltip.util';

@Component({
  selector: 'cll-tooltip',
  imports: [A11yModule],
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent {
  left = input(0);
  top = input(0);
  width = input<number>();
  position = input<TooltipPosition>();
  triggerElementHovering = input(true); // if the trigger element (e.g. button) is being hovered

  contentContext = input<Record<string, any>>();

  /**
   * Content to display in the tooltip.
   * Can be a string, TemplateRef, ComponentRef, or Component Type.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content = input<string | TemplateRef<any> | ComponentRef<any> | Type<any>>();

  // force close is true
  closePopover = output<boolean>();

  contentContainer = viewChild.required('contentContainer', {
    read: ViewContainerRef,
  });

  text = signal('');
  showClose = true;
  tooltipHovering = false;

  private host = inject(ElementRef); // <cll-tooltip>

  constructor() {
    const cdr = inject(ChangeDetectorRef);

    // Effect to handle content changes
    effect(() => {
      const c = this.content();
      if (!c) {
        return;
      }

      if (typeof c === 'string') {
        this.text.set(c);
      } else if (c instanceof TemplateRef) {
        // Wait for the component to add the content container
        setTimeout(() => {
          this.contentContainer().createEmbeddedView(c, this.contentContext());
          cdr.detectChanges();
        });
      } else if (c instanceof ComponentRef) {
        setTimeout(() => {
          this.contentContainer().insert(c.hostView, 0);
          cdr.detectChanges();
        });
      } else if (c instanceof Type) {
        setTimeout(() => {
          this.contentContainer().createComponent(c);
          cdr.detectChanges();
        });
      }
    });
  }

  // get the children of the tooltip host element
  get tooltipChildren() {
    return this.host.nativeElement.children as HTMLCollection;
  }

  // click close button should force close the tooltip immediately
  closeTooltip() {
    this.closePopover.emit(true);
  }

  @HostListener('window:click', ['$event'])
  click(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target) {
      return;
    }

    // Close the tooltip if the user clicks the mouse outside the tooltip or the user clicks a clickable element inside the tooltip
    if (isElementClickable(target) || !isElementInsideCollection(target, this.tooltipChildren)) {
      this.closePopover.emit(true);
    }
  }

  mouseEnter(event: MouseEvent) {
    this.tooltipHovering = true;
  }

  mouseLeave(event: MouseEvent) {
    this.tooltipHovering = false;

    // Use a timeout to allow mouse to move to trigger element
    setTimeout(() => {
      // if mouse out and not place onto the trigger element, close the tooltip
      if (!this.triggerElementHovering()) {
        this.closePopover.emit(false);
      }
    }, 300);
  }

  @HostListener('body:keydown.escape', ['$event'])
  onEscape(event: Event) {
    this.closePopover.emit(true);
  }
}
