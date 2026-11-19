import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {Directive, effect, ElementRef, inject, input, PLATFORM_ID, signal} from '@angular/core';

/** Internal positioning behavior shared by floating inspector launchers. */
@Directive({
  selector: '[cllQueryDevtoolsLauncher]',
  host: {
    '[style.--cll-query-launcher-top]': 'top() === null ? null : top() + "px"',
    '[style.--cll-query-launcher-left]': 'left() === null ? null : left() + "px"',
    '[class.dragging]': 'dragging()',
    '(pointerdown)': 'startDrag($event)',
    '(keydown)': 'moveWithKeyboard($event)',
  },
})
export class QueryDevtoolsLauncherDirective {
  readonly cllQueryDevtoolsLauncher = input(false);
  private readonly element = inject<ElementRef<HTMLButtonElement>>(ElementRef);
  private readonly viewport = inject(DOCUMENT).defaultView;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly top = signal<number | null>(null);
  protected readonly left = signal<number | null>(null);
  protected readonly dragging = signal(false);
  private stopDrag?: () => void;
  private suppressClick = false;

  constructor() {
    effect((onCleanup) => {
      if (!this.cllQueryDevtoolsLauncher() || !this.isBrowser) return;
      const guardClick = (event: MouseEvent) => this.guardClick(event);
      this.element.nativeElement.addEventListener('click', guardClick, true);
      try {
        const stored = this.viewport?.sessionStorage.getItem('cll-query-devtools-launcher-top');
        const top = stored ? Number(stored) : NaN;
        if (Number.isFinite(top)) this.top.set(top);
      } catch {
        /* Positioning still works when browser storage is unavailable. */
      }
      onCleanup(() => {
        this.element.nativeElement.removeEventListener('click', guardClick, true);
        this.stopDrag?.();
        this.top.set(null);
        this.left.set(null);
        this.suppressClick = false;
      });
    });
  }

  protected startDrag(event: PointerEvent): void {
    if (!this.cllQueryDevtoolsLauncher() || !event.isPrimary || event.button !== 0) return;
    this.stopDrag?.();
    this.suppressClick = false;
    const handle = event.currentTarget as HTMLButtonElement;
    const start = handle.getBoundingClientRect();
    const previousTop = this.top();
    const pointerId = event.pointerId;
    const move = (move: PointerEvent) => {
      if (move.pointerId !== pointerId) return;
      const dx = move.clientX - event.clientX;
      const dy = move.clientY - event.clientY;
      if (!this.dragging() && Math.hypot(dx, dy) < 5) return;
      this.dragging.set(true);
      this.suppressClick = true;
      this.left.set(Math.max(0, Math.min(start.x + dx, (this.viewport?.innerWidth ?? 0) - start.width)));
      this.top.set(start.y + dy);
    };
    const finish = (up?: PointerEvent) => {
      if (up && up.pointerId !== pointerId) return;
      const moved = this.dragging();
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', finish);
      handle.removeEventListener('pointercancel', cancel);
      handle.removeEventListener('lostpointercapture', cancel);
      this.stopDrag = undefined;
      this.dragging.set(false);
      this.left.set(null);
      if (!up || up.type !== 'pointerup') this.top.set(previousTop);
      else if (moved)
        this.savePosition(
          Math.max(0, Math.min(this.top() ?? start.y, (this.viewport?.innerHeight ?? 0) - start.height)),
        );
      if (handle.hasPointerCapture(pointerId)) handle.releasePointerCapture(pointerId);
    };
    const cancel = (event?: PointerEvent) => finish(event);
    this.stopDrag = cancel;
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', finish);
    handle.addEventListener('pointercancel', cancel);
    handle.addEventListener('lostpointercapture', cancel);
    handle.setPointerCapture(pointerId);
  }

  protected guardClick(event: MouseEvent): void {
    if (!this.suppressClick || event.detail === 0) return;
    this.suppressClick = false;
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  protected moveWithKeyboard(event: KeyboardEvent): void {
    if (!this.cllQueryDevtoolsLauncher() || !['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const handle = event.currentTarget as HTMLButtonElement;
    const box = handle.getBoundingClientRect();
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? (this.viewport?.innerHeight ?? 0) - box.height
          : box.y + (event.key === 'ArrowUp' ? -20 : 20);
    this.savePosition(Math.max(0, Math.min(next, (this.viewport?.innerHeight ?? 0) - box.height)));
  }

  private savePosition(top: number): void {
    // CSS clamps to safe viewport bounds, including after a resize.
    this.top.set(top);
    try {
      this.viewport?.sessionStorage.setItem('cll-query-devtools-launcher-top', String(top));
    } catch {
      /* Storage is optional. */
    }
  }
}
