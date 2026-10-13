import {A11yModule} from '@angular/cdk/a11y';

import {
  afterEveryRender,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  computed,
  DestroyRef,
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
  ViewRef,
} from '@angular/core';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {tooltipTranslations} from './tooltip.l10n';
import {TooltipPosition} from './tooltip.model';
import {isElementClickable, isElementInsideCollection} from './tooltip.util';

@Component({
  selector: 'cll-tooltip',
  imports: [A11yModule, TranslatePipe],
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

  contentContext = input<Record<string, unknown>>();
  /** Accessible name for interactive template/component content. */
  accessibleLabel = input('');
  readonly interactive = computed(() => !!this.content() && typeof this.content() !== 'string');
  readonly dialogLabel = computed(() => this.accessibleLabel() || this.translationService.translate('tooltip.details'));
  private readonly translationService = inject(TranslationService);

  /**
   * Content to display in the tooltip.
   * Can be a string, TemplateRef, ComponentRef, or Component Type.
   */
  content = input<string | TemplateRef<unknown> | ComponentRef<unknown> | Type<unknown>>();

  // force close is true
  closePopover = output<boolean>();

  contentContainer = viewChild.required('contentContainer', {read: ViewContainerRef});
  private contentContainerQuery = viewChild('contentContainer', {read: ViewContainerRef});

  text = signal('');
  showClose = true;
  tooltipHovering = false;

  private host = inject<ElementRef<HTMLElement>>(ElementRef); // <cll-tooltip>

  private contentView?: ViewRef;
  private contentViewContainer?: ViewContainerRef;
  private borrowedElement?: Element;
  private borrowedView?: ViewRef;
  private borrowedComponent?: ComponentRef<unknown>;
  private borrowedParent?: Node | null;
  private borrowedNextSibling?: Node | null;
  private leaveTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(TranslationService).loadTranslationsForComponent('tooltip', tooltipTranslations);
    const cdr = inject(ChangeDetectorRef);
    afterEveryRender(() => {
      // Detached caller-owned components still need to render input/signal updates.
      // Keep their application/container attachment and destruction ownership intact.
      const borrowed = this.borrowedComponent;
      if (borrowed && !borrowed.hostView.destroyed) {
        borrowed.changeDetectorRef.detectChanges();
      }
    });
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.leaveTimer);
      this.releaseContent();
    });

    effect((onCleanup) => {
      const content = this.content();
      const context = this.contentContext();
      this.releaseContent();
      this.text.set(typeof content === 'string' ? content : '');
      if (!content || typeof content === 'string') {
        return;
      }

      const timer = setTimeout(() => {
        const container = this.contentContainerQuery();
        if (!container) {
          return;
        }
        this.contentViewContainer = container;
        if (content instanceof TemplateRef) {
          this.contentView = container.createEmbeddedView(content, context);
        } else if (content instanceof ComponentRef) {
          if (content.hostView.destroyed) {
            return;
          }
          const element: unknown = content.location.nativeElement;
          const target: unknown = container.element.nativeElement;
          if (element instanceof Element && target instanceof Element) {
            this.borrowedElement = element;
            this.borrowedView = content.hostView;
            this.borrowedComponent = content;
            this.borrowedParent = element.parentNode;
            this.borrowedNextSibling = element.nextSibling;
            if (target.parentNode) {
              target.parentNode.insertBefore(element, target.nextSibling);
            } else {
              target.appendChild(element);
            }
            // The caller retains ownership of its view and change detection.
            content.changeDetectorRef.detectChanges();
          }
        } else if (content instanceof Type) {
          this.contentView = container.createComponent(content).hostView;
        }
        cdr.detectChanges();
      });
      onCleanup(() => {
        clearTimeout(timer);
        this.releaseContent();
      });
    });
  }

  /** Restores borrowed DOM and destroys only views created by this tooltip. */
  releaseContent() {
    const view = this.contentView;
    const container = this.contentViewContainer;
    if (view && container && !view.destroyed) {
      const index = container.indexOf(view);
      if (index !== -1) {
        container.remove(index);
      }
    }
    this.contentView = undefined;
    this.contentViewContainer = undefined;
    if (this.borrowedElement) {
      const sibling = this.borrowedNextSibling?.parentNode === this.borrowedParent ? this.borrowedNextSibling : null;
      if (this.borrowedParent && !this.borrowedView?.destroyed) {
        this.borrowedParent.insertBefore(this.borrowedElement, sibling ?? null);
      } else {
        this.borrowedElement.remove();
      }
    }
    this.borrowedElement = undefined;
    this.borrowedView = undefined;
    this.borrowedComponent = undefined;
    this.borrowedParent = undefined;
    this.borrowedNextSibling = undefined;
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
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    // Close the tooltip if the user clicks the mouse outside the tooltip or the user clicks a clickable element inside the tooltip
    if (
      isElementClickable(target, this.host.nativeElement.firstElementChild ?? undefined) ||
      !isElementInsideCollection(target, this.tooltipChildren)
    ) {
      this.closePopover.emit(true);
    }
  }

  mouseEnter() {
    clearTimeout(this.leaveTimer);
    this.leaveTimer = undefined;
    this.tooltipHovering = true;
  }

  mouseLeave() {
    this.tooltipHovering = false;

    // Use a timeout to allow mouse to move to trigger element
    clearTimeout(this.leaveTimer);
    this.leaveTimer = setTimeout(() => {
      this.leaveTimer = undefined;
      // if mouse out and not place onto the trigger element, close the tooltip
      if (!this.triggerElementHovering()) {
        this.closePopover.emit(false);
      }
    }, 300);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closePopover.emit(true);
  }
}
